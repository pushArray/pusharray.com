import './typings/es6-promise/es6-promise.d.ts';
import {BasicTweet} from './typings/tweet';
import Tweet from './tweet/tweet';
import * as dom from './utils/dom';
import http from './utils/http';

const win = window;
const mainColumn = <HTMLElement>dom.query('.column.col-main');
const columns = dom.queryAll('.column.list');
const itemsPerRequest = columns.length * 4;
const baseUrl = '/tweets';
const idCache: string[] = [];
const tweets: Tweet[] = [];
const windowSize = {
  width: win.innerWidth,
  height: win.innerHeight
};

let resizeTimer = 0;

function loadNext() {
  let id = idCache[idCache.length - 1];
  let url = '';
  let count = itemsPerRequest.toString(10);
  if (id) {
    url = http.buildUrl(baseUrl, id, count);
  } else {
    url = http.buildUrl(baseUrl, count);
  }
  http.get(url, responseHandler);
}

function responseHandler(data: any): void {
  if (Array.isArray(data)) {
    let colCount = columns.length;
    let pending: Promise<Tweet>[] = [];
    for (let i = 0; i < data.length; i++) {
      let datum: BasicTweet = data[i];
      if (!!~idCache.indexOf(datum.id)) {
        continue;
      }
      idCache.push(datum.id);
      let entry = dom.createNode('li');
      entry.setAttribute('class', 'entry');
      let bg = dom.createNode('div');
      bg.setAttribute('class', 'background-overlay');
      entry.appendChild(bg);
      let tweet: Tweet = new Tweet(datum, entry);
      let image = tweet.getMedia();
      if (image) {
        bg.style.backgroundImage = `url(${image})`;
      }
      columns[i % colCount].appendChild(entry);
      tweets.push(tweet);
      pending.push(delayRender(tweet));
    }
    resizeAfterRender(pending);
  }
}

function resizeAfterRender(pending: Promise<Tweet>[]) {
  Promise.all(pending).then((tweet) => {
    if (mainColumn.offsetHeight < win.innerHeight) {
      loadNext();
    }
  });
}

function delayRender(tweet: Tweet): Promise<Tweet> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      tweet.render();
      resolve(tweet);
    }, 0);
  });
}

function renderTweets() {
  let ww = win.innerWidth;
  let wh = win.innerHeight;
  if (windowSize.width !== ww || windowSize.height !== wh) {
    let pending: Promise<Tweet>[] = [];
    for (let tweet of tweets) {
      pending.push(delayRender(tweet));
    }
    resizeAfterRender(pending);
  }
  windowSize.width = ww;
  windowSize.height = wh;
}

function windowResize() {
  clearInterval(resizeTimer);
  resizeTimer = setTimeout(renderTweets, 50);
}

win.addEventListener('resize', windowResize);
loadNext();
