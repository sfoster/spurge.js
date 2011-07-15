define([
		'lib/lang',
		'lib/Compose',
		'lib/Actor',
		'game/Scene',
		'lib/Loopable'
	], function (lang, Compose, Actor, Scene, Loopable){

	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	return Compose.create(function(){
		console.log("testThings scene ctor");
	}, Scene, Loopable,
	{
		id: "testThings",
		className: "scene scene-world",

		enter: after(function(){
			console.log("entering testThings scene");
			this.startLoop();
			// run for just 10 seconds
			this.endTime = this.startTime + 10000;
		}),

		redraw: function(count){
			var ents = this.entities || [];
			for(var i=0, len=ents.length; i<len; i++){
				ents[i].redraw(count);
			}
		},
		update: function(frameCount){
			this.timestamp = (new Date()).getTime();
			if(this.timestamp >= this.endTime) {
				console.log("stopping at: ", this.timestamp);
				return this.stopLoop();
			}
			// update logic: 
			// process rules
			// call update on all entities, 
			var ents = this.entities || [];
			for(var i=0, len=ents.length; i<len; i++){
				ents[i].update(frameCount);
			}
		},
		render: from(Scene),
		exit: before(function(){
			console.log("Scene exit, isRunning=false, clearing interval: ", this._intervalId);
			this.stopLoop();
		}),
		load: from(Scene),
		unload: from(Scene),
		
		prepare: function(){
			var config = this.config, 
				bounds = {
					x: config.get("mapWidth"), 
					y: config.get("mapHeight")
				}
			;

			for(var i=0; i<100; i++){
				this.entities.push(this._makeThing(bounds));
			}
			this.prepared = true;
		}, 
		_makeThing: function(bounds){
			var sprite = lang.createObject({
				elm: new Image(),
				loaded: false,
				load: function(cb){
					if(cb){
						this.onload = cb;
					}
					this.elm.src = this.imgSrc;
				}
			}, {
				width: 32,
				height: 32,
				imgSrc: lang.modulePath('game/tester', '../assets/spaceship.png')
			});
			sprite.load();
			
			var box = {
				w: 32,
				h: 32,
				x: Math.random() * (bounds.x - 32),
				y: Math.random() * (bounds.y - 32),
			};
			
			var thing = Compose.create(function(){
				// console.log("thing ctor");
			}, Actor, {
				type: "thing",
				className: "thing",
				height: box.h,
				width: box.w,
				frameY: 1,
				sprite: sprite,
				x: box.x,
				y: box.y,
				direction: {
					x: Math.round(Math.random()) ? 1 : -1,
					y: Math.round(Math.random()) ? 1 : -1
				},
				// innerContent: (new Date()).getTime(),
				update: after(function(frameCount){
					// placeholder move/do fn
					// console.log("thing x/y: ", this.x, this.y);
					var lastFrame = this._lastFrame || 0, 
						now = (new Date).getTime(), 
						velX = this.direction.x, 
						velY = this.direction.y, 
						x = this.x, y = this.y; 
					
					var newY = y + velY; 
					if(newY < 0 || newY +this.height > bounds.y) {
						velY *= -1; 
						newY = y + velY;
					}

					var newX = x + velX; 
					if(newX < 0 || newX +this.width > bounds.x) {
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
			return thing;
		}
	});
});