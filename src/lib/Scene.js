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
			console.log("State id: " + this.id + " has this: ", this);
			var node = this.config.get("gameNode"); 
			// pass the game node as the container for the scene's rendering
			this.render(node);
		},
		exit: notimpl("exit"),
		load: function(){
			console.log("Scene loading");
		},
		unload: function(){
			console.log("Scene unloading");
		},
	}, function(){
		// this.setState("active") has same effect as this.start() (?)
		console.log(this.id + ": in lib/Scene ctor");
		this.registerState("active", {
			enter: lang.bind(this, function(){
				this.enter();
			})
		});
	});

});