/*
 * メール作成リンク（mailto:）を組み立てるための部品。
 * 件名にサービス名を入れておくと、届いたメールを見た時点で
 * どのページから来たご相談かが分かります。
 * 通常、このファイルを編集する必要はありません。
 */
import { site } from '../data/site.mjs';

export function mailtoHref(subject, { withTemplate = true } = {}) {
  const params = [`subject=${encodeURIComponent(`${subject}（${site.name}）`)}`];
  if (withTemplate && site.contact.mailTemplate) {
    params.push(`body=${encodeURIComponent(site.contact.mailTemplate)}`);
  }
  return `mailto:${site.contact.email}?${params.join('&')}`;
}
