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

## 公開フォークの利用について

このリポジトリは [leosekine/famas1219](https://github.com/leosekine/famas1219) のフォークです。`app/` が会議室予約アプリです。ルートの `dev`・`start` は `app/` に処理を渡します。`build` は、ルートに残る旧雛形を一時ディレクトリで分離して検証してから、予約アプリをビルドします。ルートの `app/` と `src/app/` のルート検出の衝突を避け、元の配置は保っています。Node.js 24以降を使用してください。

ルートから使う場合は最初に `npm ci --ignore-scripts` と `npm --prefix app ci --ignore-scripts` を実行し、`app/.env.local` を設定してください。その後 `npm run dev` で起動できます。

予約アプリの起動方法・環境変数は [app/README.md](app/README.md)、脆弱性の非公開報告は [SECURITY.md](SECURITY.md) に記載しています。

フォーク元のリポジトリでライセンスを確認できていないため、このフォーク全体にMITなどの利用許諾は追加していません。公開されていることだけで商用利用や再配布が許可されるわけではありません。利用・再配布の前に原著作者の許諾を確認してください。第三者パッケージはそれぞれのライセンスに従います。
