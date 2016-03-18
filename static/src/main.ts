import {BasicTweet} from './typings/tweet';
import Box from './tweet/box';
import * as dom from './utils/dom';
import http from './utils/http';

const win = window;
const mainColumn = <HTMLElement>dom.query('.column.col-main');
const columns = dom.queryAll('.column.list');
const itemsPerRequest = columns.length * 6;
const baseUrl = '/tweets';
const idCache: string[] = [];

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
    for (let i = 0; i < data.length; i++) {
      let datum: BasicTweet = data[i];
      if (!datum.id || !!~idCache.indexOf(datum.id)) {
        continue;
      }
      idCache.push(datum.id);
      let box = Box.create(datum);
      columns[i % colCount].appendChild(box.element);
    }
    if (mainColumn.offsetHeight < win.innerHeight) {
      loadNext();
    }
  } else {
    win.removeEventListener('scroll', windowScroll);
  }
}

function windowScroll() {
  let scrollHeight = document.documentElement.scrollHeight;
  let threshold = win.pageYOffset >= (scrollHeight - win.innerHeight) * 0.80;
  if (!http.busy && threshold) {
    loadNext();
  }
}

win.addEventListener('scroll', windowScroll);
loadNext();
