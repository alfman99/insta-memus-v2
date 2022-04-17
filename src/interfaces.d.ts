export interface UserTag {
  user_id: number;
  position: number[2];
}

export interface RedditPost {
  id: string;
  author: string;
  title: string;
  imgUrl: string;
}

export interface PostDbRow {
  id: string;
  account_id: string;
}