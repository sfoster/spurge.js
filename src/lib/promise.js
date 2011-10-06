define([
	"lib/lang",
	"lib/compose"
	], function (lang, Compose){

// extracted from curl.js
// 
	var Promise = function () {

		var self = this,
			thens = [];

		function then (resolved, rejected) {
			// capture calls to callbacks
			thens.push([resolved, rejected]);
		}

		function resolve (val) { complete(true, val); }

		function reject (ex) { complete(false, ex); }

		function complete (success, arg) {
			// switch over to sync then()
			then = success ?
				function (resolve, reject) { resolve && resolve(arg); } :
				function (resolve, reject) { reject && reject(arg); };
			// disallow multiple calls to resolve or reject
			resolve = reject =
				function () { throw new Error('Promise already completed.'); };
			// complete all callbacks
			var aThen, cb, i = 0;
			while ((aThen = thens[i++])) {
				cb = aThen[success ? 0 : 1];
				if (cb) cb(arg);
			}
		}

		this.then = function (resolved, rejected) {
			then(resolved, rejected);
			return self;
		};
		this.resolve = function (val) {
			self.resolved = val;
			resolve(val);
		};
		this.reject = function (ex) {
			self.rejected = ex;
			reject(ex);
		};

	}
	
	// from dojo
	Promise.when = function(promiseOrValue, /*Function?*/callback, /*Function?*/errback, /*Function?*/progressHandler){
		// summary:
		//		This provides normalization between normal synchronous values and
		//		asynchronous promises, so you can interact with them in a common way
		// example:
		//		|	function printFirstAndList(items){
		//		|		dojo.when(findFirst(items), console.log);
		//		|		dojo.when(findLast(items), console.log);
		//		|	}
		//		|	function findFirst(items){
		//		|		return dojo.when(items, function(items){
		//		|			return items[0];
		//		|		});
		//		|	}
		//		|	function findLast(items){
		//		|		return dojo.when(items, function(items){
		//		|			return items[items.length];
		//		|		});
		//		|	}
		//		And now all three of his functions can be used sync or async.
		//		|	printFirstAndLast([1,2,3,4]) will work just as well as
		//		|	printFirstAndLast(dojo.xhrGet(...));

		if(promiseOrValue && typeof promiseOrValue.then === "function"){
			// console.log("dojo.when, returning from value.then");
			return promiseOrValue.then(callback, errback, progressHandler);
		}
		return callback(promiseOrValue);
	};
	
	// from me
	Promise.Sequence = Compose(Array, {
		next: function(){
			var args, meth;
			if(this.length) {
				args = [];
				meth = this.shift();
				if(lang.isArray(meth)){
					args = meth;
					meth = args.shift();
				}
				Promise.when(
					meth.apply(this, args), 
					this.next
				);
			}
		}
	}, function(){
		// ensure next is always bound
		this.next = lang.bind(this, this.next);
		if(arguments.length){
			if(arguments.length == 1 && arguments[0].constructor == Array){
				this.push.apply(this, arguments[0]);
			} else {
				this.push.apply(this, arguments);
			}
		}
		return this;
	}); 
	
	return Promise;
});