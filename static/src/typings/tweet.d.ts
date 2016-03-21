export type TweetUrl = {
  display_url: string;
  expanded_url: string;
  indices: number[];
  url: string;
}

export type MediaSize = {
  w: number;
  h: number;
  resize: string;
}

export type MediaSizes = {
  thumb: MediaSize;
  small: MediaSize;
  large: MediaSize;
  medium: MediaSize;
}

export type TweetMedia = {
  display_url: string;
  expanded_url: string;
  id: number;
  id_str: string;
  indices: number[];
  media_url: string;
  media_url_https: string;
  sizes: MediaSizes;
  source_status_id: number;
  source_status_id_str: string;
  source_user_id: number;
  source_user_id_str: string;
  type: string;
  url: string;
}

export type TweetHashtag = {
  text: string;
  indices: number[];
}

export type TweetSymbol = {
  text: string;
  indices: number[];
}

export type TweetEntity = {
  hashtags: TweetHashtag[];
  symbols: TweetSymbol[];
  urls: TweetUrl[];
  user_mentions: TweetMention[];
  media?: TweetMedia[];
}

export type BasicTweet = {
  id: string;
  username: string;
  url: string;
  timestamp: string;
  screen_name: string;
  text: string;
  user_image: string;
  profile_color: string;
  entities: TweetEntity;
  protected: boolean;
  shortDate?: string;
  fullDate?: string;
}

export type TweetMention = {
  id: number;
  id_str: string;
  indices: number[];
  name: string;
  screen_name: string;
}
