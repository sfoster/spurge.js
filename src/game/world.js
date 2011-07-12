define([
		'lib/lang',
		'lib/Compose',
		'game/Scene'
	], function (lang, Compose, Scene){
	console.log("welcome module");
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var requestAnimFrame = (function(){
		return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame     || 
			window.mozRequestAnimationFrame        || 
			window.oRequestAnimationFrame          || 
			window.msRequestAnimationFrame         || 
			function(/* function */ callback){
			  window.setTimeout(callback, 1000 / 60);
			};
	})();


	return Compose.create(function(){
		console.log("world scene ctor");
	},Scene, 
	{
		// update: notimpl("update"),
		// redraw: notimpl("redraw"),
		id: "world",
		className: "scene scene-world",

		run: (function(self){
			// experiment, with the scene as host of the main game loop
			// as we have some "scenes" that don't need a loop at all,
			var fps = 60;
			var loops = 0, skipTicks = 1000 / fps,
				maxFrameSkip = 10,
				nextGameTick = (new Date).getTime();
				
			console.log("building main loop, with this: ", this.id);
			return function() {
				loops = 0;

				while ((new Date).getTime() > nextGameTick) {
					console.log("frame, next tick: " + nextGameTick);
					this.update();
					nextGameTick += skipTicks;
					loops++;
				}

				this.redraw();
				// renderStats.update();
				// Game.draw();
			};

			// this.update();
			// this.redraw();
		})(),
		redraw: function(){
			this.node.innerHTML = "<h2>"+this.id +" Scene entered: " + (new Date()).getTime() + "</h2>";
		},
		update: function(){
			// update logic: 
			// process rules
			// call update on all entities, 
			var ents = this.entities || [];
			for(var i=0, len=ents.length; i<len; i++){
				ents[i].update();
			}
			console.log("Scene update");
		},
		enter: after(function(){
			console.log("Scene/state enter");
			
			// this._createActors();
			
			this.isRunning = true;
			// build the main loop
			
			var self = this;
			var onEachFrame = function(cb) {
				// only re-request anim frame if we're still running
				var _cb = function() { 
					if(self.isRunning){
						cb(); requestAnimFrame(_cb); 
					}
				};
				_cb();
			};
			this.onEachFrame = onEachFrame;
			this.onEachFrame(lang.bind(this, this.run));
		}),

		render: from(Scene),
		exit: before(function(){
			console.log("Scene exit, isRunning=false, clearing interval: ", this._intervalId);
			this.isRunning = false;
			this._intervalId && clearInterval(this._intervalId);
		}),
		load: from(Scene),
		unload: from(Scene),
	});
});