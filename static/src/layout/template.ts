import {Tweet} from 'data/twitter';

export interface ITemplate {
  create(data: any): string;
  get(): string;
}

export class CardTemplate implements ITemplate {

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
            <div class="user-image"
                 style="background-image: url(${data.user_image});
                        background-color: ${data.profile_color};">
            </div>
            <div class="user">
              <span class="username">
                ${data.username}
              </span>
              <span class="screen-name">
                <s>@</s>${data.screen_name}
              </span>
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
        <a class="header" href="//twitter.com/${data.screen_name}" target="_blank">
          ${user}
        </a>`;
    }

    this._template = `
      ${header}
      <div class='tweets'></div>`;

    return this._template;
  }
}

export class TweetTemplate implements ITemplate {

  private _template: string;

  get(): string {
    if (!this._template) {
      this.create();
    }
    return this._template;
  }

  create(): string {
    this._template = `
        <div class="media-container">
          <div class="media"></div>
        </div>
        <div class="text-container">
          <div class="text"></div>
        </div>`;

    return this._template;
  }
}
