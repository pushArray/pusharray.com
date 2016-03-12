import * as consts from './consts';
import {
  BasicTweet,
  TweetHashtag,
  TweetMedia,
  TweetMention,
  TweetUrl
} from '../typings/tweet';
import * as string from '../utils/string';
import {
  EntityWord,
  MediaWord,
  TextWord,
  Word,
} from './word';

export default class Text {

  private _words: Word[] = [];
  private _text: string;
  private _linkColor: string;

  constructor(private _data: BasicTweet, private _container: HTMLElement) {
    this._text = this._data.text.replace(/(\n|\r)/gm, ' ').trim();
    this.parseEntities();
    this.parseText();
  }

  get text(): string {
    return this._text;
  }

  private insertWord(word: Word, index: number = 0) {
    this._words.splice(index, 0, word);
  }

  private getWordIndex(word: Word, start: number = 0, end: number = 0): number {
    let i = start + ((end - start) * 0.5) >> 0;
    let w = this._words[i];
    if (!w) {
      return i;
    }
    let p = w.startIndex;
    let wp = word.startIndex;
    if (end - start <= 1) {
      return wp < p ? i : i + 1;
    } else if (wp < p) {
      return this.getWordIndex(word, start, i);
    } else {
      return this.getWordIndex(word, i, end);
    }
  }

  private parseText() {
    for (let i = 0; i < this._words.length; i++) {
      let w = this._words[i];
      let nw = this._words[i + 1];
      let si = w.startIndex;
      let ei = w.endIndex;
      let fi = this._words.length - 1;
      if (i == 0 && si > 0) {
        let t = this._text.slice(0, si);
        let tw = new TextWord(t, 0, si);
        this._words.splice(i, 0, tw);
      } else if (i == fi && fi > ei) {
        let t = this._text.slice(fi, ei);
        let tw = new TextWord(t, 0, si);
        this._words.splice(i, 0, tw);
      } else if (nw) {
        let nwsi = nw.startIndex;
        let t = this._text.slice(ei, nwsi);
        if (t.length) {
          let tw = new TextWord(t, ei, nwsi);
          this._words.splice(i + 1, 0, tw);
        }
      }
    }
  }

  private parseEntities() {
    let {hashtags, urls, media, user_mentions: userMentions} = this._data.entities;
    if (Array.isArray(media)) {
      media.forEach((media: TweetMedia) => {
        let [start, end] = media.indices;
        let word = new MediaWord(media.display_url, media.expanded_url, start, end);
        this.findIndexAndInsert(word);
      });
    }
    urls.forEach((url: TweetUrl) => {
      let str = string.extractDomain(url.expanded_url);
      str = string.limitString(str, consts.MAX_LINE_LENGTH);
      let [start, end] = url.indices;
      let word = new EntityWord(str, url.expanded_url, start, end);
      this.findIndexAndInsert(word);
    });
    userMentions.forEach((mention: TweetMention) => {
      let str = string.limitString('@' + mention.screen_name, consts.MAX_LINE_LENGTH);
      let [start, end] = mention.indices;
      let url = `//twitter.com/${mention.screen_name}`;
      let word = new EntityWord(str, url, start, end);
      this.findIndexAndInsert(word);
    });
    hashtags.forEach((hash: TweetHashtag) => {
      let str = string.limitString('#' + hash.text, consts.MAX_LINE_LENGTH);
      let [start, end] = hash.indices;
      let url = `//twitter.com/search?q=%23${hash.text}&src=hash`;
      let word = new EntityWord(str, url, start, end);
      this.findIndexAndInsert(word);
    });
  }

  findIndexAndInsert(word: Word) {
    let i = this.getWordIndex(word, 0, this._words.length);
    this.insertWord(word, i);
  }

  render() {
    this._words.forEach((word: Word) => {
      if (!(word instanceof MediaWord)) {
        this._container.appendChild(word.html);
      }
    });
  }

  setTextColor(color: string) {
    this._container.style.color = color;
  }

  setLinkColor(color: string) {
    this._linkColor = color;
    this._words.forEach((word: Word) => {
      if (word instanceof EntityWord) {
        word.setColor(color);
      }
    })
  }
}
