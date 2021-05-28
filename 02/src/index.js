 /*
    cmd:
        dev: webpack ./src/index.js -o ./build --mode=development
        prod: webpack ./src/index.js -o ./build --mode=production
 */

import data from './shared/data.json';
import './style/index.css';
import './style/index.less';
import './style/iconfont.css';

console.log(data);

const add = (x, y) => {
    return x + y
}

console.log(add(1,2));