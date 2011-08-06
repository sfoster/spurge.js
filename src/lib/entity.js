define([
		'lib/lang',
		'lib/Compose',
		'lib/rendering'
	], function (lang, Compose, Renderable){
	
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var exports = {};
	
	var registry = exports.registry = {};
	
	exports.Sprite = Compose(Compose, function(){
		this.img = new Image();
	}, {
		width: 16,
		height: 16,
		imgSrc: "",
		loaded: false,
		load: function(cb){
			if(cb){
				this.onload = cb;
			}
			this.img.src = this.imgSrc;
		}
	});

	var actorId = 0;
	
	exports.Actor = Compose(Compose, function(){
		this._dirty = { x: true, y: true };
		this.handles = [];
		// active state is implicit in instantiation?
		// TODO: maybe move event names into an array to make subclassing easier?
		
		// should have an id by now
		// if not, invent one.
		if(!this.id) {
			this.id = "actor_"+(actorId++);
		}
		registry[this.id] = this;
		// hook into scene events we're interested in
		this.hookEvents();
	}, Renderable, 
	{
		// rendering
		// behavior - set goals, rules?
		// 	needs states for dead, alive, shoot, hit(?)
		// health, stats
		// 
		collisionGroup: "Actors", // default
		hookEvents: function(){
			var scene = this.scene; 
			if(scene){
				this.handles.push(
					scene.addEventListener("update", lang.bind(this, "update")),
					scene.addEventListener("redraw", lang.bind(this, "redraw"))
				);
			}
		},
		redraw: from(Renderable, "update"), 
		dirty: function(){
			lang.forEach(arguments, function(name){
				this._dirty[name] = true;
			}, this);
			return this;
		},
		update: function(){
			// TODO: process rules, behaviour
		},
		destroy: function(){
			var hdl = null;
			while((hdl = this.handles.shift())){
				hdl.remove();
			}
			this.unrender();

			registry[this.id] = null;
			delete registry[this.id];
			
		},
		onHit: function(/*hitee*/entity){
			// console.log(this.id +": got hit");
			// reset (we can get hit while this effect is tailing off)
			var hitDecay = 64;

			// we could apply different behavior depending on what we collided with
			this.glow = hitDecay;
			this.dirty('glow'); // next redraw will apply this glow effect
			
			// apply hit effect for a few ticks
			if(!this._glowHitHdl){
				// countdown by hooking the scene's update event
				this._glowHitHdl = this.scene.addEventListener(
					"update", 
					lang.bind(this, function(){
						if(--hitDecay <= 0){
							this._glowHitHdl.remove();
							delete this._glowHitHdl;
							this.glow = false;
							this.dirty('glow');
						}
					})
				);
			}
		}
	});
	// add collisionGroup as a static property
	exports.Actor.collisionGroup = exports.Actor.prototype.collisionGroup;

	return exports;
});