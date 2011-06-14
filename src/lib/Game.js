define([
	'lib/my-class/my.class', 
	'lib/base',
	'lib/anims'
], function (my, base, anims){
	var PLAYGROUND_WIDTH	= 700;
	var PLAYGROUND_HEIGHT	= 250;
	var REFRESH_RATE		= 15;

	var GRACE		= 2000;
	var MISSILE_SPEED = 10; //px per frame

	/*Constants for the gameplay*/
	var smallStarSpeed    	= 1; //pixels per frame
	var mediumStarSpeed		= 3; //pixels per frame
	var bigStarSpeed		= 4; //pixels per frame

	// Gloabl animation holder
	var playerAnimation = new Array();
	var missile = new Array();
	var enemies = new Array(3); // There are three kind of enemies in the game

	// Game state
	var bossMode = false;
	var bossName = null;
	var playerHit = false;
	var timeOfRespawn = 0;
	var gameOver = false;
	
	var Game = my.Class(base.Game, {
		config: null,
		constructor: function(props) {
			Game.Super.call(this, props);
		},
		setup: function(){
			this._setupMenu();
			this._setupMap();
			this._setupPlayer();
		},
		_setupMap: function(){
			// need a node/context to render to
			// need dimensions
			// need a set of sprites
			// need map data
		},
		_setupPlayer: function(){
			this.player = {
				health: 100,
				credits: 100
			};
			// render via aop?
		},
		_setupMenu: function(){
			// need a node/context to render to
			// need a filtered list of towers to place
			// need avail. credits
			// need map data
			this.player = {
				health: 100,
				credits: 100
			};
			// render via aop?
			var dims = {
				width: this.PLAYGROUND_WIDTH, 
				height: this.PLAYGROUND_HEIGHT
			};
			console.log("_setUpMenu: ", $.playground());
			$.playground()
				.addGroup("background", dims)
				.addSprite("background1", Object.create(dims, {animation: anims.background1}))
				.addSprite("background2", Object.create(dims, {animation: anims.background2}))
				.addSprite("background3", Object.create(dims, {animation: anims.background3}))
				.addSprite("background4", Object.create(dims, {animation: anims.background4}))
				.addSprite("background5", Object.create(dims, {animation: anims.background5}))
				.addSprite("background6", Object.create(dims, {animation: anims.background6}))
			;
		}, 
		start: function() {
			console.log("enter start state");
		},
		tick: function() {
			//Offset all the pane:
			var newPos = (parseInt($("#background1").css("left"), 10) - smallStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
			console.log("tick: ", newPos);
			// $("#background1").css("left", newPos);
			// 
			// newPos = (parseInt($("#background2").css("left"), 10) - smallStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
			// $("#background2").css("left", newPos);
			// 
			// newPos = (parseInt($("#background3").css("left"), 10) - mediumStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
			// $("#background3").css("left", newPos);
			// 
			// newPos = (parseInt($("#background4").css("left"), 10) - mediumStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
			// $("#background4").css("left", newPos);
			// 
			// newPos = (parseInt($("#background5").css("left"), 10) - bigStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
			// $("#background5").css("left", newPos);
			// 
			// newPos = (parseInt($("#background6").css("left"), 10) - bigStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
			// $("#background6").css("left", newPos);
		}
	});
	return Game;
});
