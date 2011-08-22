define([
		'lib/lang',
		'lib/Compose',
		'lib/rendering',
		'lib/collision'
	], function (lang, Compose, Renderable, collision){

	console.log("lib/entity module");
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var exports = {};
	
	exports.Manager = Compose({

	}, function(){
		// this.setState("active") has same effect as this.start() (?)
		console.log(this.id + ": in entity/Manager ctor");
		
		this.entities = new lang.KeyedArray();
	});
	
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
		},
		onHit: function(/*hitee*/ent){
			// we respond differently if we get hit by a missile vs. bumping into a wall
			// TODO: refactor to allow handling for different collision types
			// maybe test for onHitBy{type} method otherwise use default handling
			
			// console.log(this.id +": got hit");

			// reset effects in ms
			var hitDecay = 64;

			
			// should entities have velocity property
			// which we could use here to determine from which direction 
			// we were hit?
			// for now, we'll assume the edge where we overlap 
			// is the direction the hit came from
			
			// 
			var p1 = {
					x: this.x+(this.width/2),
					y: this.y+(this.height/2),
					r: Math.max(this.width, this.height)/2
				}; 

			var p2 = {
					x: ent.x+(ent.width/2),
					y: ent.y+(ent.height/2),
					r: Math.max(ent.width, ent.height)/2
				}; 
				
			// find the angle btw. 2 points
			// and the nearest edge it corresponds to
			var rad = Math.atan2(p2.y - p1.y, p2.x - p1.x);
			// express radians as 1-8 to give us the edge/corner
			var edge = Math.round(8 * (Math.PI+rad) / (Math.PI+Math.PI));
			
				
			// console.log("x/y: %s, angle: %s, edge: %s", this.x+"/"+this.y, rad, edge);
			// I'm sure there's a clever way to do this without the switch
			// maybe rotate and bitmask?
			switch(edge) {
				case 2: // North edge collision
					// top edge collision
					this.y = ent.y + ent.height + 2; // back off a bit
					this.dirty('y'); // next redraw will move us
					break;
				case 3: //  NE collision
					this.y = ent.y + ent.height + 2; // back off a bit
					this.x = ent.x - this.width - 2; // back off a bit
					this.dirty('y'); // next redraw will move us
					this.dirty('x'); // next redraw will move us
					break;
				case 4: //  E collision
					this.x = ent.x - this.width - 2; // back off a bit
					this.dirty('x'); // next redraw will move us
					break;
				case 5: //  SE collision
					this.y = ent.y - this.height - 2; // back off a bit
					this.x = ent.x - this.width - 2; // back off a bit
					this.dirty('x'); // next redraw will move us
					this.dirty('y'); // next redraw will move us
					break;
				case 6: //  S collision
					this.y = ent.y - this.height - 2; // back off a bit
					this.dirty('y'); // next redraw will move us
					break;
				case 7: //  SW collision
					this.y = ent.y - this.height - 2; // back off a bit
					this.x = ent.x + ent.width + 2; // back off a bit
					this.dirty('x'); // next redraw will move us
					this.dirty('y'); // next redraw will move us
					break;
				case 8: //  W collision
				case 0: //  W collision
					this.x = ent.x + ent.width + 2; // back off a bit
					this.dirty('x'); // next redraw will move us
					break;
				default: //  NW collision
					this.x = ent.x + ent.width + 2; // back off a bit
					this.y = ent.y + ent.height + 2; // back off a bit
					this.dirty('x'); // next redraw will move us
					this.dirty('y'); // next redraw will move us
					break;
			}
			// console.log("adjust to x/y: %s", this.x+"/"+this.y);

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

	var barrierId = 0;
	var Barrier = exports.Barrier = Compose(Compose, collision.Collidable, Renderable, function(){
		this._dirty = { x: true, y: true };

		// should have an id by now
		// if not, invent one.
		if(!this.id) {
			this.id = "barrier_"+(barrierId++);
		}
		// hook into scene events we're interested in
	}, {
		type: "barrier",
		className: "sprite static-barrier",
		width: 10,
		height: 10,
		collisionGroup: "Blockers"
	});
	Barrier.collisionGroup = Barrier.prototype.collisionGroup;

	return exports;
});