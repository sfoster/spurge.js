define(['lib/compose', 'lib/lang/array', 'lib/lang/object', 'lib/KeyedArray'], function(Compose, array, object, KeyedArray){
	console.log("lang module");
	
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var reTmpl = /\$\{(\w+)(([\/\|\*\+\-])(\w+))?\}/g, 
		undef = (function(){ return; })(), 
		undefinedThis = (function(){
	        return this; // this depends on strict mode
	    })();

	uniqId = function(stem) {
		return (stem || "thing") +"_"+ (uniqId.count++);
	};
	
	uniqId.count = 0;

	var bind = function(scope, fn) {
		return function() {
			if(typeof fn == "string") {
				fn = scope[fn];
			}
			return fn.apply(scope, arguments);
		};
	};

	// make local aliases for object module methods
	var mixin = object.mixin, 
		keys = object.keys,
		forIn = object.forIn, 
		createObject = object.createObject, 
		_empty = _empty;
		
	// make local alias for array module method
	var forEach = array.forEach;
	
	var isArray = function(thing){
		return (
			typeof thing == "object"
			&& thing.constructor == Array
		);
	};
	
	var hasProp = Object.prototype.hasOwnProperty;

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
	var modulePath = (function(){
		var pathCache = {};
		return function(mod, relpath) {
			// build a path from a reference module path
			var dirname = pathCache[mod] || "";
			
			if(!dirname){
				var hd = document.getElementsByTagName("head")[0], 
					scripts = hd.getElementsByTagName("script"), 
					match,
					re = new RegExp('^(.*/?' + mod + ")\\.js"), 
					a = document.createElement("a"); 

				console.log("matching with: ", re.source);
				for(var i=0; i<scripts.length; i++){
					if(scripts[i].src && (match = re.exec(scripts[i].src))) {
						//console.log("match: ", match);
						a.href = match[1];
					 	// strip off the module filename (dirname(lib/module.js) -> lib)
						dirname = a.pathname.replace(/\/[^\/]+$/, '');
						//console.log("dirname: ", dirname);
						break;
					}
				}
				if(!dirname) {
					throw new Error("couldn't resolve path for module: " + mod);
				}
				console.log(mod + ": " + dirname);
				pathCache[mod] = dirname;
			}
			// 
			relpath = relpath.replace(/^\.\//, '');
			while(relpath.indexOf('../') == 0){
				// console.log("trimming relpath: ", relpath);
				relpath = relpath.substring(3);
				// console.log("trimming dirname: ", dirname);
				dirname = dirname.replace(/\/[^\/]+$/, '');
				// console.log("-> dirname: ", dirname);
			}
			return dirname +"/"+ relpath;
		};
	})();
	

	// console.log("lang module returning exports");
	return	{
		mixin: mixin,
		uniqId: uniqId,
		bind: bind,
		createObject: createObject,
		keys: keys,
		forEach: forEach,
		forIn: forIn,
		isArray: isArray,
		templatize: templatize,
		modulePath: modulePath,
		// ensure Compose's this is the default/undefined 'this' else it goes wobbly
		Compose: mixin(bind(undefinedThis, Compose), Compose),
		KeyedArray: KeyedArray,
		_empty: _empty
	};
	
	
});