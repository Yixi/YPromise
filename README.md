YPromise
====
version 
YPromise is a lightweight javascript async Promises library.

##How to use

If you have used WinJS promise developed windows8 app before, you can easily get started.

1. you need to defined you async function use the `YPro` or `YPromise` to return a Promise object.
<pre>
function fn1(){
		return new YPro(function(comp,err){
    		setTimeout(function(){
						comp("function1 is done");
				},3000);
		}
}
function fn2(){
		return new YPro(function(comp,err){
    		setTimeout(function(){
						comp("function2 is done");
				},1000);
		}
}
</pre>
2. use `.then` or `.done` to manage your async callback, you need return a Promise function in last promise.
<pre>
var PromiseA = fn1()
				.done(function(data){
						console.log(data)   // function1 is done
						return fn2();       // need return a promise function
				})
				.then(function(data){
						console.log(data)   // function2 is done
				},function(error){
						console.error(error) // handle the error
				});
</pre>
3. also you can cancel the promise to stop the promise.
<pre>
PromiseA.cancel(function(){
	console.log("PromiseA is canceled");
});
</pre>

more usage you can find in `/example` folder
