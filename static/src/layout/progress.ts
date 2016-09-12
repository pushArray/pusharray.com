const nprogress = require('nprogress');

nprogress.configure({
  showSpinner: false,
  trickle: true,
  parent: '#progress'
});

export default nprogress;
