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
    var YPromise = function(fn){
        var z = this;
        this._thens = [];
        function success(){

        }

//        fn(this.done.bind(this));
//        fn(this.done);
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

    YPromise.prototype.done = function(fn){

    };

    window.YPro = window.YPromise = YPromise;
})();