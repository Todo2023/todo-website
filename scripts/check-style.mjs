/**
 * 表記ゆれを検出する。npm run build のたびに走ります。
 *
 * ルールを足したいときは、下の RULES に1行追加してください。
 *   [見つけたら困る書き方（正規表現）, 正しい書き方, 理由]
 *
 * 文章の都合でどうしても使いたい場合は、その行の末尾に
 * 「// style-ok」と書くと、その行だけ見逃します。
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const RULES = [
  // --- 会社・人物の呼び方 ---
  [/弊社/g, '当社', '一人称は「当社」に統一'],
  [/弊社スタッフ|当社スタッフ|自社スタッフ/g, '連携するメンバー', '社員は代表のみ。雇用と読める語を使わない'],
  [/マーケティング専門スタッフ/g, 'マーケティングのメンバー', '同上'],
  [/専門スタッフ/g, '専門人材／メンバー', '同上'],
  [/在籍しているメンバー|社員が担当/g, '連携するメンバー', '同上'],

  // --- 問い合わせまわり（ページ間で食い違いやすい） ---
  [/できるだけ早く(折り返|ご返信|返信)/g, '2営業日以内にご返信します', '返信の目安はページ間で揃える'],

  // --- 送り仮名・ひらがな書き ---
  [/下さい/g, 'ください', '補助動詞はひらがな'],
  [/致します/g, 'いたします', '補助動詞はひらがな'],
  [/出来(る|ます|ない)/g, 'でき$1', '補助動詞はひらがな'],
  [/頂(く|き|ける|けます)/g, 'いただ$1', '補助動詞はひらがな'],
  [/お問合せ|お問合わせ|問い合せ/g, 'お問い合わせ', '送り仮名を統一'],

  // --- 表記の形 ---
  [/[０-９]/g, '半角数字', '数字は半角'],
  [/[Ａ-Ｚａ-ｚ]/g, '半角英字', '英字は半角'],
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
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (line.includes('// style-ok')) return;
    // コメント行は対象外
    const body = line.replace(/^\s*(\/\/|\*|#).*$/, '');
    for (const [re, good, why] of RULES) {
      const hits = body.match(re);
      if (hits) {
        console.error(`${file}:${i + 1}  「${[...new Set(hits)].join('」「')}」→「${good}」（${why}）`);
        console.error(`    ${line.trim().slice(0, 100)}`);
        bad++;
      }
    }
  });
}

if (bad) {
  console.error(`\n表記チェック: ${bad}件見つかりました。`);
  console.error('どうしてもその書き方が必要な場合は、行末に // style-ok を付けてください。');
  process.exit(1);
}
console.log('表記チェック: 問題ありません');
