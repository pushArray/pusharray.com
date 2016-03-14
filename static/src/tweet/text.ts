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

  private insertWord(word: Word, index = 0) {
    this._words.splice(index, 0, word);
  }

  private getWordIndex(word: Word, start = 0, end = 0): number {
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
    let words = this._words;
    let text = this._text;
    if (words.length) {
      let newText: Word[] = [];
      let k = 0;
      let wl = words.length;
      let l = wl * 2  + 1;
      let csi = 0;
      for (let i = 0; i < l; i++) {
        let word = words[k++];
        if (!word) {
          let ei = text.length;
          newText.push(new TextWord(text.slice(csi, ei), csi, ei));
          break;
        } else if (csi !== word.startIndex) {
          let ei = word.startIndex;
          newText.push(new TextWord(text.slice(csi, ei), csi, ei), word);
          i++;
        } else if (csi == word.startIndex) {
          newText.push(word);
        }
        csi = word.endIndex;
      }
      this._words = newText;
    } else {
      words.push(new TextWord(text, 0, text.length));
    }
  }

  private parseEntities() {
    let {hashtags, urls, media, user_mentions: userMentions} = this._data.entities;
    if (Array.isArray(media)) {
      media.forEach((media: TweetMedia) => {
        let [start, end] = media.indices;
        let word = new MediaWord(media.display_url, media.expanded_url, start, end);
        this.addWord(word);
        if (this._linkColor) {
          word.setColor(this._linkColor);
        }
      });
    }
    urls.forEach((url: TweetUrl) => {
      let str = string.extractDomain(url.expanded_url);
      let [start, end] = url.indices;
      let word = new EntityWord(str, url.expanded_url, start, end);
      this.addWord(word);
      if (this._linkColor) {
        word.setColor(this._linkColor);
      }
    });
    userMentions.forEach((mention: TweetMention) => {
      let str = `@${mention.screen_name}`;
      let [start, end] = mention.indices;
      let url = `//twitter.com/${mention.screen_name}`;
      let word = new EntityWord(str, url, start, end);
      this.addWord(word);
      if (this._linkColor) {
        word.setColor(this._linkColor);
      }
    });
    hashtags.forEach((hash: TweetHashtag) => {
      let str = `#${hash.text}`;
      let [start, end] = hash.indices;
      let url = `//twitter.com/search?q=%23${hash.text}&src=hash`;
      let word = new EntityWord(str, url, start, end);
      this.addWord(word);
      if (this._linkColor) {
        word.setColor(this._linkColor);
      }
    });
  }

  addWord(word: Word) {
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
    });
  }
}
