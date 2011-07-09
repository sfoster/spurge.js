define([
		'lib/lang',
		'lib/compose',
		'lib/event',
		'lib/state'
	], function (lang, Compose, Evented, State){
	
	return Compose(Compose, Evented, State, {
		id: "",
		type: "Scene",
		update: function(){},
		redraw: function(){},
		load: function(){
			console.log("Scene loading");
		},
		unload: function(){
			console.log("Scene unloading");
		},
	}, function(){
		// this.setState("active") has same effect as this.start() (?)
		console.log(this.id + ": in scene ctor");
		this.registerState("active", {
			enter: lang.bind(this, function(){
				this.start();
			})
		});
	});

});