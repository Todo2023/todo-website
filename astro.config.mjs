// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/data/site.mjs';

// site（サイトのURL）は src/data/site.mjs で設定します。
// sitemap.xml と robots.txt の生成に使われるため、独自ドメインを取ったら必ず更新してください。
export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  // 控えのサイト（NOINDEX=1）では sitemap.xml を作りません。
  integrations: process.env.NOINDEX === '1' ? [] : [sitemap()],
  build: { format: 'directory' },
});
