define([
		'lib/lang',
		'lib/Compose',
		'lib/entity',
		'game/npc',
		'game/Scene',
		'lib/Loopable'
	], function (lang, Compose, ent, npc, Scene, Loopable){

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
			this.raiseEvent("redraw");
			// var ents = this.entities || [];
			// for(var i=0, len=ents.length; i<len; i++){
			// 	ents[i].redraw(count);
			// }
			
		},
		update: function(frameCount){
			this.timestamp = (new Date()).getTime();
			if(this.timestamp >= this.endTime) {
				console.log("stopping at: ", this.timestamp);
				return this.stopLoop();
			}
			// update logic: 
			// process rules
			// call update on all active entities, 
			this.raiseEvent("update");
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
				}, 
				thing = null, 
				entities = this.entities
			;

			// make a load of TestThings
			for(var i=0; i<100; i++){
				thing = this._makeThing(bounds);
				entities.push(thing);
			}
			// hook up their events
			// TODO: pass entity the scene so they can register their own events?
			lang.forEach(entities, function(thing){
				// hook up this entity to the scene update events
				thing.handles.push(
					this.addEventListener("update", lang.bind(thing, "update")),
					this.addEventListener("redraw", lang.bind(thing, "redraw"))
				);
			}, this);
			
			this.prepared = true;
		}, 
		_makeThing: function(bounds, sprite){
			var sprite = lang.createObject({
				img: new Image(),
				loaded: false,
				load: function(cb){
					if(cb){
						this.onload = cb;
					}
					this.img.src = this.imgSrc;
				}
			}, {
				width: 32,
				height: 32,
				imgSrc: lang.modulePath('game/tester', '../assets/spaceship.png')
			});
			sprite.load();
			
			var thing = new npc.TestThing({
				width: 32,
				height: 32,
				bounds: bounds,
				frameY: 1,
				x: Math.random() * (bounds.x - 32),
				y: Math.random() * (bounds.y - 32),
				sprite: sprite
			});
			return thing;
		}
	});
});