import {Tweet} from "../data/twitter";

export interface Template {
  create(data: any): string;
  get(): string;
}

export class CardTemplate implements Template {

  private _template: string;

  constructor(tweet: Tweet) {
    this._template = this.create(tweet);
  }

  get(): string {
    return this._template;
  }

  create(tweet: Tweet): string {
    let data = tweet.data;
    let user = `
         <div class="user-container">
            <div class="user-image" style="background-image: url(${data.user_image}); background-color: ${data.profile_color};"></div>
            <div class="user">
              <span class="username">${data.username}</span>
              <span class="screen-name">@${data.screen_name}</span>
            </div>
         </div>`;
    let header = '';
    if (data.protected) {
      header = `
        <div class="header">
          ${user}
        </div>`;
    } else {
      header = `
        <a class="header" href="${data.url}" target="_blank">
          ${user}
        </a>`;
    }

    let tweetBody = `
      ${header}
      <div class="latest-tweet tweet">
        <span class="timestamp" title="${data.fullDate}">${data.shortDate}</span>
        <div class="text"></div>
      </div>
      <div class="tweets-cluster tweet"></div>
      <div class="cluster-button"></div>`;

    return `
      <div class="media" style="background-image: url(${tweet.getMedia()})"></div>
      <div class="tweet-container">
        ${tweetBody}
      </div>`;
  }
}

export class LayoutTemplate implements Template {

  private _template: string = '';

  constructor() {
    this._template = this.create();
  }

  get(): string {
    return this._template;
  }

  create(): string {
    return `
      <div class="column col-group">
        <ul class="column list col-1"></ul>
        <ul class="column list col-2"></ul>
      </div>
      <div class="column col-group">
        <ul class="column list col-3"></ul>
        <ul class="column list col-4"></ul>
      </div>`;
  }
}
