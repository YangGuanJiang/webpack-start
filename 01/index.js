import $ from "jquery";
import './index.less';

$('#title').click(() => {
    $('body').css('backgroundColor', 'yellow');
})
console.log($)