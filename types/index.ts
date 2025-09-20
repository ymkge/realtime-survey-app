export type Option = {
  id: string;
  text: string;
};

// pollsテーブルの基本的な型
export type Poll = {
  id: string;
  title: string;
  created_at: string;
};

// 関連テーブル（options）を含んだ詳細なPollの型
export type PollWithWithOptions = Poll & {
  options: Option[];
};

// 投票の型
export type Vote = {
  option_id: string;
};
