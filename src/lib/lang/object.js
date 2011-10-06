define([], function(){

	var _empty = {};
	
	var mixin = function(thing, props) {
		for(var key in props) {
			if(key in _empty) continue; 
			thing[key] = props[key];
		}
		return thing;
	};
	
	// shim for Object.keys, using native impl where available
	var keys = (function(nativeKeys){
		return nativeKeys ? 
			function(obj){ return nativeKeys.call(Object, obj)} :
			function(obj){
				var names = [];
				for(var i in obj){
					if(i in _empty) continue;
					names.push(i);
				}
				return names;
			}
	})(Object.keys);

	var forIn = function(obj, fn, scope){
		for(var i in obj){
			if(i in _empty) continue;
			fn.call(scope || undefinedThis, obj[i], i, obj);
		}
	};

	var createObject = function(thing, props) {
		var FN = function(){};
		FN.prototype = thing; 
		var obj = new FN;
		if(props) {
			mixin(obj, props);
		}
		return obj;
	};


	// console.log("lang module returning exports");
	return	{
		_empty: _empty,
		mixin: mixin,
		keys: keys,
		forIn: forIn,
		createObject: createObject
	};
});
