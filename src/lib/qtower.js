define(['lib/rosewood', "lib/lang", "lib/config", "lib/Game"], function (
		rw,  // Rosewood module
		lang, 
		config, 
		Game
	){
	// bootstrap for the qtower game
	// TODO: define concete Game instance here
	var qtower = {};
	
	qtower.bootstrap = function(config) {
		// Initialize the game:
		console.log("get new Game");

		// game logic is contained in the Game class
		var game = qtower.game = new Game({
			id: "qtower",
			stageNode: config.stageNode,
			height: config.stageNode.offsetHeight,
			width: config.stageNode.offsetWidth,
			config: config,
			keyTracker: true
		});
		console.log("/get new Game");
		qtower.start = qtower.game.start;
		
		game.setup();
		var assetsDir = game.config.assetsDir;

		var Enemy = function(name) {
			console.log("in Enemy ctor ", rw, rw.Ent);
			// nameIn, spriteIn, widthIn, heightIn
			this.base = new rw.Ent(name, 'e1', 50, 50);
			this.update = function(){
				if (rw.key('ua')) this.base.move(0,-2);
				if (rw.key('da')) this.base.move(0,2);
				if (rw.key('la')) this.base.move(-2,0);
				if (rw.key('ra')) this.base.move(2,0);
			}
		}
		// sequence
		// build map (at level x)
		// init player w. heath, points, credits etc.
		// build menu (available towers filtered by level and credits)
		// 2 scenes/screens: 
		// 	map: the actual map with towers etc.
		//	shop: the menu bit where you pick what towers to deploy

		//initialize the start button
		// $("#startbutton").click(function(){
		// 	console.log("on startbutton click");
		// })

		rw.loadSprites({
			'e1': [assetsDir + '/enemy1.png', 50, 50, 0, 0]
		}, function() {
			var game = rw.init('playground', {
				x:500,
				y:500,
				FPS:40,
				sequence:['ents','blit'],
				keys:['ua','da','la','ra']
			});
			var e1 = window.e1 = new Enemy("enemy1") ;
			game.newEnt( e1 )
				.base.display(234, 234, 234)
				.end()
			.start();
			console.log("rw init and newEnt called");
		})

	};
	
	console.log("returning qtower exports object");

	return qtower;
});
