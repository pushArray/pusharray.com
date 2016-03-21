import '../typings/node.d';
import {EventEmitter} from 'events';
import {BasicTweet, TweetEntity} from '../typings/tweet.d';
import * as color from '../utils/color';
import * as http from '../utils/http';
import * as string from '../utils/string';

export const EVENT_LOADED = 'loaded';

export class Tweet {

  private _hslColor: number[];
  private _id: string;

  constructor(private _data: BasicTweet) {
    let date = string.fromTwitterDateTime(_data.timestamp);
    _data.shortDate = string.getShortDate(date);
    _data.fullDate = string.getFullDate(date);
    this._id = _data.id;
  }

  get id(): string {
    return this._id;
  }

  get data(): BasicTweet {
    return this._data;
  }

  get text(): string {
    return this._data.text;
  }

  get entities(): TweetEntity {
    return this._data.entities;
  }

  getColor(): number[] {
    if (this._hslColor) {
      return this._hslColor;
    }
    let c = this._data.profile_color;
    let hex = color.fromHexString(c);
    let rgb = color.hexToRgb(hex);
    return color.rgbToHsl(rgb[0], rgb[1], rgb[2]);
  }

  getMedia(): string {
    let media = this._data.entities.media;
    if (media && media.length) {
      return media[0].media_url;
    }
    return '';
  }
}

export class Tweets extends EventEmitter {

  private _baseUrl = '/tweets';
  private _data: Tweet[];
  private _xhr: XMLHttpRequest;
  private _busy = false;

  constructor() {
    super();
    this.dataHandler = this.dataHandler.bind(this);
  }

  get data(): Tweet[] {
    return this._data;
  }

  private dataHandler(data: string) {
    this._data = [];
    let tweets: BasicTweet[] = JSON.parse(data);
    let i = 0;
    let l = tweets.length;
    for (; i < l; i++) {
      let d = tweets[i];
      this._data.push(new Tweet(d));
    }
    this._busy = false;
    this.emit(EVENT_LOADED, this._data);
  }

  cancel() {
    if (this._xhr instanceof XMLHttpRequest) {
      this._xhr.abort();
    }
  }

  load(count: number = 0, maxId: string = '') {
    if (!this._busy) {
      this._busy = true;
      let {xhr, promise} = http.get(http.buildUrl(this._baseUrl, {maxId, count}));
      this._xhr = xhr;
      promise.then(this.dataHandler);
    }
  }
}
