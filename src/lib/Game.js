define([
	'lib/rosewood', 
	'lib/my-class/my.class', 
	'lib/base',
	'lib/lang'
], function (rw, my, base, lang){

	var Game = my.Class(base.Game, {
		config: null,
		sprites: null,
		constructor: function(props) {
			Game.Super.call(this, props);
			this.sprites = {};
		},
		setup: function(){
			var sprites = this.sprites, 
				config = this.config, 
				modules = Array.prototype.slice.call(arguments);
			console.log("modules: ", modules);
			modules.forEach(function(mod){
				if(mod.sprites) {
					for(var i in mod.sprites) {
						sprites[i] = mod.sprites[i];
						console.log("setup sprite in module: " + i);
						// populate any templated paths with our config
						if(sprites[i][0].indexOf('${') > -1){
							sprites[i][0] = lang.templatize(sprites[i][0], config);
						}
					}
				}
			});
			
			console.log("setup sprites: ", sprites);
			this._setupMenu();
			this._setupMap();
			this._setupPlayer();
			
			rw.loadSprites(this.sprites, lang.bind(this, function() {
				engine = rw.init('map', {
					x:this.width,
					y:this.height,
					FPS:40,
					sequence:['ents','blit'],
					keys:['ua','da','la','ra']
				});
				this.onReady();
				console.log("rw init and newEnt called");
			}))

			
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
			console.log("enter start state");
		},
		tick: function() {
			//Offset all the pane:
			console.log("tick: ", newPos);
		}
	});
	return Game;
});
