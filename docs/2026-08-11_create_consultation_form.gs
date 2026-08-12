/**
 * 合同会社To do 無料相談お申し込みフォーム 自動生成スクリプト
 * =====================================================================
 *
 * このスクリプトを1回実行するだけで、
 *   ・無料相談お申し込みフォーム（全9問）
 *   ・回答が溜まるスプレッドシート
 *   ・新しい申し込みが来たときの通知メール
 * がまとめて作られます。手で1問ずつ入力する必要はありません。
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
 * 4. 画面上部の関数選択で「createConsultationForm」を選び、「実行」を押す
 *
 * 5. 初回のみ権限の確認が出ます
 *    「権限を確認」→ アカウントを選択 →
 *    「このアプリは確認されていません」と出たら
 *    「詳細」→「(安全ではないページ)に移動」→「許可」
 *    ※自分で用意したスクリプトなので、この警告は正常です。
 *      許可するのはフォーム作成・スプレッドシート作成・メール送信のみです。
 *
 * 6. 下部の「実行ログ」に3つのURLが出ます。
 *    ・編集用URL          … フォームを直すとき
 *    ・回答フォームURL     … これをサイトに貼ります
 *    ・回答スプレッドシート … 申し込み内容が溜まります
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

/** 申し込み通知の宛先。空にすると通知メールは送りません。 */
var NOTIFY_EMAIL = 'todo.inc.2023.10.13@gmail.com';

/** フォームのタイトル */
var FORM_TITLE = '無料相談お申し込み｜合同会社To do';

/** 回答スプレッドシートの名前 */
var SHEET_TITLE = '無料相談お申し込み｜合同会社To do';

// =====================================================================


/**
 * メインの処理。この関数を実行してください。
 */
function createConsultationForm() {
  var form = FormApp.create(FORM_TITLE);

  form.setDescription(
    '30分の無料相談を受け付けています。\n' +
    'オンライン（Google Meet）で実施し、費用はかかりません。\n\n' +
    '「何が問題なのか、まだ言葉になっていない」という段階で構いません。\n' +
    'お話をうかがい、論点を整理したうえで、お手伝いできることをお伝えします。\n\n' +
    '2営業日以内にご返信します。\n' +
    'ご相談のみで終了しても構いません。その場でご契約を迫ることはありません。\n\n' +
    'いただいた内容は、ご連絡およびご提案の目的にのみ使用します。'
  );

  // 回答者にGoogleログインを強制しない（メールは質問として聞く）
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(false);
  form.setAllowResponseEdits(false);

  // --- Q1 ご希望の内容 -------------------------------------------------
  form.addMultipleChoiceItem()
    .setTitle('ご希望の内容')
    .setChoiceValues([
      '30分の無料相談を希望する',
      '業務提携・協業のご相談',
      'その他の問い合わせ（見積り・依頼など）',
    ])
    .setRequired(true);

  // --- Q2 会社名・団体名 -----------------------------------------------
  form.addTextItem()
    .setTitle('会社名・団体名')
    .setHelpText('個人の方は空欄で構いません。')
    .setRequired(false);

  // --- Q3 お名前 -------------------------------------------------------
  form.addTextItem()
    .setTitle('お名前')
    .setRequired(true);

  // --- Q4 メールアドレス -----------------------------------------------
  var emailValidation = FormApp.createTextValidation()
    .setHelpText('メールアドレスの形式でご入力ください。')
    .requireTextIsEmail()
    .build();

  form.addTextItem()
    .setTitle('メールアドレス')
    .setRequired(true)
    .setValidation(emailValidation);

  // --- Q5 ご相談の種類（複数選択）--------------------------------------
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

  // --- Q6 ご相談の概要 -------------------------------------------------
  form.addParagraphTextItem()
    .setTitle('ご相談の概要')
    .setHelpText(
      '一言で構いません。現在おかれている状況や、お困りごとをお書きください。\n' +
      '業務提携のご相談の場合は、御社の事業内容と、想定される協業の形をお書きください。'
    )
    .setRequired(true);

  // --- Q7 ご希望の日時 -------------------------------------------------
  form.addParagraphTextItem()
    .setTitle('ご希望の日時')
    .setHelpText(
      '無料相談をご希望の方はご記入ください。第3希望までいただけると調整がスムーズです。\n' +
      '例）8/20（水）14:00〜／8/21（木）終日／8/22（金）午前'
    )
    .setRequired(false);

  // --- Q8 ご検討の時期 -------------------------------------------------
  form.addMultipleChoiceItem()
    .setTitle('ご検討の時期')
    .setChoiceValues([
      'できるだけ早く',
      '1〜3か月以内',
      '半年以内',
      '未定・情報収集の段階',
    ])
    .setRequired(false);

  // --- Q9 当社を知ったきっかけ（「その他」入力欄つき）------------------
  form.addMultipleChoiceItem()
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
    'お申し込みありがとうございます。\n' +
    '内容を確認のうえ、2営業日以内にご返信します。\n' +
    '日時のご希望をいただいた方には、あわせて調整のご連絡をいたします。\n\n' +
    'しばらく経っても返信が届かない場合は、迷惑メールフォルダをご確認いただくか、\n' +
    NOTIFY_EMAIL + ' まで直接ご連絡ください。'
  );

  // --- 回答先スプレッドシートを作って紐づける --------------------------
  var spreadsheet = SpreadsheetApp.create(SHEET_TITLE);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  // --- 新しい申し込みが来たら通知メールを送る --------------------------
  // Googleフォーム標準の通知設定は画面からしかオンにできないため、
  // 同等の通知をスクリプトの仕組み（トリガー）で用意します。
  if (NOTIFY_EMAIL) {
    removeExistingSubmitTriggers_();
    ScriptApp.newTrigger('onConsultationFormSubmit')
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
    '■ 回答スプレッドシート（申し込みが溜まります）',
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
 * 新しい申し込みが届いたときに通知メールを送る。
 * createConsultationForm() が自動で設定するので、
 * この関数を手で実行する必要はありません。
 */
function onConsultationFormSubmit(e) {
  if (!NOTIFY_EMAIL || !e || !e.response) return;

  var answers = e.response.getItemResponses();
  var body = ['無料相談・お問い合わせのお申し込みが届きました。', ''];
  var subjectSuffix = '';

  for (var i = 0; i < answers.length; i++) {
    var title = answers[i].getItem().getTitle();
    var value = answers[i].getResponse();
    if (Object.prototype.toString.call(value) === '[object Array]') {
      value = value.join(' / ');
    }
    if (title === 'ご希望の内容') {
      var v = String(value);
      if (v.indexOf('無料相談') === 0) subjectSuffix = '【無料相談】';
      else if (v.indexOf('業務提携') === 0) subjectSuffix = '【業務提携】';
    }
    body.push('【' + title + '】');
    body.push(String(value === '' ? '（未入力）' : value));
    body.push('');
  }

  body.push('----------------------------------------');
  body.push('受信日時： ' + Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm'));

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: subjectSuffix + 'お申し込みが届きました｜合同会社To do サイト',
    body: body.join('\n'),
  });
}


/**
 * 同じ通知トリガーが二重に登録されるのを防ぐ。
 */
function removeExistingSubmitTriggers_() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onConsultationFormSubmit') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}
