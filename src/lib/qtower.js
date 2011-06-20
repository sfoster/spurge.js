define([
		'lib/rosewood', "lib/lang", "lib/config", "lib/Game"
	], function (
		rw,  // Rosewood module
		lang, 
		config, 
		Game
	){
	// bootstrap for the qtower game
	// TODO: define concete Game instance here
	var qtower = {};
	window.rw = rw;
	
	qtower.bootstrap = function() {
		// Initialize the game:
		// game logic is contained in the Game class
		// 	stuff like setting up each round/level, menu population etc.
		var mixin = lang.mixin;

		config.set('keyTracker', true);
		config.set('id', 'qtower');
		
		console.log("bootstrap config: ", config.get());
		var game = qtower.game = new Game( { config: config.get() } );
		qtower.start = qtower.game.start;
		
		game.onReady = function() {
			console.log("onReady");
		}

		// sequence
		// build map (at level x)
		// init player w. heath, points, credits etc.
		// build menu (available towers filtered by level and credits)
		// 2 scenes/screens: 
		// 	map: the actual map with towers etc.
		//	shop: the menu bit where you pick what towers to deploy

		//initialize the start button
		qtower.start = function(){
			rw.start();
		}; 
		qtower.stop = function(){
			rw.stop();
		}; 
		$("#startBtn").click(qtower.start);
		$("#stopBtn").click(qtower.stop);

	};
	
	console.log("returning qtower exports object");

	return qtower;
});
