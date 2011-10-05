define([
		'lib/lang',
		'lib/Compose',
		'lib/stats'
	], function (lang, Compose, Stats){
	
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var exports = {
		monitorStats: false
	}

	var requestAnimFrame = exports.requestAnimFrame = (function(){
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
		maxStep: 0.05,
		
		// loop/timer component
		// startLoop, stopLoop
		//  will fire onTick each tick, and pass in the time elapsed

		// loopage is via repeated calls to requestAnimationFrame
		
		tick: function(){
			var wallCurrent = Date.now();
			var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
			this.wallLastTimestamp = wallCurrent;
			
			var gameDelta = Math.min(wallDelta, this.maxStep);
			this.gameTime += gameDelta;
			return gameDelta;
		},
		startLoop: function(){
			console.log("lib/Loop startLoop");
			this.isRunning = true;

			this.gameTime = 0;
			this.startTime = +new Date;
			this.wallLastTimestamp = 0;

			this.lastUpdateTimestamp = Date.now();

			console.log("lib/Loop kick it off");
			// build the main loop and kick it off
			this.prepareLoop()();
		},
		prepareLoop: function(){
			var gameLoop = lang.bind(this, function(){
				if(this.isRunning){
					this.onTick( this.tick() );
					requestAnimFrame(gameLoop);
				}
			});
			return gameLoop;
		},
		onTick: function(elapsed){
			// stub
			// 	this.update(elapsed);
			// 	this.redraw();
		},

		stopLoop: function(){
			this.isRunning = false;
			this._intervalId && clearInterval(this._intervalId);
		}
	});
	
	return exports;
	
});