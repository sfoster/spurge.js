define([
		'lib/lang',
		'lib/compose',
		'lib/Evented',
		'lib/state',
		'lib/Scene'
	], function (lang, Compose, Evented, Stateful){

	var engine; // need one

	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var Game = Compose(Compose, Evented, Stateful, function(args){
		console.log('lib/Game ctor');
		this.config = args.config || {};
	},{
		config: null,
		sprites: null,
		scenes: null,
		setup: function(callback){
			// console.log("setup sprites: ", sprites);
			var game = this;
			this.scenes.forEach(function(scene){
				console.log("registering " + scene.id + " on this: ", this.id);
				this.registerState(scene.id, scene);
				scene.game = game; 
				console.log("assigning config to scene " + scene.id, game.config);
				scene.config = game.config; 
			}, this);
			if(callback){
				setTimeout(callback, 1);
			}
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
				this.currentScene = this.scenes[0].id;
			}
			this.enterState(this.currentScene);
		},
		tick: function() {
			//Offset all the pane:
			console.log("tick: ", newPos);
		}
	});

	return Game;
});
