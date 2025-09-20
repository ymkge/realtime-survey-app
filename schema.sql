-- polls テーブルの作成
CREATE TABLE polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- options テーブルの作成
CREATE TABLE options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    text TEXT NOT NULL
);

-- votes テーブルの作成
CREATE TABLE votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID REFERENCES options(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(poll_id, user_id) -- 1ユーザー1票を強制
);

--
-- Row Level Security (RLS) の設定
--

-- polls テーブル
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to manage their own polls"
ON polls
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow all users to view polls"
ON polls
FOR SELECT
USING (true);


-- options テーブル
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all users to view options"
ON options
FOR SELECT
USING (true);

-- optionsはpollsの所有者だけが作成・変更・削除できるようにする
CREATE POLICY "Allow poll owners to manage options"
ON options
FOR ALL
USING (
  auth.uid() = (
    SELECT user_id FROM polls WHERE id = poll_id
  )
)
WITH CHECK (
  auth.uid() = (
    SELECT user_id FROM polls WHERE id = poll_id
  )
);


-- votes テーブル
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to vote"
ON votes
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow all users to view votes"
ON votes
FOR SELECT
USING (true);

-- リアルタイム更新を有効にする
-- supabase > Database > Replication > Source に移動し、
-- "Enable Realtime" をクリックして、すべてのテーブルを有効にしてください。
