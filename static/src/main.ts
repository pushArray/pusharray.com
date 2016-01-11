import {BasicTweet} from './typings/tweet';
import Tweet from './tweet/tweet';
import * as dom from './utils/dom';

const win = window;
const doc = document;
const tweetsPerPage = 10;

let listEl = dom.getId('list');
let resizeTimer = 0;
let busy = false;
let tweets: Tweet[] = [];
let idCache: string[] = [];
let windowSize = {
  width: win.innerWidth,
  height: win.innerHeight
};

function request(callback: Function, ...params: string[]) {
  busy = true;
  let url = '/tweets/';
  if (Array.isArray(params)) {
    url += params.join('/');
  }
  let xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.status === 200 && xhr.readyState === 4) {
      busy = false;
      callback.call(xhr, xhr);
      doc.body.classList.remove('busy');
    }
  };
  doc.body.classList.add('busy');
  xhr.send();
}

function responseHandler(xhr: XMLHttpRequest): void {
  let data: BasicTweet[] = JSON.parse(xhr.responseText);
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
    request(responseHandler, idCache[idCache.length - 1], tweetsPerPage.toString(10));
  }
}

function windowScroll() {
  if (!busy && win.pageYOffset >= (doc.documentElement.scrollHeight - win.innerHeight) * 0.80) {
    request(responseHandler, idCache[idCache.length - 1], tweetsPerPage.toString(10));
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

window.onload = function() {
  win.addEventListener('scroll', windowScroll);
  win.addEventListener('resize', windowResize);
  request(responseHandler, tweetsPerPage.toString(10));
};
