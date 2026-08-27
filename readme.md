# DevLog

> 開発者が学習内容や技術的な経験を共有し、交流できるコミュニティサービスです。

[Webサイト](https://www.seokmin.com/)

> **開発状況：開発中（2026年7月〜）**
>
> 現在も機能追加および改善を継続している個人開発プロジェクトです。

## プロジェクト概要

DevLogは、開発者が日々の学習内容や問題解決の過程を投稿として記録し、コメントや「いいね」を通じてほかの開発者と交流できるWebサービスです。

PCとモバイルの両方に対応したレスポンシブUIを設計し、フロントエンド、バックエンド、データベース、インフラまで一貫して開発しています。

## 現在実装している主な機能

- Google OAuth 2.0によるログイン
- JWTを利用した認証およびトークン更新
- 投稿の作成、編集、一覧表示
- コメントの作成および表示
- 投稿への「いいね」および取り消し
- 技術タグによる投稿の分類
- プロフィールおよび興味のある技術の管理
- PC・モバイル対応のレスポンシブUI

## 技術スタック

| 分類 | 使用技術 |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, React Router, Axios |
| Backend | Java 21, Spring Boot, Spring Security, Spring Data JPA, OAuth 2.0, JWT |
| Database | MySQL 8.x, Amazon RDS |
| Infrastructure | AWS EC2, Amazon ECR, Docker, Nginx, Vercel |
| CI | GitHub Actions, GitHub OIDC |

## システム構成

```text
Browser
   │
   ├── Frontend ── Vercel
   │
   └── REST API ── Nginx ── Spring Boot ── MySQL (Amazon RDS)
                         │
                    Docker / AWS EC2

GitHub Actions ── Docker image build ── Amazon ECR
```

- フロントエンドはVercel、バックエンドはAWS EC2に分けてデプロイ
- Nginxをリバースプロキシとして使用し、HTTPS通信およびAPIリクエストを処理
- Spring Data JPAを利用してドメインモデルおよびデータアクセス層を実装
- GitHub ActionsとAWS OIDCを利用し、長期アクセスキーを使用せずにDockerイメージをAmazon ECRへ登録
- コミットSHAと`latest`タグを併用し、デプロイするイメージのバージョンを追跡

## 担当範囲

企画、UI設計、フロントエンド、バックエンド、データベース設計、インフラ構築まで、すべて一人で担当しています。

| 項目 | 内容 |
| --- | --- |
| 開発形態 | 個人開発 |
| 担当 | フルスタック開発 |
| 開発期間 | 2026年7月〜現在 |

## ディレクトリ構成

```text
devLog/
├── front/       # React / TypeScript フロントエンド
├── backend/     # Spring Boot REST API
├── nginx/       # リバースプロキシおよびHTTPS設定
└── deploy/      # 本番環境用Docker Compose
```

## 詳細ドキュメント

- [Frontend](./front/)
- [Backend](./backend/)

フロントエンドとバックエンドの設計および実装内容は、各ディレクトリのREADMEに順次まとめる予定です。

## ローカルでの実行方法

バックエンドを実行する前に、サンプルファイルをコピーしてローカル環境変数を設定してください。フロントエンドは環境変数を設定せずに実行できます。

```bash
# MySQLを起動
docker compose up -d

# Backend
cd backend
cp .env.example .env
./gradlew bootRun

# Frontend
cd front
npm install
npm run dev
```

---

© 2026 DevLog
