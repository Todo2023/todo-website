/*
 * robots.txt を組み立てます。
 *
 * 環境変数 NOINDEX に 1 が入っているときは、
 * 検索エンジンにいっさい登録させない内容になります。
 * （Cloudflare Pages 側の「控えのサイト」で使っています。
 *   同じ内容のサイトが2つ検索に出ると、評価が分散してしまうためです）
 */
import { site } from '../data/site.mjs';

const isNoindex = process.env.NOINDEX === '1';

export function GET() {
  const body = isNoindex
    ? ['User-agent: *', 'Disallow: /', ''].join('\n')
    : ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('/sitemap-index.xml', site.url).href}`, ''].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
