define([
		'lib/lang',
		'lib/Compose',
		'lib/entity',
		'lib/state',
		'lib/collision',
	], function (lang, Compose, ent, Stateful, collision){

	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var exports = {};
	console.log("defining TestThing");
	
	exports.TestThing = Compose(ent.Actor, collision.Collidable, function(args){
		if(args.bounds){
			// each to his own boundaries
			this.bounds = lang.createObject(args.bounds);
			delete args.bounds;
		}
		this.direction = {
			x: Math.round(Math.random()) ? 1 : -1,
			y: Math.round(Math.random()) ? 1 : -1
		};
		// this.decayTime = (new Date()).getTime() + (10e3 * Math.random());
	},
	{
		type: "thing",
		className: "thing",
		collisionGroup: ent.Actor.collisionGroup,
		height: 0,
		width: 0,
		frameY: 0,
		sprite: null,
		x: 0,
		y: 0,
		decayTime: -1,
		direction: null,
		bounds: null,
		_firstUpdate: true,
		update: after(function(frameCount){
			// console.log("thing x/y: ", this.x, this.y);
			var lastFrame = this._lastFrame || 0, 
				now = (new Date).getTime(), 
				velX = this.direction.x, 
				velY = this.direction.y, 
				x = this.x, y = this.y; 

			// if(now >= this.decayTime) {
			// 	this.destroy();
			// }
			if(this._firstUpdate){
				// console.log("_firstUpdate for thing: ", this.x, this.y);
				this._firstUpdate = false;
			} else {
				this.checkForCollisions(this.scene); 
			}
			
			var newY = y + velY; 
			if(newY < 0 || newY +this.height > this.bounds.y) {
				velY *= -1; 
				newY = y + velY;
			}

			var newX = x + velX; 
			if(newX < 0 || newX +this.width > this.bounds.x) {
				velX *= -1; 
				newX = x + velX;
			}

			this.y = newY;
			this.x = newX;
			this.direction.x = velX;
			this.direction.y = velY;
		
			// only animate w. new sprite frame every n seconds
			if(now - lastFrame > 1000/30) {
				this.frameX = this.frameX >= 4 ? 0 : this.frameX+1; 
				this._lastFrame = now;
				this.dirty("frameX");
			}
			this.dirty("y", "x");
		}),
		onHit: from(ent.Actor)

	});
  console.log("ent.Actor, has onHit: ", ent.Actor.prototype.onHit);
	exports.MovingThing = Compose(ent.Actor, collision.Collidable, function(args){
		// add target-seeking behaviour
	}, {
		health: 1,
		type: "target",
		width: 50,
		height: 50,

		type: "movingthing",
		collisionGroup: ent.Actor.collisionGroup,

		_firstUpdate: true,
		className: "sprite static-target",
		speed: 2,// pixels per ms
		
		hookEvents: after(function(){
			this.scene.addEventListener("newtarget", lang.bind(this, "setTarget"));
		}),
		
		setTarget: function(target){
			// adjust so we put our mid-point over the target
			// presumably a collision will occur before that point
			this.target = { 
				x: target.x - this.width/2,
				y: target.y - this.height/2
			};
			console.log(this.id + " got new target: ", JSON.stringify(this.target));
		},
		_moveToTarget: function(target){
			var position = this,  // assumes 'this' has x, y properties
				target = target || this.target;

			//X distance to target, Y distance to target, and Euclidean distance
			var	x, y, d;

			//Velocity magnitudes
			var vx, vy, v;

			//Find x and y
			x = (target.x - position.x);
			y = (target.y - position.y);

			//If we're within 1 pixel of the target already, just snap
			//to target and stay there. Otherwise, continue
			if((x*x + y*y) <= 1)
			{
				position.x = target.x;
				position.y = target.y;
			}
			else
			{
				//Distance formula
				d = Math.sqrt((x*x + y*y));

				//Could set our velocity to move the distance in a fixed time. 
				//e.g. could match frame rate (1000/60)
				// var v = (d * this.speed)/60;
				
				v = this.speed;

				//Keep v above 1 pixel per update, otherwise it may never get to
				//the target. v is an absolute value thanks to the squaring of x
				//and y earlier
				if(v < 1){
					v = 1;
				}

				//Similar triangles to get vx and vy
				vx = x * (v/d), 
					vy = y * (v/d);

				//Then update camera's position and we're done
				position.x += vx;
				position.y += vy;
			}
		},
		
		update: after(function(frameCount){
			var lastFrame = this._lastFrame || 0, 
				now = (new Date).getTime();
			
			if(this.health <= 0) {
				this.destroy();
				return;
			}
			if(this._firstUpdate){
				console.log("_firstUpdate for thing: ", this.x, this.y);
				// this.dirty("y", "x");
				this._firstUpdate = false;
			} else {
				this.checkForCollisions(this.scene); 
			}

			var target = this.target;
			if(target){
				if(target.x !== this.x && target.y !== this.y){
					this._moveToTarget(target);
					this.dirty("y", "x");
				} else {
					target = this.target = null;
				}
			}
			// stop if no target, i.e. don't update x,y
			return this;
		}),
		onHit: function(){
		  console.log(this.id + " onHit");
		  // from(ent.Actor, "onHit")
		}
	});

	return exports;
});