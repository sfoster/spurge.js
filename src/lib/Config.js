define(["lib/lang", "lib/compose"], function(lang, Compose){
	// summary:
	// 	a Config class with some defaults
	
	return Compose(Compose, {
		assetsDir: lang.modulePath("lib/Config", "../assets"),
		mapWidth: 640,
		mapHeight: 480,

		set: function(name, value){
			if(arguments.length == 1 && typeof name=="object") {
				lang.mixin(this, name);
			} else {
				this[name] = value;
			}
			return this;
		},
		get: function(name){
			if(name) {
				return this[name];
			} else {
				return this;
			}
		}
	});
})