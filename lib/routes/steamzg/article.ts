import { Data, DataItem, Route } from '@/types';
import ofetch from '@/utils/ofetch';
import { load } from 'cheerio';
import { parseDate } from '@/utils/parse-date';
import type { Context } from 'hono';

export const route: Route = {
    path: '/article',
    categories: ['blog'],
    example: '/steamzg/article',
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
    },
    name: 'Article',
    maintainers: ['karmasun'],
    handler,
};

async function handler(_: Context): Promise<Data> {
    const baseUrl = 'https://steamzg.com/category/单机游戏/';
    const headers = {
        'Sec-Ch-Ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
    };
    const response = await ofetch(baseUrl, { headers });
    const $ = load(response);
    const feedItems = $('.poi-row article')
        .toArray()
        .map((item) => {
            const oitem = $(item);
            const a_name = oitem.find('h3 a').first();
            return {
                title: a_name.text(),
                description: a_name.text(),
                pubDate: parseDate(oitem.find('time').first().attr('datetime') || ''),
                link: a_name.attr('href'),
            };
        });
    return {
        title: 'steamzg游戏资源',
        link: baseUrl,
        description: '',
        item: feedItems as DataItem[],
    };
}
