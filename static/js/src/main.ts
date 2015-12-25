import Tweet from './tweet';
import utils from './utils';
import {TweetData} from './tweet.d';

const win = window;
const doc = document;

function main() {
  win.removeEventListener('load', main, false);

  let resizeTimer = 0;
  let listEl = utils.getId('list');
  let busy = false;
  let windowSize = {
      width: win.innerWidth,
      height: win.innerHeight
    };
  let tweets: Tweet[] = [];
  let idCache: string[] = [];

  function request(callback: Function, params: string = null) {
    busy = true;
    let url = '/tweets/';
    if (params) {
      url += params;
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
    let data: TweetData[] = JSON.parse(xhr.responseText);
    if (!data.length) {
      win.removeEventListener('scroll', windowScroll);
      return;
    }
    for (let i = 0; i < data.length; i++) {
      let datum: TweetData = data[i];
      if (!!~idCache.indexOf(datum.id)) {
        continue;
      }
      idCache.push(datum.id);
      let sideEl = utils.createNode('div');
      sideEl.setAttribute('class', 'side right');
      let tweet: Tweet = new Tweet(datum, sideEl);
      let entryEl = utils.createNode('div');
      entryEl.setAttribute('class', 'entry');
      listEl.appendChild(entryEl);
      entryEl.appendChild(sideEl);
      tweets.push(tweet);
      tweet.render();
    }

    if (listEl.offsetHeight < win.innerHeight) {
      request(responseHandler, idCache[idCache.length - 1]);
    }
  }

  function windowScroll() {
    if (!busy && win.pageYOffset >= (doc.documentElement.scrollHeight - win.innerHeight) * 0.80) {
      request(responseHandler, idCache[idCache.length - 1]);
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
    resizeTimer = setTimeout(renderTweets, 500);
  }

  (function init() {
    request(responseHandler);
    win.addEventListener('scroll', windowScroll);
    win.addEventListener('resize', windowResize);
  })();
}

if (doc.readyState !== 'complete') {
  win.addEventListener('load', main, false);
} else {
  main.call(win);
}
