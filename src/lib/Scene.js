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
		Compose, Evented, Stateful, Renderable, 
		function(){
			this.init();
	},{
		id: "",
		type: "Scene",
		entityRegistry: null,
		
		init: function(){
			// this.setState("active") has same effect as this.start() (?)
			console.log(this.id + ": in lib/Scene init");
			
			this.entityRegistry = {};
			// define an 'add' method on our entity array
			// to create an entry in the registry
			this.entities = (function(reg){
				var ar = [];
				ar.add = function(ent){
					if(!ent.id) {
						throw new Error("Adding entity without an id");
					}
					reg[ent.id] = reg;
				};
				return ar;
			})(this.entityRegistry);
			
			// set up dict for all behaviors registered with this scene
			this.behaviors = {};
			
			this.registerState("active", {
				enter: lang.bind(this, function(){
					this.enter();
				})
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
			} else if(this.config) {
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
	// export the Scene class
	return Scene;

});