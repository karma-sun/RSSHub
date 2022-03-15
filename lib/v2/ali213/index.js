const got = require('@/utils/got');
const cheerio = require('cheerio');
const {
    parseDate
} = require('@/utils/parse-date');

module.exports = async (ctx) => {
    let url = 'https://www.ali213.net/news/game/';
    const response = await got({
        url,
    });
    const data = response.data;
    const $ = cheerio.load(data);
    const list = $('div.news_list div.n_lone');
    ctx.state.data = {
        title: '游侠网资讯',
        link: url,
        item: list.map((index, item) => {
                item = $(item);
                let a_name = item.find('a').first();
                return {
                    title: a_name.text(),
                    description: a_name.text(),
                    pubDate: parseDate(item.find('div.lone_f_r_f span').first().text(), 'MM-DD'),
                    link: a_name.attr('href'),
                }
            })
            .get(),
    };
};