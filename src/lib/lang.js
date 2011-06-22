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
	var modulePath = function(mod, relpath) {
		// build a path from a reference module path
		console.log("modulePath: ", mod, relpath);
		var hd = document.getElementsByTagName("head")[0], 
			scripts = hd.getElementsByTagName("script"), 
			match,
			re = new RegExp('^(.*/?' + mod + ")\\.js"), 
			a = document.createElement("a"), 
			dirname; 
		console.log("matching with: ", re.source);
		for(var i=0; i<scripts.length; i++){
			if(scripts[i].src && (match = re.exec(scripts[i].src))) {
				console.log("match: ", match);
				a.href = match[1];
				// strip off the module filename (dirname(lib/module.js) -> lib)
				dirname = a.pathname.replace(/\/[^\/]+$/, '')
				console.log("dirname: ", dirname);
				break;
			}
		}
		// 
		relpath = relpath.replace(/^\.\//, '');
		while(relpath.indexOf('../') == 0){
			console.log("trimming relpath: ", relpath);
			relpath = relpath.substring(3);
			console.log("trimming dirname: ", dirname);
			dirname = dirname.replace(/\/[^\/]+$/, '');
			console.log("-> dirname: ", dirname);
		}
		return dirname +"/"+ relpath;
	};
	
	console.log("lang module returning exports");
	return	{
		mixin: mixin,
		uniqId: uniqId,
		bind: bind,
		createObject: createObject,
		templatize: templatize,
		modulePath: modulePath
	};
	
	
});