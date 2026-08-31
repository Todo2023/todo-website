/*
 * 「お知らせ」と「コラム」の記事フォルダの設定。
 * src/content/news/ の中の .md ファイルが1件のお知らせになります。
 * このファイルを編集する必要は通常ありません。
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),      // お知らせのタイトル
    date: z.date(),         // 公開日（2026-08-07 の形式で書く）
    summary: z.string().optional(), // 一覧に出る短い説明（省略可）
    draft: z.boolean().optional(),  // true にすると公開されません
  }),
});

// 「コラム」の記事フォルダの設定。
// src/content/column/ の中の .md ファイルが1件のコラムになります。
// 項目は「お知らせ」と同じです。
const column = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/column' }),
  schema: z.object({
    title: z.string(),      // コラムのタイトル
    date: z.date(),         // 公開日（2026-08-07 の形式で書く）
    summary: z.string().optional(), // 一覧に出る短い説明（省略可）
    draft: z.boolean().optional(),  // true にすると公開されません
  }),
});

export const collections = { news, column };
