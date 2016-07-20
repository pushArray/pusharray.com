import {EventEmitter} from 'events';
import {BasicTweet, TweetEntity} from 'tweet.d';
import * as color from 'utils/color';
import * as http from 'utils/http';

export const EVENT_LOADED = 'loaded';

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
  private _xhr: XMLHttpRequest;
  private _busy = false;

  constructor() {
    super();
    this.dataHandler = this.dataHandler.bind(this);
  }

  get data(): Tweet[] {
    return this._data;
  }

  protected dataHandler(data: string) {
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
    this._busy = false;
    if (this._xhr instanceof XMLHttpRequest) {
      this._xhr.abort();
    }
  }

  load(count = 0, maxId = '') {
    if (!this._busy) {
      this._busy = true;
      let {xhr, promise} = http.get(http.buildUrl(this._baseUrl, {maxId, count}));
      this._xhr = xhr;
      promise.then(this.dataHandler);
    }
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

  constructor(private _tweets: Tweets) {
    this._data = [];
    this.create(this._tweets);
  }

  get data(): Group[] {
    return this._data;
  }

  private create(tweets: Tweets) {
    let users = {};
    tweets.data.forEach((tweet: Tweet) => {
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
