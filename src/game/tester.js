define([
		'lib/lang',
		'lib/compose',
		'lib/Game',
		'game/config',
		'game/welcome',
		'game/menu',
		'game/testPlayer',
		'game/testThings',
		'game/theend'
	], function (
		lang, Compose, Game, config, 
		welcomeScene, menuScene, playerScene, worldScene, endedScene){

	var engine; // TODO: create one

	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	console.log("creating Game instance with config: ", config)
	
	return new Game({
		id: "theGame",
		config: config,
		sprites: null,
		setup: before(function(callback){
			// console.log("setup sprites: ", sprites);
			var game = this;
			console.log("app config: ", this.config);
			this.scenes = [
				welcomeScene, menuScene, playerScene, worldScene, endedScene
			]
		}),
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
