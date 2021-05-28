import $ from 'jquery';
import '../css/index.css';
import '../css/test1.css';
import '../css/test2.css';
import { sub } from './tree-shaking';

// // use js, let a file to be built as a separated file
// import(/* webpackChunkName: 'test'*/'./tree-shaking')
//   .then((res) => console.log('success to load', res))
//   .catch(() => console.log('fail to load'));

console.log(sub(3, 2));

const myPromise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('500ms');
    resolve('resolve');
  }, 500);
});

myPromise.then((res) => console.log(res));

function sum(...args) {
  return args.reduce((s, a) => s + a, 0);
}

$('#btn').onclick = function () {
  // lazy loading // prefetch
  // import(/* webpackChunkName: 'test', webpackPrefetch: true*/'./test')
  //   .then((sub) => {
  //     console.log(sub(4, 5));
  //   })
};

console.log(sum(1, 2, 3, 4, 5));

// register SW -> run on server(serve -s build)
// compatibility
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log('success register SW'))
      .catch(() => console.log('fail to register SW'));
  });
}
