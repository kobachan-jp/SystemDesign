# Museum Demo

REST / GraphQL 比較用デモシステム

---

## 概要

本システムは **RESTful API と GraphQL の違い（特にオーバーフェッチ／アンダーフェッチ）を理解・説明するためのデモアプリケーション**です。

題材として「美術館・展覧会検索サイト」を採用し、  
Next.js 上で REST API を実装・利用しています。

---

## 使用技術

- Frontend: **Next.js (App Router), React, TypeScript**
- Backend: **Next.js Route Handlers (REST API)**
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

| Method | URL                     | 説明           |
| ------ | ----------------------- | -------------- |
| GET    | `/api/rest/museums`     | 美術館一覧取得 |
| GET    | `/api/rest/museums/:id` | 美術館詳細取得 |
| POST   | `/api/rest/museums`     | 美術館作成     |
| PUT    | `/api/rest/museums/:id` | 美術館更新     |
| DELETE | `/api/rest/museums/:id` | 美術館削除     |

### Exhibitions

| Method | URL                         | 説明       |
| ------ | --------------------------- | ---------- |
| GET    | `/api/rest/exhibitions`     | 展覧会一覧 |
| GET    | `/api/rest/exhibitions/:id` | 展覧会詳細 |
| POST   | `/api/rest/exhibitions`     | 展覧会追加 |
| PUT    | `/api/rest/exhibitions/:id` | 展覧会更新 |
| DELETE | `/api/rest/exhibitions/:id` | 展覧会削除 |

---

## オーバーフェッチ / アンダーフェッチの例

### アンダーフェッチ（RESTの課題）

- 美術館一覧 API (`GET /museums`)
- 展覧会情報が含まれない
- 詳細表示のために **追加の API 呼び出しが必要**

➡ 必要なデータを一度で取得できない

---

### オーバーフェッチ（RESTの課題）

- 美術館詳細 API (`GET /museums/:id`)
- 住所・説明・展覧会など **すべての情報が返る**
- 一部しか使わない場合でも余分なデータを取得

➡ 不要なデータまで返ってくる

---

※ GraphQL では「必要なフィールドのみ取得」することで  
これらの問題を解消できる点を比較対象として説明できます。

---

## ディレクトリ構成（抜粋）

```
app/
├── api/
│   └── rest/
│       ├── museums/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       └── exhibitions/
│           ├── route.ts
│           └── [id]/route.ts
│
├── museums/
│   ├── page.tsx
│   └── [id]/
│       ├── page.tsx
│       └── edit/page.tsx
│
├── exhibitions/
│   └── [id]/page.tsx
│
└── lib/
    └── prisma.ts
```

---

## 環境構築手順

### 1. Node.js の確認

Node.js **v20以上（LTS推奨）** を使用してください。

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

プロジェクトルートに `.env` を作成してください。

```env
DATABASE_URL="file:./dev.db"
```

---

### 4. データベース初期化

```bash
npx prisma migrate dev
npx prisma generate
```

---

### 5. 開発サーバー起動

```bash
npm run dev
```

以下にアクセスしてください。

```
http://localhost:3000
```

---

## 注意事項

- SQLite を使用しているため外部DBは不要です
- 認証機能は実装していません（デモ用途のため）
- REST API の設計上の課題を説明する目的のシステムです

---

## 想定発表用途

- REST と GraphQL の違いの説明
- API 呼び出し回数・レスポンス量の比較
- オーバーフェッチ／アンダーフェッチの具体例提示

---

## 作者

提出用デモシステム
