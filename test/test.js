/**
 * Created by yixi on 12/9/15.
 */
var assert = require('assert');
var YPro = require('./../src/YPromise.js');

console.log(YPro);

function funcA() {
    return new YPro(function(comp,err,prog){
        var i = 0;
        function sleep(){
            i++;
            if(i>100){
                comp("fun1 done");
            }else{
                prog(i);
                setTimeout(function(){
                    sleep();
                },100);
            }
        }
        sleep();
    });
}
