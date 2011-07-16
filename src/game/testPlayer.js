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
		console.log("testPlayer scene ctor");
		console.log("controls: ", this.controls);
	}, Scene, Loopable,
	{
		id: "testPlayer",
		className: "scene scene-world",

		enter: after(function(){
			console.log("entering testPlayer scene");
			this.startLoop();
			// run for just 10 seconds
			this.endTime = this.startTime + 10000;
			this.controls.init();
		}),

		redraw: function(count){
			this.raiseEvent("redraw");
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

			var targetSprite = new ent.Sprite({
				width: 50,
				height: 50,
				imgSrc: lang.modulePath('lib/entity', '../assets/enemy1.png')
			});
			targetSprite.load();
			
			for(var i=0; i<2; i++){
				entities.push( 
					new npc.Target({
						id: "target_"+i,
						bounds: bounds,
						x: Math.random() * (bounds.x - 50),
						y: Math.random() * (bounds.y - 50),
						sprite: targetSprite
					})
				);
			}
			
			var activeKeys = this.controls.keys;
			
			var you = Compose.create(npc.Target, {
				id: "player_thing",
				bounds: bounds,
				x: Math.random() * (bounds.x - 50),
				y: Math.random() * (bounds.y - 50),
				sprite: targetSprite, 
				update: after(function(){
					if(activeKeys.UPARROW){
						this.y -= 1;
						this.dirty("y");
					}
					if(activeKeys.DOWNARROW){
						this.y += 1;
						this.dirty("y");
					}
					if(activeKeys.LEFTARROW){
						this.x -= 1;
						this.dirty("x");
					}
					if(activeKeys.RIGHTARROW){
						this.x += 1;
						this.dirty("x");
					}
				})
			});
			
			entities.push(you);
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
		}
	});
});