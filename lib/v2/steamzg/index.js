const got = require('@/utils/got');
const cheerio = require('cheerio');
const {
    parseDate
} = require('@/utils/parse-date');

module.exports = async (ctx) => {
    let url = `https://steamzg.com/`;
    const response = await got({
        url,
    });
    const data = response.data;
    const $ = cheerio.load(data);
    const list = $('div[data-icon="gamepad"] article');
    ctx.state.data = {
        title: `steamzg游戏资源`,
        link: url,
        item: list.map((index, item) => {
                item = $(item);
                let a_name = item.find('h3 a').first();
                return {
                    title: a_name.text(),
                    description: a_name.text(),
                    pubDate: parseDate(item.find('time').first().attr('datetime')),
                    link: a_name.attr('href')
                }
            })
            .get(),
    };
};