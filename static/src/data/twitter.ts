import {EventEmitter} from 'events';
import {BasicTweet, TweetEntity} from 'tweet.d';
import * as color from 'utils/color';
import {Http, buildUrl} from 'utils/http';

export const DATA_LOADED = 'dataLoaded';
export const DATA_NEXT = 'dataNext';

export class Tweet {

  private _hslColor: number[];
  private _id: string;

  constructor(private _data: BasicTweet) {
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
  private _http = new Http();
  private _busy = false;
  private _lastId = '';

  constructor() {
    super();
    this.processData = this.processData.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }

  next(listener: (data: any) => void) {
    if (!this._busy) {
      this._busy = true;
      this._http.complete(this.onNext).send(this.createUrl());
      this.once(DATA_NEXT, listener);
    }
  }

  cancel() {
    this._busy = false;
    if (this._http instanceof Http) {
      this._http.cancel();
    }
  }

  load(count = 0, maxId = '') {
    if (!this._busy) {
      this._busy = true;
      this._http.complete(this.onLoad).send(this.createUrl(count, maxId));
    }
  }

  protected processData(data: any) {
    this._data = [];
    let tweets = <BasicTweet[]>data;
    let i = 0;
    let l = tweets.length;
    for (; i < l; i++) {
      let d = tweets[i];
      this._data.push(new Tweet(d));
    }
    this._lastId = tweets[l - 1].id;
    return this._data;
  }

  protected createUrl(count = 0, maxId = this._lastId) {
    return buildUrl(this._baseUrl, {maxId, count});
  }

  private onLoad(data: any) {
    this._busy = false;
    this.emit(DATA_LOADED, this.processData(data));
  }

  private onNext(data: any) {
    this._busy = false;
    this.emit(DATA_NEXT, this.processData(data));
  }
}

export class Group {
  private _data: Tweet[];

  constructor() {
    this._data = [];
  }

  get data(): Tweet[] {
    return this._data;
  }

  get(index: number): Tweet {
    return this._data[index];
  }

  add(tweet: Tweet) {
    this._data.push(tweet);
  }
}

export class Groups {

  private _data: Group[];

  constructor(private _tweets: Tweet[]) {
    this._data = [];
    this.create(this._tweets);
  }

  get data(): Group[] {
    return this._data;
  }

  private create(tweets: Tweet[]) {
    let users = {};
    tweets.forEach((tweet: Tweet) => {
      let user = tweet.data.screen_name;
      let cluster = users[user] || new Group();
      cluster.add(tweet);
      if (!users[user]) {
        this._data.push(cluster);
        users[user] = cluster;
      }
    });
  }
}
