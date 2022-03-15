const got = require('@/utils/got');
const cheerio = require('cheerio');
const {
    parseDate
} = require('@/utils/parse-date');

module.exports = async (ctx) => {
    const cid = ctx.params.cid;
    let url = `http://www.playno1.com/portal.php?mod=list&catid=${cid}`;
    const response = await got({
        url,
        headers: {
            cookie: 'HZ1J_2846_saltkey=bCWk3bP0; HZ1J_2846_lastvisit=1646803922; HZ1J_2846_sid=JVZEJv; playno1=playno1Cookie; _ga=GA1.2.65235222.1646807533; _gid=GA1.2.983610307.1646807533; playno1_referer=/portal.php; __atuvc=4|10; __atuvs=62284a40c731927f003; HZ1J_2846_lastact=1646808042    misc.php    secqaa; HZ1J_2846_secqaaSJVZEJv0=c10dxRBST5WJRv9sQX3AVWsNTpAn2TjmTWVMQgF5Yh4gVkzk5AZBGAzDD7VXGfZJ/KSOOogd5O8mgoxnrrntIg7AkI9ZU0ilGqJvqd6LrxMrtQKfsSxGSmPk'
        }
    });
    const data = response.data;
    const $ = cheerio.load(data);
    const list = $('div#ct div.fire_float');
    ctx.state.data = {
        title: `AV新闻-新人`,
        link: url,
        item: list.map((index, item) => {
                item = $(item);
                let a_name = item.find('a').first();
                return {
                    title: a_name.attr('title'),
                    description: item.find('p.fire_p').first().text(),
                    pubDate: parseDate(item.find('.fire_dv').first().text(), 'YYYY-MM-DD HH:mm:ss'),
                    link: a_name.attr('href'),
                }
            })
            .get(),
    };
};