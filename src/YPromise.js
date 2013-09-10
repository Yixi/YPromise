/***
 * a javascript Promise library .
 *
 * define a asyn function use promise:
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
        setTimeout(function(){
            worker.call(context,_comp,_err);
        },0);
    };

    YPromise.prototype.then = function(comp,err){
        if(comp instanceof Function){

            this._thens.push({
                comp:comp,
                err:err
            });
        }
        return this;
    };

    YPromise.prototype.done = function(comp){
        if(comp instanceof Function){
            this._thens.push({
                comp:comp
            })
        }
        return this;
    };

    YPromise.prototype.cancel = function(callback){
        this._thens.length = 0;
        if(callback instanceof Function){
            callback();
        }
    };

    window.YPro = window.YPromise = YPromise;
})();