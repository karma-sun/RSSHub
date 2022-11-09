const got = require('@/utils/got');
const cheerio = require('cheerio');
const {
    parseDate
} = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const cid = ctx.params.cid;
    let url = `https://news.dmzj.com/${cid}`;
    const response = await got({
        url,
    });
    const data = response.data;
    const $ = cheerio.load(data);
    const list = $('div.briefnews_con_li');
    ctx.state.data = {
        title: `dmzj情报`,
        link: url,
        item: list.map((index, item) => {
                item = $(item);
                let a_name = item.find('h3 a').first();
                return {
                    title: a_name.text(),
                    description: a_name.text(),
                    pubDate: parseDate(item.find('p.head_con_p_o span').first().text(), 'YYYY-MM-DD HH:mm'),
                    link: a_name.attr('href')
                }
            })
            .get(),
    };
};