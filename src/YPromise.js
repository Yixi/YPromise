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
     * YPromise constructor
     * @param {Function} worker - The executor function
     * @param {Object} context - The execution context
     * @constructor
     */
    var YPromise = function(worker, context){
        var self = this;
        this._thens = [];
        
        function _comp(){
            var current = self._thens.shift();
            if(current){
                var result = current.comp.apply(context, arguments);
                if(result){
                    result._thens = self._thens;
                }
            }
        }
        
        function _err(){
            var current = self._thens.shift();
            if(current && current.err){
                var result = current.err.apply(context, arguments);
                if(result){
                    result._thens = self._thens;
                }
            }
        }
        
        function _prog(){
            var current = self._thens[0];
            if(current && current.prog){
                current.prog.apply(context, arguments);
            }
        }

        // Execute worker asynchronously but directly via setTimeout
        setTimeout(function(){
            worker.call(context, _comp, _err, _prog);
        }, 0);
    };

    /* Helper methods */
    var isArray = function(obj){
        return obj instanceof Array;
    };

    var argsToArray = function(args, start){
        return Array.prototype.slice.call(args, start || 0);
    };

    /* Public prototype methods */
    YPromise.prototype.then = function(comp, err, prog){
        if(comp instanceof Function){
            this._thens.push({
                comp: comp,
                err: err,
                prog: prog
            });
        }
        return this;
    };

    YPromise.prototype.done = function(comp){
        if(comp instanceof Function){
            this._thens.push({
                comp: comp,
                err: function(error){
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

    /* Static methods */
    YPromise.join = function(){
        var args, isQueue = false;
        
        if(arguments.length === 1 && isArray(arguments[0])){
            args = arguments[0];
            isQueue = true;
        }else{
            args = argsToArray(arguments);
        }
        
        var len = args.length;
        var counter = 0;
        var results = [];
        
        return new YPromise(function(comp, err, prog){
            if(len === 0){
                comp();
                return;
            }
            
            for(var i = 0; i < len; i++){
                (function(index){
                    var promise = isQueue ? args[index]() : args[index];
                    promise.then(function(){
                        results[index] = arguments.length <= 1 ? arguments[0] : argsToArray(arguments);
                        counter++;
                        prog(counter);
                        if(counter === len){
                            comp.apply(this, results);
                        }
                    }, function(){
                        var errorArgs = argsToArray(arguments);
                        errorArgs.push('error in function ' + index);
                        err.apply(this, errorArgs);
                    });
                })(i);
            }
        });
    };

    YPromise.queue = function(tasks, isOrder){
        if(!isOrder){
            return YPromise.join(tasks);
        }
        
        return new YPromise(function(comp, err, prog){
            var len = tasks.length;
            var counter = 0;
            var results = [];
            
            if(len === 0){
                comp();
                return;
            }
            
            function process(index){
                tasks[index]().then(function(){
                    results[index] = arguments.length <= 1 ? arguments[0] : argsToArray(arguments);
                    counter++;
                    prog(counter);
                    if(counter === len){
                        comp.apply(this, results);
                    }else{
                        process(counter);
                    }
                }, function(){
                    results[index] = 'error in function ' + index;
                    counter++;
                    if(counter === len){
                        comp.apply(this, results);
                    }else{
                        process(counter);
                    }
                });
            }
            
            process(0);
        });
    };

    YPromise.any = function(){
        var args = argsToArray(arguments);
        var len = args.length;
        var doneFlag = false;
        
        return new YPromise(function(comp){
            if(len === 0){
                comp();
                return;
            }
            
            for(var i = 0; i < len; i++){
                args[i].then(function(){
                    if(!doneFlag){
                        doneFlag = true;
                        comp.apply(this, arguments);
                    }
                });
            }
        });
    };

    YPromise.as = function(sync){
        return new YPromise(function(comp){
            comp(sync);
        });
    };
    
    /**
     * Sleep utility - creates a promise that resolves after specified time
     * @param {number} time - Time in milliseconds
     * @returns {YPromise}
     */
    YPromise.sleep = function(time){
        return new YPromise(function(comp){
            setTimeout(function(){
                comp();
            }, parseInt(time, 10));
        });
    };

    // Export for Node.js and browser
    if(typeof module !== 'undefined' && module.exports){
        module.exports = YPromise;
        // Convenience alias
        module.exports.YPro = YPromise;
    }
    if(typeof window !== 'undefined'){
        window.YPromise = YPromise;
        window.YPro = YPromise;
    }
})();
