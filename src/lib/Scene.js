define([
		'lib/lang',
		'lib/compose',
		'lib/event',
		'lib/state',
		'lib/rendering'
	], function (lang, Compose, Evented, Stateful, Renderable){
	
	var notimpl = function(name){
		return function(){
			console.log("method " + name + " is not implemented");
		};
	};
	return Compose(Compose, Evented, Stateful, Renderable, {
		id: "",
		type: "Scene",
		update: notimpl("update"),
		redraw: notimpl("redraw"),
		enter: function(){
			console.log(this.id + " Scene enter");

			this.prepare();

			// pass the game node as the container for the scene's rendering
			var node = this.config.get("gameNode"); 
			this.render(node);
		},
		exit: notimpl("exit"),
		load: function(){
			console.log("Scene loading");
		},
		unload: function(){
			console.log("Scene unloading");
		},
		prepare: notimpl("prepare")
	}, function(){
		// this.setState("active") has same effect as this.start() (?)
		console.log(this.id + ": in lib/Scene ctor");
		this.registerState("active", {
			enter: lang.bind(this, function(){
				this.enter();
			})
		});
		// 
		this.entities = [];
	});

});