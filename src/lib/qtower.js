define([
		'lib/rosewood', "lib/lang", "lib/config", "lib/Game",
		'lib/npc', 'lib/player'
	], function (
		rw,  // Rosewood module
		lang, 
		config, 
		Game,
		npc,
		player
	){
	// bootstrap for the qtower game
	// TODO: define concete Game instance here
	var qtower = {};
	
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
			// move this setup to the Game
			var e1 = window.e1 = new npc.Enemy("enemy1");
			rw.newEnt( e1 )
				.base.display(234, 0, 234)
				.end();

			var t1 = window.t1 = new player.Tower("tower1");
			rw.newEnt( t1 )
				.base.display(234, 234, 234)
				.end();
			console.log("/onReady");
		}
		game.setup(
			npc, player
			// line up all the pieces
		);

		// sequence
		// build map (at level x)
		// init player w. heath, points, credits etc.
		// build menu (available towers filtered by level and credits)
		// 2 scenes/screens: 
		// 	map: the actual map with towers etc.
		//	shop: the menu bit where you pick what towers to deploy

		//initialize the start button
		var engine;
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
