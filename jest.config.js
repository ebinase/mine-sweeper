// ref https://nextjs-ja-translation-docs.vercel.app/docs/testing#jest-%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B-rust-%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%A9%E3%82%92%E5%88%A9%E7%94%A8
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // テスト環境の next.config.js と .env ファイルを読み込むために、Next.js アプリケーションへのパスを記載する
  dir: './',
});

// Jest に渡すカスタム設定を追加する
const customJestConfig = {};

// createJestConfig は、非同期で next/jest が Next.js の設定を読み込めるようにするため、下記のようにエクスポートします
module.exports = createJestConfig(customJestConfig);
