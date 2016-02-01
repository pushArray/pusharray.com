import {BasicTweet} from './typings/tweet';
import Tweet from './tweet/tweet';
import http from './utils/http';
import * as dom from './utils/dom';

const win = window;
const doc = document;
const tweetsPerPage = 10;
const baseUrl =  '/tweets';

let listEl = dom.getId('list');
let resizeTimer = 0;
let idCache: string[] = [];
let tweets: Tweet[] = [];
let windowSize = {
  width: win.innerWidth,
  height: win.innerHeight
};

function loadMore() {
  let url = http.buildUrl(baseUrl, idCache[idCache.length - 1], tweetsPerPage.toString(10));
  http.get(url, responseHandler);
}

function responseHandler(data: any): void {
  if (!data || !data.length) {
    win.removeEventListener('scroll', windowScroll);
    return;
  }
  for (let i = 0; i < data.length; i++) {
    let datum: BasicTweet = data[i];
    if (!!~idCache.indexOf(datum.id)) {
      continue;
    }
    idCache.push(datum.id);
    let sideEl = dom.createNode('div');
    sideEl.setAttribute('class', 'side right');
    let tweet: Tweet = new Tweet(datum, sideEl);
    let entryEl = dom.createNode('div');
    entryEl.setAttribute('class', 'entry');
    listEl.appendChild(entryEl);
    entryEl.appendChild(sideEl);
    tweets.push(tweet);
    tweet.render();
  }
  if (listEl.offsetHeight < win.innerHeight) {
    loadMore();
  }
}

function windowScroll() {
  let threshold = win.pageYOffset >= (doc.documentElement.scrollHeight - win.innerHeight) * 0.80;
  if (!http.busy && threshold) {
    loadMore();
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
  http.get(baseUrl + '/10', responseHandler);
}

if (doc.readyState == 'complete') {
  loaded();
} else {
  win.addEventListener('load', loaded);
}

