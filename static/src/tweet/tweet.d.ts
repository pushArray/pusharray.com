export interface TweetUrl {
  display_url: string;
  expanded_url: string;
  indices: number[];
  url: string;
}

export interface TweetMedia {
  display_url: string;
  expanded_url: string;
  id: number;
  id_str: string;
  indices: number[];
  media_url: string;
  media_url_https: string;
  sizes: any;
  source_status_id: number;
  source_status_id_str: string;
  source_user_id: number;
  source_user_id_str: string;
  type: string;
  url: string;
}

export interface TweetHashtag {
  text: string;
  indices: number[];
}

export interface TweetEntity {
  hashtags: TweetHashtag[];
  symbols: string[];
  urls: TweetUrl[];
  user_mentions: TweetMention[];
  media?: TweetMedia[];
}

export interface TweetData {
  id: string;
  username: string;
  url: string;
  timestamp: string;
  screenName: string;
  text: string;
  userImage: string;
  profileColor: string;
  entities: TweetEntity;
}

export interface TweetMention {
  id: number;
  id_str: string;
  indices: number[];
  name: string;
  screen_name: string;
}
