define([
		'lib/lang',
		'lib/compose',
		'lib/Evented',
		'lib/state',
		'lib/rendering'
	], function (lang, Compose, Evented, Stateful, Renderable){
	
	var notimpl = function(name){
		return function(){
			console.log("method " + name + " is not implemented");
		};
	};
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	// Scene is a concrete class, we expect new Scene(args)
	var Scene = Compose(
		Compose, Evented, Stateful, Renderable, function(){
			// set up dict for all behaviors registered with this scene
			console.log("lib/Scene ctor");
			this.behaviors = {};

			// generate an id if non was provided
			if(!this.id) {
				this.id = "scene_"+(Scene._idCounter++);
			}
		},{
		id: "",
		type: "Scene",
		
		init: function(config){
			if(config) {
				this.config = config;
			}
			console.log(this.id + ": in lib/Scene init, config is: ", this.config);
			
			this.registerState("active", {
				enter: lang.bind(this, "enter")
			});
		},
		
		enter: function(){
			console.log(this.id + " Scene enter");

			if(!this.prepared){
				this.prepare();
			}

			// don't re-render on re-entry
			if(this.node){
				this.node.style.zIndex = 10;
			} else {
				// pass the game node as the container for the scene's rendering
				var gameNode = this.config.get("gameNode"); 
				gameNode && this.render(gameNode);
			}
			return this;
		},
		
		// update: notimpl("update"),
		render: after(function(container){
			console.log( this.id +" Initial Scene rendering:", container);
			// console.log("scene node: ", this.node);

			// render all registered entities
			// which creates their DOM and places them on the stage
			// any entities creates later should render themselves
			var ents = this.entities || [];
			for(var i=0, len=ents.length; i<len; i++){
				ents[i].render(this.node);
			}
			return this;
		}),
		exit: function(){
			console.log(this.id +" Scene exit");
			if(this.node){
				this.node.style.zIndex = 0;
			}
		},

		load: function(){
			console.log(this.id +" Scene loading");
		},
		unload: function(){
			console.log(this.id +" unloading");
		},

		
		update: notimpl("update"),
		redraw: notimpl("redraw"),
		prepare: notimpl("prepare")
	});
	Scene._idCounter = 0;
	// export the Scene class
	return Scene;

});