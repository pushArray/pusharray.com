const nprogress = require('nprogress');

nprogress.configure({
  showSpinner: false,
  trickle: true,
  parent: '#progress'
});

let pending = 0;

export function start() {
  if (!pending || !nprogress.isStarted()) {
    nprogress.start();
  }
  pending++;
}

export function end() {
  pending = pending - 1 < 0 ? 0 : pending - 1;
  if (pending === 0) {
    nprogress.done();
  } else {
    nprogress.inc();
  }
}
