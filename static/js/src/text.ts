import {
  TweetData,
  TweetMedia,
  TweetUrl,
  TwitterUser,
  TweetMention,
  TweetHashtag
} from './tweet.d';
import * as consts from './consts';
import utils from './utils';
import {
  Word,
  MediaWord,
  HashtagWord,
  MentionWord,
  UrlWord,
  NormalWord
} from './word';

export default class Text {

  private words_: Word[];
  private text_: string;
  private indices_: number[];

  constructor(private data: TweetData) {
    let text = utils.replaceHtmlEntities(data.text);
    text = text.replace(/(\n|\r)/gm, ' ');
    text = text.trim();
    this.text_ = text;
    this.words_ = [];
    this.indices_ = [];
    let words = text.split(' ');
    let startIndex = 0;
    let endIndex = 0;
    for (let i = 0, l = words.length; i < l; i++) {
      let w: string = words[i];
      endIndex = startIndex + w.length;
      this.indices_.push(startIndex, endIndex);
      let word = new NormalWord(w, startIndex, endIndex);
      startIndex = endIndex + 1;
      this.words_.push(word);
    }

    let {hashtags, urls, user_mentions: userMentions, media} = this.data.entities;
    if (Array.isArray(media)) {
      media.forEach((media: TweetMedia) => {
        let indices = media.indices;
        let [start, end] = indices;
        let word = new MediaWord(media.display_url, media.expanded_url, start, end);
        let i = this.containsWordAtIndex(start, end);
        if (i > -1) {
          this.words_.splice(i, 1, word);
        }
      });
    }
    urls.forEach((url: TweetUrl) => {
      let str = utils.limitString(url.display_url, consts.MAX_LINE_LENGTH);
      let indices = url.indices;
      let [start, end] = indices;
      let word = new UrlWord(str, url.expanded_url, start, end);
      var i = this.containsWordAtIndex(start, end);
      if (i > -1) {
        this.words_.splice(i, 1, word);
      }
    });
    userMentions.forEach((mention: TweetMention) => {
      let str = utils.limitString('@' + mention.screen_name, consts.MAX_LINE_LENGTH);
      let indices = mention.indices;
      let [start, end] = indices;
      let word = new MentionWord(str, '//twitter.com/${mention.screen_name}', start, end);
      var i = this.containsWordAtIndex(start, end);
      if (i > -1) {
        this.words_.splice(i, 1, word);
      }
    });
    hashtags.forEach((hash: TweetHashtag) => {
      let str = utils.limitString('#' + hash.text, consts.MAX_LINE_LENGTH);
      let indices = hash.indices;
      let [start, end] = indices;
      let word = new HashtagWord(str, '//twitter.com/search?q=%23${hash.text}&src=hash', start, end);
      var i = this.containsWordAtIndex(start, end);
      if (i > -1) {
        this.words_.splice(i, 1, word);
      }
    });
  }

  get words(): Word[] {
    return this.words_;
  }

  get text(): string {
    return this.text_;
  }

  containsWordAtIndex(startIndex: number, endIndex: number): number {
    let i = this.indices_.indexOf(startIndex);
    if (i > -1 && endIndex == this.indices_[i + 1]) {
      return (i * 0.5) >> 0;
    }
    return -1;
  }
}
