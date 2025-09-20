# リアルタイムアンケートアプリ

このプロジェクトは、ユーザーがリアルタイムでアンケートの作成、投票、結果閲覧ができるフルスタックWebアプリケーションです。Next.js, Supabase, Tailwind CSS を使用して構築されています。

## 主な機能

- **ユーザー認証**: Supabase Auth を利用した、安全なサインアップおよびログイン機能。
- **アンケート管理**: 認証済みユーザーは、専用のダッシュボードで新しいアンケートを作成したり、自分が作成したアンケートの一覧を確認したりできます。
- **リアルタイム投票**: ユーザーはアンケートに投票でき、その結果は Supabase Realtime を通じてすべての閲覧者にリアルタイムで反映されます。
- **重複投票の防止**: 1ユーザーにつき1票のみ投票できるように制限されています。
- **データ可視化**: 投票結果は Recharts ライブラリを使用した棒グラフで表示されます。

## 使用技術

- **フレームワーク**: [Next.js](https://nextjs.org/) (App Router)
- **データベース & 認証**: [Supabase](https://supabase.com/)
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
- **言語**: TypeScript
- **UIコンポーネント**: グラフ表示のために [Recharts](https://recharts.org/) を使用

## ローカルでの開発環境セットアップ

お使いのPCでこのプロジェクトを動かすための手順です。

### 1. 前提条件

- [Node.js](https://nodejs.org/en) (v18 以降)
- [npm](https://www.npmjs.com/)
- [Supabase](https://supabase.com/) のアカウント

### 2. リポジトリのクローン

```bash
git clone <リポジトリのURL>
cd realtime-survey-app
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. 環境変数の設定

1.  Supabase で新規プロジェクトを作成します。
2.  `.env.example` ファイルをコピーして、`.env.local` という名前の新しいファイルを作成します。
    ```bash
    cp .env.example .env.local
    ```
3.  Supabase プロジェクトの管理画面で、**Settings > API** に移動します。
4.  **Project URL** と `anon` **public key** を見つけます。
5.  これらの値をコピーし、`.env.local` ファイルに貼り付けます。
    ```
    NEXT_PUBLIC_SUPABASE_URL="ここにあなたのSupabaseプロジェクトURLを貼り付け"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="ここにあなたのSupabase anon publicキーを貼り付け"
    ```

### 5. Supabase データベースのセットアップ

1.  Supabase プロジェクトの管理画面で、**SQL Editor** に移動します。
2.  このリポジトリにある `schema.sql` ファイルを開き、その中身をすべてコピーします。
3.  コピーしたSQLをエディタに貼り付け、**RUN** ボタンをクリックします。これにより、テーブル（`polls`, `options`, `votes`）と、行レベルセキュリティ（RLS）ポリシーが作成されます。

### 6. リアルタイム機能の有効化

1.  Supabase プロジェクトの管理画面で、**Database > Replication** に移動します。
2.  `supabase_realtime` の隣にある歯車アイコンをクリックします。
3.  `polls`, `options`, `votes` テーブルのチェックボックスをオンにして、レプリケーションを有効にします。
4.  **Save** をクリックします。

### 7. アプリケーションの実行

開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。
