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


	return Compose(Compose, Evented, Stateful, Renderable, {
		id: "",
		type: "Scene",
		
		enter: function(){
			console.log(this.id + " Scene enter");

			if(!this.prepared){
				this.prepare();
			}

			// pass the game node as the container for the scene's rendering
			var gameNode = this.config.get("gameNode"); 

			// don't re-render on re-entry
			if(this.node){
				this.node.style.zIndex = 10;
			} else {
				this.render(gameNode);
			}
		},
		
		// update: notimpl("update"),
		render: after(function(container){
			console.log( this.id +" Initial Scene rendering:", container);
			// console.log("scene node: ", this.node);

			var ents = this.entities || [];
			for(var i=0, len=ents.length; i<len; i++){
				ents[i].render(this.node);
			}
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