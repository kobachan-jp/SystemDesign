# Museum Demo

REST / GraphQL 比較用デモシステム

---

## 概要

題材として「美術館・展覧会検索サイト」を採用し,Next.js 上で実装・利用しています.

---

## 使用技術

- Frontend: **Next.js (App Router), React, TypeScript**
- Backend: **Next.js Route Handlers (REST API), GraphQL (graphql), GraphQL Yoga**
- ORM: **Prisma**
- Database: **SQLite**

---

## 機能一覧（CRUD）

### Museum（美術館）

- 一覧取得
- 詳細取得（展覧会情報を含む）
- 新規作成
- 編集
- 削除

### Exhibition（展覧会）

- 一覧取得
- 詳細取得
- 新規追加
- 編集
- 削除

すべて **JSON形式の REST API** を通してデータをやり取りします。

---

## REST API 設計

### Museums

| Method | URL                          | 説明           |
| ------ | ---------------------------- | -------------- |
| GET    | `/api/rest/museums`          | 美術館一覧取得 |
| GET    | `/api/rest/museums/:id`      | 美術館詳細取得 |
| POST   | `/api/rest/museums/new`      | 美術館作成     |
| PUT    | `/api/rest/museums/:id/edit` | 美術館更新     |
| DELETE | `/api/rest/museums/:id`      | 美術館削除     |

### Exhibitions

| Method | URL                              | 説明       |
| ------ | -------------------------------- | ---------- |
| GET    | `/api/rest/exhibitions`          | 展覧会一覧 |
| GET    | `/api/rest/exhibitions/:id`      | 展覧会詳細 |
| POST   | `/api/rest/exhibitions/new`      | 展覧会追加 |
| PUT    | `/api/rest/exhibitions/:id/edit` | 展覧会更新 |
| DELETE | `/api/rest/exhibitions/:id`      | 展覧会削除 |

### GraphQL API

| URL            | 内容                   |
| -------------- | ---------------------- |
| `/api/graphql` | GraphQL エンドポイント |

---

## ディレクトリ構成（抜粋）

```
app/
├── api
│   ├── graphql
│   │   ├── route.ts
│   │   └── schema.ts
│   └── rest
│       ├── exhibitions
│       │   ├── [id]
│       │   │   └── route.ts
│       │   └── route.ts
│       └── museums
│           ├── [id]
│           │   └── route.ts
│           └── route.ts
├── exhibitions
│   ├── [id]
│   │   ├── edit
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── new
│   │   └── page.tsx
│   └── page.tsx
├── favicon.ico
├── globals.css
├── layout.tsx
├── lib
│   ├── prisma.ts
│   └── type.ts
├── museums
│   ├── [id]
│   │   ├── edit
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── new
│   │   └── page.tsx
│   └── page.tsx
└── page.tsx

```

---

## 環境構築手順

まずzipファイルを解凍してください.

```bash
unzip museum-demo
```

### 1. Node.js の確認

Node.js **v20以上（LTS推奨）** を使用してください.

```bash
node -v
npm -v
```

---

### 2. 依存関係のインストール

```bash
npm install
```

---

### 3. 環境変数の設定

プロジェクトルートに `.env.sample`をコピーして,`.env` を作成してください.

```bash
cp .env.sample .env
```

---

### 4. データベース初期化

データベースの初期化を行ってください.

```bash
npx prisma migrate dev
npx prisma generate
```

---

### 5. サーバー起動

```bash
npm run build
npm run start
```

以下にアクセスしてください。

```
http://localhost:3000
```

---

## 注意事項

- SQLite を使用しているため外部DBは不要です.
- RESTとGraphQLボタンで切り替えを行えます.

---
