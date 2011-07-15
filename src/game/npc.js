define([
		'lib/lang',
		'lib/Compose',
		'lib/Actor',
		'lib/state',
	], function (lang, Compose, Actor, Stateful){

	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var exports = {};
	console.log("defining TestThing");
	exports.TestThing = Compose(function(args){
		console.log("TestThing ctor");
		if(args.bounds){
			// each to his own boundaries
			this.bounds = lang.createObject(args.bounds);
			delete args.bounds;
		}
		this.direction = {
			x: Math.round(Math.random()) ? 1 : -1,
			y: Math.round(Math.random()) ? 1 : -1
		};
		this.decayTime = (new Date()).getTime() + (10e3 * Math.random());
	}, Actor, 
	{
		type: "thing",
		className: "thing",
		height: 0,
		width: 0,
		frameY: 0,
		sprite: null,
		x: 0,
		y: 0,
		decayTime: -1,
		direction: null,
		bounds: null,
		update: after(function(frameCount){
			// placeholder move/do fn
			// console.log("thing x/y: ", this.x, this.y);
			var lastFrame = this._lastFrame || 0, 
				now = (new Date).getTime(), 
				velX = this.direction.x, 
				velY = this.direction.y, 
				x = this.x, y = this.y; 

			if(now >= this.decayTime) {
				this.destroy();
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
		})
	});
	
	return exports;
});