/***
 * a javascript Promise library .
 * @Author:Yixi
 *
 * https://github.com/Yixi/YPromise
 *
 * define a async function use promise:
 *
 *      function getContent(){
 *          return new YPromise(function(comp,err,prog){
 *              ...
 *              com(data);
 *              ...
 *              err(data);
 *              ...
 *              prog(progress);
 *
 *
 *          });
 *      }
 *
 * Use:
 *
 *      var promiseA = getContent()
 *                      .then(function(){
 *                          xxxxxx
 *
 *                          return getContent2() //need return a new Promise function;
 *                      })
 *                      .done(function(){
 *
 *                      });
 */
'use strict';

(function(){

    /**
     *
     * @constructor
     */
    var YPromise = function(worker,context){
        var z = this;
        this._thens = [];
        function _comp(){
            var args = arguments;
            var current = z._thens.shift();
            if(current){
                args = current.comp.apply(context,args);
                if(args){
                    args._thens = z._thens;
                }
            }
        }
        function _err(){
            var args = arguments;
            var current = z._thens.shift();
            if(current && current.err){
                args = current.err.apply(context,args);
                if(args){
                    args._thens = z._thens;
                }
            }
        }
        function _prog(){
            var current = z._thens[0];
            if(current && current.prog){
                current.prog.apply(context,arguments);
            }
        }

        setTimeout(function(){
            worker.call(context,_comp,_err,_prog);
        },0);

    };

    /*private help method*/
    var isArray = function(obj){
        return obj instanceof Array;
    };


    /* public method */
    YPromise.prototype.then = function(comp,err,prog){
        if(comp instanceof Function){

            this._thens.push({
                comp:comp,
                err:err,
                prog:prog
            });
        }
        return this;
    };

    YPromise.prototype.done = function(comp){
        if(comp instanceof Function){
            this._thens.push({
                comp:comp,
                err:function(error){
                    throw error;
                }
            });
        }
        return null;
    };

    YPromise.prototype.cancel = function(callback){
        this._thens.length = 0;
        if(callback instanceof Function){
            callback();
        }
    };

    YPromise.join = function(){
        var args;
        var isQueue = false;
        if(arguments.length == 1 && isArray(arguments[0])){
            args = arguments[0];
            isQueue = true;
        }else{
            args = arguments;
        }
        var len = args.length,
            counter = 0,
            results=[];
        return new YPromise(function(comp,err,prog){
            for(var i= 0;i<len;i++){
                (function(i){
                    (isQueue ? args[i]() : args[i]).then(function(){
                        if(arguments.length<=1){
                            results[i] = arguments[0];
                        }else{
                            results[i] = arguments;
                        }
                        counter++;
                        prog(counter);
                        if(counter==len){
                            comp.apply(this,results);
                        }
                    },function(){
                        var _args = Array.prototype.slice.call(arguments);
                        _args.push('error in function '+i);
                        err.apply(this,_args);
                    });
                })(i)
            }
        });
    };

    YPromise.queue = function(tasks,isOrder){
        if(!isOrder){
            return YPromise.join(tasks);
        }
        return new YPromise(function(comp,err,prog){
            var len = tasks.length,
                counter = 0,
                results = [];
            process(0);
            function process(i){
                tasks[i]().then(function(){
                    if(arguments.length<=1){
                        results[i] = arguments[0];
                    }else{
                        results[i] = arguments;
                    }
                    counter++;
                    prog(counter);
                    if(counter==len){
                        comp.apply(this,results);
                    }else{
                        process(counter);
                    }
                },function(){
                    results[i] = 'error in function ' + i;
                    counter++;
                    if(counter==len){
                        comp.apply(this,results);
                    }else{
                        process(counter);
                    }
                });
            }
        });
    };

    YPromise.any = function(){
        var args = arguments,
            len = args.length,
            doneFlag = false;
        return new YPromise(function(comp){
            for(var i=0;i<len;i++){
                args[i].then(function(){
                    if(!doneFlag){
                        doneFlag = true;
                        comp.apply(this,arguments);
                    }
                })
            }
        });
    };

    YPromise.as = function(sync){
        return new YPromise(function(comp){
            comp(sync);
        });
    };
    /**
     *
     * @param time {int}
     * @returns {YPromise}
     */
    YPromise.sleep = function(time){
        return new YPromise(function(comp){
            setTimeout(function(){
                comp();
            },parseInt(time));
        });
    };

    //window.YPro = window.YPromise = YPromise;
    module.exports = YPromise
})();
