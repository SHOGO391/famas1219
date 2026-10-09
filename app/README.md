This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 会議室予約アプリ：公開版のセットアップ

Node.js 24以降を使い、この `app/` ディレクトリ内で実行します。

```sh
npm ci --ignore-scripts
cp .env.example .env.local
# .env.local に自分のSupabaseプロジェクトの値を設定
npm run dev
```

`NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` を設定してください。既存プロジェクトの公開用 `NEXT_PUBLIC_SUPABASE_ANON_KEY` も利用できます。これらはビルド時にブラウザーへ公開される値です。管理用の `service_role`、`sb_secret_*`、DBパスワードは絶対に設定しないでください。元の共有プロジェクトへ自動接続するハードコードは削除しています。

Supabaseプロジェクトの所有者が `supabase-schema.sql` のテーブル・RLSポリシーを確認して適用してください。ローカルのユーザー情報は権限判定に使わず、データのアクセス制御はSupabase側のRLSで行います。公開リポジトリの修正では実DBの状態を変更・検証していません。

認証はSupabase SDKでセッションの保存・更新を管理します。旧版のセッションは初回にSDKへ移行し、古い `sb-user` の内容は信用しません。失効した旧セッションでは再ログインしてください。ログアウトは全端末の更新用セッションをサーバー側で失効させます。発行済みのアクセストークンは有効期限まで有効な場合があります。通信失敗時は失効完了と表示せず、ログイン画面で再試行を案内します。メール確認が必要な新規登録では確認完了後にログインします。

```sh
npm test
npm run lint
npm run build
npm audit --omit=dev --audit-level=low
```

テストは架空の認証サーバー応答を使い、実プロジェクトや利用者データには接続しません。`shadcn` はCSSを提供するビルド用依存としてのみ配置しています。2026-10-09時点で開発用の `braces` 系依存に未修正の深いパターンによるDoSの指摘が残ります（[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)）。本番依存の監査とは区別し、Dependabotで追跡します。外部入力のパターンをlintや生成CLIへ渡さないでください。`npm audit fix --force` が提案する古いNext.jsへの降格は行っていません。

本フォーク全体のライセンスについては [ルートの説明](../README.md) を参照してください。
