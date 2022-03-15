const got = require('@/utils/got');
const cheerio = require('cheerio');
const {
    parseDate
} = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const cid = ctx.params.cid;
    let url = `https://www.36dm.club/sort-${cid}-1.html`;
    const response = await got({
        url,
    });
    const data = response.data;
    const $ = cheerio.load(data);
    const list = $('tbody#data_list tr');
    ctx.state.data = {
        title: `36dm的发布资源`,
        link: url,
        item: list.map((index, item) => {
                item = $(item);
                let a_name = item.find('td[style="text-align:left;"] a').first();
                return {
                    title: a_name.text(),
                    description: a_name.text(),
                    pubDate: parseDate(item.find('td:first-child').first().text(), 'MM/DD HH:mm'),
                    link: 'https://www.36dm.club' + a_name.attr('href'),
                    enclosure_url: a_name.attr('href').replace('.html', '').replace('/show-', 'magnet:?xt=urn:btih:'),
                    enclosure_type: 'application/x-bittorrent',
                }
            })
            .get(),
    };
};