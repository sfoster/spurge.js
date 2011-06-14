define(["lib/lang", "lib/anims", "lib/config", "lib/Game"], function (lang, anims, config, Game){
	// bootstrap for the qtower game
	var qtower = {};
	
	var PLAYGROUND_WIDTH = config.PLAYGROUND_WIDTH = 600, 
		PLAYGROUND_HEIGHT = config.PLAYGROUND_HEIGHT = 600,
		REFRESH_RATE = config.REFRESH_RATE = 30

	qtower.init = function() {
		// Initialize the game:
		console.log("get new Game");

		// game logic is contained in the Game class
		var game = new Game({
			id: "qtower",
			node: "#playground",
			height: PLAYGROUND_HEIGHT,
			width: PLAYGROUND_WIDTH,
			config: config,
			keyTracker: true
		});
		console.log("/get new Game");
		
		game.setup();

		// sequence
		// build map (at level x)
		// init player w. heath, points, credits etc.
		// build menu ()
		// presen
		// 2 scenes/screens: 
		// 	map: the actual map with towers etc.
		//	shop: the menu bit where you pick what towers to deploy
		
		console.log("game created: ", game, game.id);

		// this sets the id of the loading bar:
		$().setLoadBar("loadingBar", 400);

		//initialize the start button
		$("#startbutton").click(function(){
			console.log("$.gameQuery", $.gameQuery);
			$.playground().startGame(function(){
				game.start();
				$("#welcomeScreen").fadeTo(1000,0,function(){$(this).remove();});
			});
		})

		//Main loop (for the background animation etc.)
		$.playground().registerCallback(lang.bind(game, game.tick), REFRESH_RATE);
	};
	
	console.log("returning qtower exports object");
	return qtower;
});
