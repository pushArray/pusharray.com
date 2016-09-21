import {query} from 'utils/dom';

const nprogress = require('nprogress');

const container = query('#progress');

if (container) {
  nprogress.configure({
    showSpinner: false,
    trickle: true,
    parent: '#progress'
  });
}

let pending = 0;

export function start() {
  if (container &&  (!pending || !nprogress.isStarted())) {
    nprogress.start();
  }
  pending++;
}

export function end() {
  pending = pending - 1 < 0 ? 0 : pending - 1;

  if (container) {
    if (pending === 0) {
      nprogress.done();
    } else {
      nprogress.inc();
    }
  }
}
