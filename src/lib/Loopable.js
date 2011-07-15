define([
		'lib/lang',
		'lib/Compose',
		'lib/stats'
	], function (lang, Compose, Stats){
	
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


	var monitorStats = true;
	if(monitorStats){
		var renderStats = new Stats();
		var updateStats = new Stats();
	}

	var Loopable = Compose(function(){
		console.log("lib/Loopable ctor: " + this.id);
	},
	{
		fps: 1000/60, // default frames/sec.

		startLoop: function(){
			console.log("Scene/state enter: ", this.node);

			if(monitorStats){
				document.body.appendChild(renderStats.domElement);
				document.body.appendChild(updateStats.domElement);
			}
			
			this.isRunning = true;
			// build the main loop
			
			this.startTime = (new Date()).getTime();
			
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
			this.onEachFrame(lang.bind(this, this.runLoop));
		},
		runLoop: (function(self){
			// experiment, with the scene as host of the main game loop
			// as we have some "scenes" that don't need a loop at all,
			var fps = 60;
			var loops = 0, skipTicks = 1000 / fps,
				maxFrameSkip = 10,
				nextGameTick = (new Date).getTime(), 
				frameCount = 0;
				
			console.log("building main loop, with this: ", this.id);
			return function() {
				loops = 0;
				var now = (new Date).getTime();
				while (now > nextGameTick) {
					// we'll update more than we'll draw..
					monitorStats && updateStats.update();
					this.update();
					nextGameTick += skipTicks;
					loops++;
				}
				
				monitorStats && renderStats.update();
				this.redraw(++frameCount);
			};

			// this.update();
			// this.redraw();
		})(),

		stopLoop: function(){
			this.isRunning = false;
			this._intervalId && clearInterval(this._intervalId);
		}
	});
	
	return Loopable;
});