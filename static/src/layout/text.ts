import {Render} from './render';
import {
  TweetEntity,
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

export default class Text implements Render {

  private _linkColor: string;
  private _word: Word;

  constructor(private _text: string, private _entities: TweetEntity) {
    this._text = this._text.replace(/(\n|\r)/gm, ' ').trim();
    this.parseEntities();
    this.parseText();
  }

  private insertWord(word: Word) {
    if (!this._word) {
      this._word = word;
    } else {
      let w = this._word;
      while (w) {
        if (w.startIndex > word.startIndex) {
          w.insertBefore(word);
          if (!word.prev) {
              this._word = word;
          }
          break;
        } else if (!w.next) {
          w.insertAfter(word);
          break;
        } else {
          w = <Word>w.next;
        }
      }
    }
  }

  private parseText() {
    let text = this._text;
    let word = this._word;
    if (word) {
      let csi = 0;
      while (word) {
        if (csi < word.startIndex) {
          let ei = word.startIndex;
          let w = new TextWord(text.slice(csi, ei), csi, ei);
          word.insertBefore(w);
          if (this._word == word) {
            this._word = w;
          }
        }
        if (!word.next) {
          let si = word.endIndex;
          let ei = text.length;
          let str = text.slice(si, ei);
          if (str) {
            word.insertAfter(new TextWord(str, si, ei));
          }
          break;
        }
        csi = word.endIndex;
        word = <Word>word.next;
      }
    } else {
      this._word = new TextWord(text, 0, text.length);
    }
  }

  private parseEntities() {
    let {hashtags, urls, media, user_mentions: userMentions} = this._entities;
    if (Array.isArray(media)) {
      media.forEach((media: TweetMedia) => {
        let [start, end] = media.indices;
        let word = new MediaWord(media.display_url, media.expanded_url, start, end);
        this.insertWord(word);
      });
    }
    urls.forEach((url: TweetUrl) => {
      let str = string.extractDomain(url.expanded_url);
      let [start, end] = url.indices;
      let word = new EntityWord(str, url.expanded_url, start, end);
      this.insertWord(word);
    });
    userMentions.forEach((mention: TweetMention) => {
      let str = `@${mention.screen_name}`;
      let [start, end] = mention.indices;
      let url = `//twitter.com/${mention.screen_name}`;
      let word = new EntityWord(str, url, start, end);
      this.insertWord(word);
    });
    hashtags.forEach((hash: TweetHashtag) => {
      let str = `#${hash.text}`;
      let [start, end] = hash.indices;
      let url = `//twitter.com/search?q=%23${hash.text}&src=hash`;
      let word = new EntityWord(str, url, start, end);
      this.insertWord(word);
    });
  }

  render(container: Node): void {
    let w = this._word;
    while (w) {
      if (!(w instanceof MediaWord)) {
        container.appendChild(w.html);
      }
      w = <Word>w.next;
    }
  }

  setLinkColor(color: string) {
    this._linkColor = color;
    let w = this._word;
    while (w) {
      if (w instanceof EntityWord) {
        w.setColor(color);
      }
      w = <Word>w.next;
    }
  }
}
