/**
 * 合同会社To do お問い合わせフォーム 自動生成スクリプト
 * =====================================================================
 *
 * このスクリプトを1回実行するだけで、
 *   ・お問い合わせフォーム（全8問）
 *   ・回答が溜まるスプレッドシート
 *   ・新しい回答が来たときの通知メール
 * がまとめて作られます。手で12項目を入力する必要はありません。
 *
 * ---------------------------------------------------------------------
 * 使い方（3分）
 * ---------------------------------------------------------------------
 * 1. https://script.google.com/ を開く
 *    ★必ず todo.inc.2023.10.13@gmail.com でログインしてください。
 *      ログインしたアカウントがフォームの所有者になります。
 *
 * 2. 「新しいプロジェクト」を作成
 *
 * 3. 最初から書かれているコード（function myFunction() {} ）を
 *    すべて削除し、このファイルの中身を丸ごと貼り付けて保存（Ctrl+S）
 *
 * 4. 画面上部の関数選択で「createContactForm」を選び、「実行」を押す
 *
 * 5. 初回のみ権限の確認が出ます
 *    「権限を確認」→ アカウントを選択 →
 *    「このアプリは確認されていません」と出たら
 *    「詳細」→「(安全ではないページ)に移動」→「許可」
 *    ※自分で書いたスクリプトなので、この警告は正常です。
 *      許可するのはフォーム作成・スプレッドシート作成・メール送信のみです。
 *
 * 6. 下部の「実行ログ」に3つのURLが出ます。
 *    ・編集用URL          … フォームを直すとき
 *    ・回答フォームURL     … これをサイトに貼ります
 *    ・回答スプレッドシート … 問い合わせ内容が溜まります
 *
 * 7. 「回答フォームURL」をコピーして、
 *    src/data/site.mjs の formUrl: null, を
 *    formUrl: 'コピーしたURL', に書き換えてください。
 *
 * ---------------------------------------------------------------------
 * やり直したいとき
 * ---------------------------------------------------------------------
 * もう一度実行すると、別のフォームが新しく作られます（上書きされません）。
 * 不要なフォームは Googleドライブから削除してください。
 */

// ===== 設定（必要ならここだけ変えてください）==========================

/** 問い合わせ通知の宛先。空にすると通知メールは送りません。 */
var NOTIFY_EMAIL = 'todo.inc.2023.10.13@gmail.com';

/** フォームのタイトル */
var FORM_TITLE = 'お問い合わせ｜合同会社To do';

/** 回答スプレッドシートの名前 */
var SHEET_TITLE = 'お問い合わせ回答｜合同会社To do';

// =====================================================================


/**
 * メインの処理。この関数を実行してください。
 */
function createContactForm() {
  var form = FormApp.create(FORM_TITLE);

  form.setDescription(
    'ご相談・お見積りは無料です。「これは頼めるだろうか」という段階でも構いません。\n' +
    '2営業日以内にご返信します。\n\n' +
    'いただいた内容は、ご連絡およびご提案の目的にのみ使用します。'
  );

  // 回答者にGoogleログインを強制しない（メールは質問として聞く）
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(false);
  form.setAllowResponseEdits(false);

  // --- Q1 会社名・団体名 ---------------------------------------------
  form.addTextItem()
    .setTitle('会社名・団体名')
    .setHelpText('個人の方は空欄で構いません。')
    .setRequired(false);

  // --- Q2 お名前 -------------------------------------------------------
  form.addTextItem()
    .setTitle('お名前')
    .setRequired(true);

  // --- Q3 メールアドレス -----------------------------------------------
  var emailValidation = FormApp.createTextValidation()
    .setHelpText('メールアドレスの形式でご入力ください。')
    .requireTextIsEmail()
    .build();

  form.addTextItem()
    .setTitle('メールアドレス')
    .setRequired(true)
    .setValidation(emailValidation);

  // --- Q4 ご相談の種類（複数選択）--------------------------------------
  form.addCheckboxItem()
    .setTitle('ご相談の種類')
    .setHelpText('当てはまるものをお選びください。複数可、わからない場合は未選択で構いません。')
    .setChoiceValues([
      'アドバイザリー（課題の整理・事業戦略）',
      '営業・販促資料の作成',
      'ロゴ・名刺等のデザイン',
      '秘書・バックオフィス代行',
      'AI活用・業務自動化',
      'その他・まだ決まっていない',
    ])
    .setRequired(false);

  // --- Q5 ご相談の概要 -------------------------------------------------
  form.addParagraphTextItem()
    .setTitle('ご相談の概要')
    .setHelpText('一言で構いません。現在おかれている状況や、お困りごとをお書きください。')
    .setRequired(true);

  // --- Q6 ご希望の連絡方法 ---------------------------------------------
  form.addMultipleChoiceItem()
    .setTitle('ご希望の連絡方法')
    .setChoiceValues([
      'メール',
      'オンライン打ち合わせ（Google Meet 等）',
      'どちらでも可',
    ])
    .setRequired(false);

  // --- Q7 ご検討の時期 -------------------------------------------------
  form.addMultipleChoiceItem()
    .setTitle('ご検討の時期')
    .setChoiceValues([
      'できるだけ早く',
      '1〜3か月以内',
      '半年以内',
      '未定・情報収集の段階',
    ])
    .setRequired(false);

  // --- Q8 当社を知ったきっかけ（「その他」入力欄つき）------------------
  var sourceItem = form.addMultipleChoiceItem();
  sourceItem
    .setTitle('当社を知ったきっかけ')
    .setChoiceValues([
      '検索（Google等）',
      'Facebook',
      'ご紹介',
      '以前からの取引',
    ])
    .showOtherOption(true)
    .setRequired(false);

  // --- 送信後の確認メッセージ ------------------------------------------
  form.setConfirmationMessage(
    'お問い合わせありがとうございます。\n' +
    '内容を確認のうえ、2営業日以内にご返信します。\n\n' +
    'しばらく経っても返信が届かない場合は、迷惑メールフォルダをご確認いただくか、\n' +
    NOTIFY_EMAIL + ' まで直接ご連絡ください。'
  );

  // --- 回答先スプレッドシートを作って紐づける --------------------------
  var spreadsheet = SpreadsheetApp.create(SHEET_TITLE);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  // --- 新しい回答が来たら通知メールを送る ------------------------------
  // Googleフォーム標準の通知設定は画面からしかオンにできないため、
  // 同等の通知をスクリプトの仕組み（トリガー）で用意します。
  if (NOTIFY_EMAIL) {
    removeExistingSubmitTriggers_();
    ScriptApp.newTrigger('onContactFormSubmit')
      .forForm(form)
      .onFormSubmit()
      .create();
  }

  // --- 結果を表示 -------------------------------------------------------
  var lines = [
    '',
    '========================================',
    ' フォームを作成しました',
    '========================================',
    '',
    '■ 編集用URL（フォームを直すとき）',
    form.getEditUrl(),
    '',
    '■ 回答フォームURL（★これをサイトに貼ります）',
    form.getPublishedUrl(),
    '',
    '■ 回答スプレッドシート（問い合わせが溜まります）',
    spreadsheet.getUrl(),
    '',
    NOTIFY_EMAIL
      ? '■ 通知メールの宛先： ' + NOTIFY_EMAIL
      : '■ 通知メールは設定していません',
    '',
    '次の手順：',
    '  1. 上の「回答フォームURL」をコピー',
    '  2. src/data/site.mjs の formUrl: null, を',
    "     formUrl: 'コピーしたURL', に書き換える",
    '  3. 保存すると2〜3分でサイトに反映されます',
    '',
  ];
  Logger.log(lines.join('\n'));
}


/**
 * 新しい回答が届いたときに通知メールを送る。
 * createContactForm() が自動で呼び出す設定にするので、
 * この関数を手で実行する必要はありません。
 */
function onContactFormSubmit(e) {
  if (!NOTIFY_EMAIL || !e || !e.response) return;

  var answers = e.response.getItemResponses();
  var body = ['お問い合わせが届きました。', ''];

  for (var i = 0; i < answers.length; i++) {
    var title = answers[i].getItem().getTitle();
    var value = answers[i].getResponse();
    if (Object.prototype.toString.call(value) === '[object Array]') {
      value = value.join(' / ');
    }
    body.push('【' + title + '】');
    body.push(String(value === '' ? '（未入力）' : value));
    body.push('');
  }

  body.push('----------------------------------------');
  body.push('受信日時： ' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm'));

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: '【お問い合わせ】合同会社To do サイトより',
    body: body.join('\n'),
  });
}


/**
 * 同じ通知トリガーが二重に登録されるのを防ぐ。
 */
function removeExistingSubmitTriggers_() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onContactFormSubmit') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}
