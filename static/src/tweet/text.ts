import {
  TweetData,
  TweetMedia,
  TweetUrl,
  TweetMention,
  TweetHashtag
} from './tweet.d';
import * as consts from './consts';
import * as string from '../utils/string';
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

  constructor(private data_: TweetData) {
    this.parseText();
    this.parseLinks();
    this.removeEmptyWords();
  }

  get words(): Word[] {
    return this.words_;
  }

  get text(): string {
    return this.text_;
  }

  private parseText() {
    let text = this.data_.text.replace(/(\n|\r)/gm, ' ').trim();
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
  }

  private parseLinks() {
    let {hashtags, urls, user_mentions: userMentions, media} = this.data_.entities;
    if (Array.isArray(media)) {
      media.forEach((media: TweetMedia) => {
        let [start, end] = media.indices;
        let word = new MediaWord(media.display_url, media.expanded_url, start, end);
        // TODO(logashoff): If words don't overlap insert new word at closest index.
        this.replaceWordIfOverlap(word, start, end);
      });
    }
    urls.forEach((url: TweetUrl) => {
      let str = string.limitString(url.display_url, consts.MAX_LINE_LENGTH);
      let [start, end] = url.indices;
      let word = new UrlWord(str, url.expanded_url, start, end);
      this.replaceWordIfOverlap(word, start, end);
    });
    userMentions.forEach((mention: TweetMention) => {
      let str = string.limitString('@' + mention.screen_name, consts.MAX_LINE_LENGTH);
      let [start, end] = mention.indices;
      let url = `//twitter.com/${mention.screen_name}`;
      let word = new MentionWord(str, url, start, end);
      this.replaceWordIfOverlap(word, start, end);
    });
    hashtags.forEach((hash: TweetHashtag) => {
      let str = string.limitString('#' + hash.text, consts.MAX_LINE_LENGTH);
      let [start, end] = hash.indices;
      let url = `//twitter.com/search?q=%23${hash.text}&src=hash`;
      let word = new HashtagWord(str, url, start, end);
      this.replaceWordIfOverlap(word, start, end);
    });
  }

  private replaceWordIfOverlap(word: Word, startIndex: number, endIndex: number): boolean {
    let overlap = this.hasWordOverlap(startIndex, endIndex);
    if (overlap.length) {
      // TODO(logashoff): Merge new word with existing word.
      this.replaceWord(word, overlap[0], overlap[1]);
      return true;
    }
    return false;
  }

  private removeEmptyWords() {
    for (let i = 0, l = this.words_.length; i < l; i++) {
      let word = this.words_[i];
      if (word.text.length === 0) {
        this.words_.splice(i, 1);
        i--;
        l--;
      }
    }
  }

  replaceWord(word: Word, startIndex: number, endIndex: number) {
    let i = this.containsWordAtIndex(startIndex, endIndex);
    if (i > -1) {
      this.words_.splice(i, 1, word);
    }
  }

  hasWordOverlap(startIndex: number, endIndex: number): number[] {
    for (let i = 0, l = this.indices_.length; i < l; i += 2) {
      let s = this.indices_[i];
      let e = this.indices_[i + 1];
      if (s <= endIndex && startIndex <= e) {
        return [s, e];
      }
    }
    return [];
  }

  containsWordAtIndex(startIndex: number, endIndex: number): number {
    let i = this.indices_.indexOf(startIndex);
    if (i > -1 && endIndex == this.indices_[i + 1]) {
      return (i * 0.5) >> 0;
    }
    return -1;
  }
}
