define([], function(){
	console.log("lang module");
	
	var _empty = {}, 
		reTmpl = /\$\{(\w+)(([\/\|\*\+\-])(\w+))?\}/g; 
		

	var mixin = function(thing, props) {
		for(var key in props) {
			if(key in _empty) continue; 
			thing[key] = props[key];
		}
		return thing;
	},
	uniqId = function(stem) {
		return (stem || "thing") +"_"+ (uniqId.count++);
	};
	
	uniqId.count = 0;

	var bind = function(scope, fn) {
		return function() {
			return fn.apply(scope, arguments);
		};
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
	
	var templatize = function(tmpl, data) {
		var str = tmpl.replace(reTmpl, function(m, name, filter, op, operand){
			var val = data[name];
			if(filter) {
				// resolve operand to a value, looking first in the data, then whatever 'this' is
				// console.log(name, val, "template value matches: ", filter, op, operand);
				operand = (operand in data) ? data[operand] : this[operand];
				switch(op) {
					case "*": 
						return Number(val) * operand;
					case "/": 
						return Number(val) / operand;
					case "+": 
						return Number(val) + operand;
					case "-": 
						return Number(val) - operand;
					case "|": 
						return operand(val);
					default: 
						throw new Error("Unknown operator in template filter expression: " + op);
				}
			}
			return val;
		});
		return str;
	};
	
	console.log("lang module returning exports");
	return	{
		mixin: mixin,
		uniqId: uniqId,
		bind: bind,
		createObject: createObject,
		templatize: templatize
	};
	
	
});