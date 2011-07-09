define([
		'lib/lang',
		'lib/compose',
		'lib/Game',
		'game/config',
		'game/welcome',
		'game/menu',
		'game/world',
		'game/theend'
	], function (lang, Compose, Game, config, welcomeScene, menuScene, worldScene, endedScene){

	var engine; // need one

	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;


	return Compose.create(Game, {
		config: config,
		sprites: null,
		setup: function(callback){
			// console.log("setup sprites: ", sprites);
			var game = this;
			// install some local refs to game and config object
			[welcomeScene, menuScene, worldScene, endedScene].forEach(function(scene){
				scene.game = game; 
				scene.config = config; 
			})
			welcomeScene.game = this;
			this.registerState("welcome", welcomeScene);
			
			this.registerState("menu", menuScene);
			
			this.registerState("playing", worldScene);

			this.registerState("ended", endedScene);

			callback && callback();
			// move to play scene
			// this._setupMap();
			// this._setupPlayer();
			
			// rw.loadSprites(this.sprites, lang.bind(this, function() {
			// 	engine = this.engine = rw.init('map', {
			// 		x:this.config.width,
			// 		y:this.config.height,
			// 		FPS:40,
			// 		sequence:['ents','blit'],
			// 		keys:['ua','da','la','ra']
			// 	});
			// 	this.postLoad();
			// 	console.log("rw init and newEnt called");
			// }));
		},
		postLoad: function() {
			this.onReady && this.onReady();
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
			var shopNode = $("#shopMenu"); 
			var tmpl = '<div class="content">${content}</div>', 
				div = $(lang.templatize(tmpl, { content: '<h3>Menu goes here</h3>'}));
			shopNode.append(div);
			console.log("TODO: setupMenu");
		}, 
		start: function() {
			if(!this.currentScene){
				this.currentScene = 'welcome';
			}
			console.log("entering scene: ", this.currentScene);
			this.enterState(this.currentScene);
		},
		tick: function() {
			//Offset all the pane:
			console.log("tick: ", newPos);
		}
	});
});
