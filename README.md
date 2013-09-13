#YPromise


基于 [Common JS Promises/A](http://wiki.commonjs.org/wiki/Promises) 建议的js异步编程库，提供一种Promise机制来管理js中的异步交互。

##使用
<pre>
function fun3(){
     return new YPro(function(comp,err){
        setTimeout(function(){
             comp('fun3 done');
        },3000);
     })
}
function fun4(){
     return new YPro(function(comp,err){
        setTimeout(function(){
             comp('fun4 done');
        },1000);
     })
}
var aPromise = fun3()
				.then(function(d){console.log(d); return fun4();})
				.then(function(){return fun3();})
				.then(function(){return fun4();})
				.done(function(){
					console.log("fun3->fun4->fun3->fun4 done");
				})

setTimeout(function(){
	aPromise.cancel(function(){
		console.log("Promise canceled");
	});
},9000);

</pre>


##API
如果你以前使用过window8开发中的WinJS.promise对象，你可以快速上手。

###`YPro(Function)` or `YPromise(Function)` 构造器
初始化一个promise对象
<pre>
var aPromise = new YPro(init);
</pre>
init方法中可传入三个参数，后面两个为可选

* _completeDispatch_ 初始化代码中操作完成后需要调用这个函数传递结果
* _errorDispatch_ 当发生错误时需要调用这方法传递错误
* _progressDispatch_ 如果异步操作需要支持进度条，初始化代码应该定期调用这个功能，并传递一个进度中间值

你需要使用这个返回一个promise对象来包裹你的异步函数
<pre>
/*example for constructor*/

function fn1(){
	return new YPro(function(comp,err,prog){
		var i = 0;
		function sleep(){
			i++;
			if(i>100){
				comp('fun1 done');
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
</pre>

###`.then`

指定promise完成后执行的函数，如果promise未完成则进行错误处理，以及处理进度变化通知
<pre>
YPro.then(onComplete, onError, onProgress).done();
</pre>
参数:
* _onComplete_ promise成功后将会执行此方法，参数来自构造函数中的 _completeDispatch_ 传递
* _onError_ promise发生错误将会调用此方法
* _onProgress_ 如果promise函数中有来自 _progressDispatch_ 调用将会触发此方法

返回：
该方法将会返回一个 `YPromise` 对象

<pre>
var PromiseA = fun1()
	.then(
		function(data){
			console.log(data);
		},
		function(error){
			console.error(error);
		},
		function(prog){
			console.log(prog+"%");
		}
	);
</pre>

###`.done` (待完善)
提供和then一样的作用，此方法不会传递错误值，将会把异常直接抛出
<pre>
YPro.done(omComplete);
</pre>










