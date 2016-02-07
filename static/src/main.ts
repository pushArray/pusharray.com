import {BasicTweet} from './typings/tweet';
import Tweet from './tweet/tweet';
import http from './utils/http';
import * as dom from './utils/dom';

const doc = document;
const win = window;
const columns = dom.queryAll('.columns .column');
const itemsPerRequest = columns.length * 2;
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
  if (id) {
    let url = http.buildUrl(baseUrl, id, itemsPerRequest.toString(10));
    http.get(url, responseHandler);
  }
}

function responseHandler(data: any): void {
  if (!data || !data.length) {
    win.removeEventListener('scroll', windowScroll);
    return;
  }
  let colCount = columns.length;
  for (let i = 0; i < data.length; i++) {
    let datum: BasicTweet = data[i];
    if (!!~idCache.indexOf(datum.id)) {
      continue;
    }
    idCache.push(datum.id);
    let entryEl = dom.createNode('div');
    entryEl.setAttribute('class', 'entry');
    let tweet: Tweet = new Tweet(datum, entryEl);
    columns[i % colCount].appendChild(entryEl);
    tweets.push(tweet);
    delayRender(tweet);
  }

  let col1 = <HTMLElement>columns[0];
  if (col1.offsetHeight < win.innerHeight) {
    loadNext();
  }
}

function delayRender(tweet: Tweet) {
  setTimeout(() => tweet.render(), 0);
}

function windowScroll() {
  let threshold = win.pageYOffset >= (doc.documentElement.scrollHeight - win.innerHeight) * 0.80;
  if (!http.busy && threshold) {
    loadNext();
  }
}

function renderTweets() {
  let ww = win.innerWidth;
  let wh = win.innerHeight;
  if (windowSize.width !== ww || windowSize.height !== wh) {
    for (let tweet of tweets) {
      tweet.render();
    }
  }
  windowSize.width = ww;
  windowSize.height = wh;
}

function windowResize() {
  clearInterval(resizeTimer);
  resizeTimer = setTimeout(renderTweets, 50);
}

function loaded() {
  win.removeEventListener('load', loaded);
  win.addEventListener('scroll', windowScroll);
  win.addEventListener('resize', windowResize);
  http.get(`${baseUrl}/${itemsPerRequest * 2 + itemsPerRequest * 0.5}`, responseHandler);
}

if (doc.readyState == 'complete') {
  loaded();
} else {
  win.addEventListener('load', loaded);
}
