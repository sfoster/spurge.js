define([
		'lib/lang',
		'lib/compose',
		'lib/event',
		'lib/state',
		'lib/Scene'
	], function (lang, Compose, Evented, State, Scene){

	var engine; // need one

	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;


	return Compose(Compose, Evented, State, {
		config: null,
		sprites: null,
		setup: function(callback){
			// console.log("setup sprites: ", sprites);
			
			this.registerState("welcome", new Scene({
				id: "welcomeScene",
				load: function(){
					console.log("Welcome Scene loading");
				}
			}));

			this.registerState("menu", new Scene({
				id: "menuScene",
				load: function(){
					console.log("Menu Scene loading");
				}
			}));

			this.registerState("playing", new Scene({
				id: "playingScene",
				load: function(){
					console.log("Play Scene loading");
				}
			}));

			this.registerState("ended", new Scene({
				id: "endedScene",
				load: function(){
					console.log("Endes Scene loading");
				}
			}));

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
			this.enterState(this.currentScene);
		},
		tick: function() {
			//Offset all the pane:
			console.log("tick: ", newPos);
		}
	});
});
