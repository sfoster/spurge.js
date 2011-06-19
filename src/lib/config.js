define(["lib/lang"], function(lang){
	var conf = {
		REFRESH_RATE: 30
	};
	
	return {
		set: function(name, value){
			if(arguments.length == 1 && typeof name=="object") {
				lang.mixin(conf, name);
			} else {
				conf[name] = value;
			}
			return conf;
		},
		get: function(name){
			if(name) {
				return conf[name];
			} else {
				return conf;
			}
		}
	};
})