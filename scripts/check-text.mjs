/**
 * 文章に日本語以外の文字（ハングル・キリル文字・簡体字など）が
 * 紛れ込んでいないか調べる。npm run check で実行されます。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const SUSPECT = [
  [/[가-힯]/g, 'ハングル'],
  [/[Ѐ-ӿ]/g, 'キリル文字'],
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (['.astro', '.mjs', '.md'].includes(extname(p))) out.push(p);
  }
  return out;
}

let bad = 0;
for (const file of walk('src')) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const [re, label] of SUSPECT) {
      const hits = line.match(re);
      if (hits) {
        console.error(`${file}:${i + 1}  ${label}が混入: ${[...new Set(hits)].join('')}`);
        console.error(`    ${line.trim()}`);
        bad++;
      }
    }
  });
}

if (bad) {
  console.error(`\n${bad}件見つかりました。`);
  process.exit(1);
}
console.log('文字チェック: 問題ありません');
