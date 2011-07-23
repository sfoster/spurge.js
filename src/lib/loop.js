define([
		'lib/lang',
		'lib/Compose',
		'lib/stats'
	], function (lang, Compose, Stats){
	
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var exports = {
		monitorStats: true
	}

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

	if(exports.monitorStats){
		// var renderStats = exports.renderStats = new Stats();
		var updateStats = exports.updateStats = new Stats();
		// document.body.appendChild(renderStats.domElement);
		document.body.appendChild(updateStats.domElement);
		
	}

	var Loop = exports.Loop = Compose(Compose, function(){
		console.log("lib/Loop ctor");
	},
	{
		fps: 1000/60, // default frames/sec.

		startLoop: function(){
			console.log("lib/Loop startLoop");
			this.isRunning = true;
			// build the main loop
			this.runLoop = this.prepareLoop();
			
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
			// kick it off
			console.log("lib/Loop kick it off");
			onEachFrame(lang.bind(this, this.runLoop));
		},
		prepareLoop: function(){
			// experiment, with the scene as host of the main game loop
			// as we have some "scenes" that don't need a loop at all,
			var fps = 60;
			var loops = 0, skipTicks = 1000 / fps,
				maxFrameSkip = 10,
				nextGameTick = (new Date).getTime(), 
				frameCount = 0;
				
			return function() {
				loops = 0;
				var now = (new Date).getTime();
				while (now > nextGameTick) {
					// we'll update more than we'll draw..
					exports.updateStats && updateStats.update();
					this.update();
					nextGameTick += skipTicks;
					loops++;
				}
				
				// exports.renderStats && renderStats.update();
				this.redraw(++frameCount);
			};

			// this.update();
			// this.redraw();
		},

		stopLoop: function(){
			this.isRunning = false;
			this._intervalId && clearInterval(this._intervalId);
		}
	});
	
	return exports;
	
});