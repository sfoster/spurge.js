define([
		'lib/lang',
		'lib/Compose',
		'lib/entity',
		'game/npc',
		'game/Scene',
		'lib/loop'
	], function (lang, Compose, ent, npc, Scene, loop){

	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	console.log('defining playerScene');
	var scene = Compose.create(function(){
		console.log("testPlayer scene ctor");
	  this.init();
		console.log("controls: ", this.controls);
		this.loop = new loop.Loop({
			update: lang.bind(this, "update"),
			redraw: lang.bind(this, "redraw")
		});
	}, Scene, 
	{
		id: "testPlayer",
		className: "scene scene-world",

		enter: after(function(){
			console.log("entering testPlayer scene");
			this.loop.startLoop();
			// run for just 10 seconds
			this.endTime = this.startTime + 10000;
			this.controls.init();
		}),

		redraw: function(count){
			this.raiseEvent("redraw");
		},
		update: function(frameCount){
			this.timestamp = (new Date()).getTime();
			if(this.stop) {
				console.log("stopping at: ", this.timestamp);
				return this.loop.stopLoop();
			}
			// update logic: 
			// process rules
			// call update on all active entities, 
			this.raiseEvent("update");
		},
		render: from(Scene),
		exit: before(function(){
			console.log("Scene exit, isRunning=false, clearing interval: ", this._intervalId);
			this.loop.stopLoop();
		}),
		load: from(Scene),
		unload: from(Scene),
		
		prepare: function(){
			console.log("preparing playerScene");
			var config = this.config, 
				bounds = {
					x: config.get("mapWidth"), 
					y: config.get("mapHeight")
				}, 
				thing = null, 
				entities = this.entities
			;

			var targetSprite = new ent.Sprite({
				width: 50,
				height: 50,
				imgSrc: lang.modulePath('lib/entity', '../assets/enemy1.png')
			});
			targetSprite.load();
			
			var wall = Compose.create(ent.Barrier, {
				x: 0, y: 0, width: 5, height: bounds.y
			});
			
			for(var i=0; i<2; i++){
				entities.add( 
					new npc.MovingThing({
						id: "target_"+i,
						scene: this,
						bounds: bounds,
						x: Math.random() * (bounds.x - 50),
						y: Math.random() * (bounds.y - 50),
						sprite: targetSprite
					})
				);
			}
			
			var activeKeys = this.controls.keys;
			
			var you = Compose.create(npc.MovingThing, {
				id: "player_thing",
				scene: this,
				bounds: bounds,
				x: Math.random() * (bounds.x - 50),
				y: Math.random() * (bounds.y - 50),
				sprite: targetSprite, 
				speed: 1,
				update: after(function(){
					var speed = this.speed, 
					lastRotation = this.rotation;
					if(activeKeys.SHIFT){
						speed*=3;
						console.log("SHIFT speed up");
					}
					if(activeKeys.UPARROW){
						this.y -= speed;
						this.rotation = 0;
						this.dirty("y");
					}
					if(activeKeys.DOWNARROW){
						this.y += speed;
						this.rotation = 180;
						this.dirty("y");
					}
					if(activeKeys.LEFTARROW){
						this.x -= speed;
						this.rotation = 270;
						this.dirty("x");
					}
					if(activeKeys.RIGHTARROW){
						this.x += speed;
						this.rotation = 90;
						this.dirty("x");
					}
					if(lastRotation != this.rotation) {
						this.dirty("rotation");
					}
				})
			});
			
			window.you = you;
			entities.add(you);
			// hook up their events
			// TODO: pass entity the scene so they can register their own events?
			lang.forEach(entities, function(thing){
				// hook up this entity to the scene update events
				if(!thing.handles) {
					throw new Error("no handles for entity: ", thing);
				}
				thing.handles.push(
					this.addEventListener("update", lang.bind(thing, "update")),
					this.addEventListener("redraw", lang.bind(thing, "redraw"))
				);
			}, this);
			
			this.prepared = true;
		}
	});
	return scene;
});