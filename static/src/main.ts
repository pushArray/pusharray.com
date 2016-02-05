import {BasicTweet} from './typings/tweet';
import Tweet from './tweet/tweet';
import http from './utils/http';
import * as dom from './utils/dom';

const win = window;
const doc = document;
const itemsPerRequest = 8;
const baseUrl =  '/tweets';

let columns = dom.queryAll('.columns .column');
let resizeTimer = 0;
let idCache: string[] = [];
let tweets: Tweet[] = [];
let windowSize = {
  width: win.innerWidth,
  height: win.innerHeight
};

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
    tweet.render();
  }

  // TODO(@logashoff): Based on column container.
  //if (listEl.offsetHeight < win.innerHeight) {
  //  loadNext();
  //}
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
  http.get(`${baseUrl}/${itemsPerRequest}`, responseHandler);
}

if (doc.readyState == 'complete') {
  loaded();
} else {
  win.addEventListener('load', loaded);
}
