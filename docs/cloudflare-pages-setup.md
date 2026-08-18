# Cloudflare Pages に「控えのサイト」を用意する手順

Netlifyのビルド枠を使い切ったときでも、更新した結果を確認できるようにするための控えです。
**正式なサイトはあくまで https://todo-llc.netlify.app です。**

所要10分ほどです。難しい判断は出てきません。

---

## この控えは、検索に出ません

同じ内容のサイトが2つ検索結果に出ると、Googleがどちらを正とするか迷い、
評価が分かれてしまいます。それを防ぐため、控えのサイトには
「検索エンジンは登録しないでください」という指示を入れてあります。

- 全ページに `noindex` の指示が入ります
- `robots.txt` が「すべて登録禁止」になります
- `sitemap.xml` を作りません

URLを知っている人は普通に見られます。**Googleにだけ載らない**という状態です。

この切り替えは、手順5で設定する **`NOINDEX` という環境変数** ひとつで決まります。

---

## STEP 1：Cloudflareに登録する

1. https://dash.cloudflare.com/sign-up を開く
2. メールアドレス（`todo.inc.2023.10.13@gmail.com`）とパスワードを決めて登録
3. 確認メールが届くので、リンクを押して有効化

> **クレジットカードは登録しないでください。**
> 登録しなければ、上限を超えても課金が起きようがありません。
> 無料プランはカードなしで使えます。

---

## STEP 2：Pages を開く

1. 左メニューから「**Compute (Workers)**」または「**Workers & Pages**」を選ぶ
2. 「**Create**」→「**Pages**」タブ →「**Connect to Git**」

---

## STEP 3：GitHubをつなぐ

1. 「**Connect GitHub**」を押す
2. GitHubのログイン画面が出たらログイン
3. どのリポジトリを許可するか聞かれたら、
   「**Only select repositories**」→ `Todo2023/todo-website` を選ぶ
   （すべて許可でも構いませんが、1つだけ選ぶほうが安全です）
4. 「**Install & Authorize**」を押す

---

## STEP 4：ビルドの設定

リポジトリ一覧から `todo-website` を選び、「**Begin setup**」を押します。
次の項目を、この通りに入力してください。

| 項目 | 入力内容 |
| --- | --- |
| Project name | `todo-llc-preview` |
| Production branch | `main` |
| Framework preset | `Astro` |
| Build command | `npm run build` |
| Build output directory | `dist` |

> Framework preset で `Astro` を選ぶと、Build command と output は
> 自動で埋まることがあります。その場合は上の表と一致しているか確認するだけでOKです。
>
> Node.js のバージョンは、リポジトリに置いた `.node-version` ファイルで
> 自動的に決まります。画面で指定する必要はありません。

---

## STEP 5：環境変数を入れる（★重要）

同じ画面の「**Environment variables (advanced)**」を開き、
「**Add variable**」を押して次を追加します。

| Variable name | Value |
| --- | --- |
| `NOINDEX` | `1` |

**ここを入れ忘れると、控えのサイトが検索結果に出てしまい、逆効果になります。**
必ず入れてください。

---

## STEP 6：公開する

「**Save and Deploy**」を押します。1〜2分で完了します。

`https://todo-llc-preview.pages.dev` のようなURLが表示されます。
開いて、サイトが正しく表示されることを確認してください。

---

## 確認テスト（1分）

控えのサイトのURLの末尾に `/robots.txt` を付けて開いてください。

例）`https://todo-llc-preview.pages.dev/robots.txt`

次の2行だけが表示されれば成功です。

```
User-agent: *
Disallow: /
```

`Allow: /` と出た場合は、STEP 5の環境変数が入っていません。
Pagesの設定画面 → Settings → Environment variables から追加し、
「Retry deployment」で作り直してください。

---

## これで何ができるようになるか

- GitHubに変更を送ると、**Netlifyが止まっていてもCloudflare側は更新されます**
- 更新した内容を、実際の画面で確認できます
- 検索順位には一切影響しません

---

## 将来、正式サイトを Cloudflare に移すとき

Netlifyの枠が戻らない場合や、独自ドメインを取った場合の切り替え手順です。
**自己判断で行わず、事前に相談してください。** URLが変わると検索順位に影響します。

1. Cloudflare Pages の設定から、環境変数 `NOINDEX` を**削除**する
2. `src/data/site.mjs` の `url` を新しいURLに書き換える
3. Netlify側は、新URLへ転送する設定に変える（`_redirects` ファイルを置きます）
4. Search Console に新しいURLを登録し、アドレス変更を申請する

独自ドメインを取っていれば、URLが変わらないため 2〜4 はほぼ不要になります。
**移行するなら、独自ドメインを取ってからが安全です。**
