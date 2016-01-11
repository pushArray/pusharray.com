import {
  BasicTweet,
  TweetMedia,
  TweetUrl,
  TweetMention,
  TweetHashtag
} from '../typings/tweet';
import * as consts from './consts';
import * as string from '../utils/string';
import {
  Word,
  EntityWord,
  NormalWord,
  Entity
} from './word';

export default class Text {

  private _words: Word[];
  private _text: string;
  private _indices: number[];

  constructor(private _data: BasicTweet) {
    this.parseText();
    this.parseLinks();
    this.removeEmptyWords();
  }

  get words(): Word[] {
    return this._words;
  }

  get text(): string {
    return this._text;
  }

  private parseText() {
    let text = this._data.text.replace(/(\n|\r)/gm, ' ').trim();
    this._text = text;
    this._words = [];
    this._indices = [];
    let words = text.split(' ');
    let startIndex = 0;
    let endIndex = 0;
    for (let i = 0, l = words.length; i < l; i++) {
      let w: string = words[i];
      endIndex = startIndex + w.length;
      this._indices.push(startIndex, endIndex);
      let word = new NormalWord(w, startIndex, endIndex);
      startIndex = endIndex + 1;
      this._words.push(word);
    }
  }

  private parseLinks() {
    let {
        hashtags,
        urls,
        media,
        user_mentions: userMentions
      } = this._data.entities;
    if (Array.isArray(media)) {
      media.forEach((media: TweetMedia) => {
        let [start, end] = media.indices;
        let word = new EntityWord(media.display_url, media.expanded_url, start, end, Entity.Media);
        this.replaceWordIfOverlap(word, start, end);
      });
    }
    urls.forEach((url: TweetUrl) => {
      let str = string.limitString(url.display_url, consts.MAX_LINE_LENGTH);
      let [start, end] = url.indices;
      let word = new EntityWord(str, url.expanded_url, start, end, Entity.Url);
      this.replaceWordIfOverlap(word, start, end);
    });
    userMentions.forEach((mention: TweetMention) => {
      let str = string.limitString('@' + mention.screen_name, consts.MAX_LINE_LENGTH);
      let [start, end] = mention.indices;
      let url = `//twitter.com/${mention.screen_name}`;
      let word = new EntityWord(str, url, start, end, Entity.UserMention);
      this.replaceWordIfOverlap(word, start, end);
    });
    hashtags.forEach((hash: TweetHashtag) => {
      let str = string.limitString('#' + hash.text, consts.MAX_LINE_LENGTH);
      let [start, end] = hash.indices;
      let url = `//twitter.com/search?q=%23${hash.text}&src=hash`;
      let word = new EntityWord(str, url, start, end, Entity.Hashtag);
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
    for (let i = 0, l = this._words.length; i < l; i++) {
      let word = this._words[i];
      if (word.text.length === 0) {
        this._words.splice(i, 1);
        i--;
        l--;
      }
    }
  }

  replaceWord(word: Word, startIndex: number, endIndex: number) {
    let i = this.containsWordAtIndex(startIndex, endIndex);
    if (i > -1) {
      this._words.splice(i, 1, word);
    }
  }

  hasWordOverlap(startIndex: number, endIndex: number): number[] {
    for (let i = 0, l = this._indices.length; i < l; i += 2) {
      let s = this._indices[i];
      let e = this._indices[i + 1];
      if (s <= endIndex && startIndex <= e) {
        return [s, e];
      }
    }
    return [];
  }

  containsWordAtIndex(startIndex: number, endIndex: number): number {
    let i = this._indices.indexOf(startIndex);
    if (i > -1 && endIndex == this._indices[i + 1]) {
      return (i * 0.5) >> 0;
    }
    return -1;
  }
}
