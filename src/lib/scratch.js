define([
		'lib/lang',
		'lib/compose',
		'lib/Evented',
		'lib/state',
	], function (lang, Compose, Evented, state){
	
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var Renderable = {
		width: 0,
		height: 0,
		node: null,
		className: "",
		render: function(container, posn){
			console.log(this.id + " Renderable.render");
			if(!container){
				container = document.body;
			}
			var node = this.node = document.createElement("div"); 
			node.className = this.className;
			this.width && (node.style.width = this.width + "px");
			this.height && (node.style.height = this.height + "px");
			container.appendChild(node);
		},
		unrender: function(){
			if(this.node && this.node.parentNode) {
				this.node.parentNode.removeChild(this.node);
				this.node = null;
			}
		}
	};

	// a thing which has a sprite assocated w. it
	// ??
	var Sprited = Compose(Renderable, {
		width: 0,
		height: 0,
		rotation: 0,
		opacity: 1,
		imageSrc: '',
		frameIdx: 0,
		render: function(){
			// TODO: wrap/override Renderable render
			console.log(this.id + ": Sprited render");
		}
	});
	
	Sprited._paths = {};
	Sprited.preload = function(url){
		if(!(url in this._paths)){
			var img = new Image();
			img.onload = function(){ console.log("preloaded: ", url); };
			img.src = url;
		}
	};
	
	var Entity = Compose(Compose, Renderable);
	
	// a Scene should prep one of more layers to place stuff on
	// The provides a parentNode for each
	var Scene = Compose(Compose, Renderable, Evented, states.Active, {
		start: from(states.Active, "enter"),
		stop: from(states.Active, "exit"),
		var sprites = this.sprites, 
			config = this.config, 
			modules = [npc, player];
		console.log("game (this): ", this);
		init: function(){
			modules.forEach(function(mod){
				if(mod.sprites) {
					for(var i in mod.sprites) {
						sprites[i] = mod.sprites[i];
						console.log("setup sprite in module: " + i);
						// populate any templated paths with our config
						if(sprites[i][0].indexOf('${') > -1){
							sprites[i][0] = lang.templatize(sprites[i][0], config);
						}
					}
				}
			});
		},
		onEnter: function(){
			// create/place all layers
			// fire of events to all entities
		}
		onEnter: function(){
		}
	});
	
	var Actor = Compose(Entity, Sprited, {
		playerControlled: false
		// idle/walking/running/jumping/shooting/etc. states
		// each might have variants e.g. based on other states like facing: n/ne/e/se/s/sw/w/nw or rotation
		// behaviors: traits we can mixin
		// 	that register w. different hooks in the lifecylce
		// 	.e.g. during main run loop, up arrow makes me walk up (set of controls for run - is/has key pressed)
		// 	e.g. during scene entry I start counting down and explode after n seconds/frames
		// 	e.g. I seek a target, which in turn puts movement towards that target during run loop
		// 	e.g. I fire at enemies, which means I check whats in range during run loop, start firing until they are dead or out of range
		// 	e.g. I blow up when enemies are near/on: mine tiles
		// 	I play a background sound loop
		// 	I get injured when shot/whacked/etc. (oncollision)
		// 	
	});
	var Game = Compose(Evented, function(args){
		lang.mixin(this, args || {});
		this.scenes = [
			new Scene({
				id: "scene1",
				className: "mapBg"
			})
		]; 
		console.log("Game ctor: ", this.id);
		this.scene = this.scenes[0];
		this.scene.addEventListener("active/enter", function(){
			console.info("Scene is active");
		})
	},{
		showMenu: function(){
			// implicit pause
		},
		hideMenu: function(){
			// implicit unpause
		},
		start: function(container){
			// play current scene
			this.scene.render(container);
			this.scene.start();
		},
		stop: function(){
			// stop (end/abort) current scene
		},
		pause: function(){
			// freeze (stop clock), preserve current state
		}
	});

	var Controls = Compose.create({
		// event handling: register listeners for mouse/key events
		// and other external events
	});
	var CollisionGroup; // types of things that can experience collisions
	
	return Game({ id: "thegame", states: states });
	
});