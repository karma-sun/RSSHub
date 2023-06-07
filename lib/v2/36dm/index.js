const got = require('@/utils/got');
const cheerio = require('cheerio');
const {
    parseDate
} = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const cid = ctx.params.cid;
    let baseUrl = 'https://www.36dm.org/';
    let url = baseUrl + (cid? `forum-${cid}.html` :  '');
    const response = await got({
        url,
    });
    const data = response.data;
    const $ = cheerio.load(data);
    const list = $('ul.threadlist li:not(:has(a[href="thread-293154.htm"]))');
    ctx.state.data = {
        title: ($('ol.breadcrumb li.active a').text() ? $('ol.breadcrumb li.active a').text() + ' - ' : '') + '36dm',
        link: url,
        item: list.map((index, item) => {
                item = $(item);
                let a_name = item.find('a[href^="thread-"]').first();
                return {
                    title: a_name.text(),
                    description: a_name.text(),
                    link: baseUrl + a_name.attr('href'),
                }
            })
            .get(),
    };
};