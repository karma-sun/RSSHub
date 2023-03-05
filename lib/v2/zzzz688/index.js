const got = require('@/utils/got');
const cheerio = require('cheerio');
const {
    parseDate
} = require('@/utils/parse-date');

module.exports = async (ctx) => {
    let url = `https://www.zzzz688.com/`;
    const response = await got({
        url,
    });
    const data = response.data;
    const $ = cheerio.load(data);
    const list = $('div#archive-wrap article');
    ctx.state.data = {
        title: `游戏天堂情报`,
        link: url,
        item: list.map((index, item) => {
                item = $(item);
                let a_name = item.find('h2.entry-title a').first();
                return {
                    title: a_name.text(),
                    description: a_name.text(),
                    pubDate: parseDate(item.find('time.entry-published').first().attr('datetime')),
                    link: a_name.attr('href')
                }
            })
            .get(),
    };
};