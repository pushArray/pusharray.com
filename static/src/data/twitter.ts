import {BasicTweet, TweetEntity} from 'tweet.d';
import {Subject} from 'rxjs/Subject';
import * as color from 'utils/color';
import {get, buildUrl} from 'utils/http';

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

export class Tweets extends Subject<Tweet[]> {

  private _baseUrl = '/tweets';
  private _data: Tweet[];
  private _busy = false;

  load(count = 0, maxId = '') {
    if (!this._busy) {
      this._busy = true;
      const url = this.createUrl(count, maxId);
      get<BasicTweet[]>(url).subscribe((data: BasicTweet[]) => {
        this.next(this.processData(data));
      });
    }
  }

  protected processData(tweets: BasicTweet[]): Tweet[] {
    this._data = [];
    let i = 0;
    let l = tweets.length;
    for (; i < l; i++) {
      let d = tweets[i];
      this._data.push(new Tweet(d));
    }
    return this._data;
  }

  protected createUrl(count = 0, maxId = ''): string {
    return buildUrl(this._baseUrl, {maxId, count});
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
