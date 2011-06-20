define([
	'lib/rosewood', 
	'lib/my-class/my.class', 
	'lib/base',
	'lib/lang',
	'lib/npc', 
	'lib/player'
], function (rw, my, base, lang, npc, player){
	var engine;
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
				modules = [npc, player];
			console.log("game (this): ", this);
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
				engine = this.engine = rw.init('map', {
					x:this.config.width,
					y:this.config.height,
					FPS:40,
					sequence:['ents','blit'],
					keys:['ua','da','la','ra']
				});
				this.postLoad();
				console.log("rw init and newEnt called");
			}));
		},
		postLoad: function() {
			function TestRule(){
				this.rule = function() { 
					console.log("TestRule.rule");
				}
			}

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

			rw.newRule('testRule', new TestRule())
			// .newEnt({
			// 	base: new rw.Ent('bg','bg',480,480),
			// 	update: function() {}
			// }).base.display(0,0,-16).end()
			// .newEnt(new hero('hero'))
			// 	.base.display(240,240,240).end()
			// .newEnt({
			// 	base: new rw.Ent('text', 'text', 100, 100),
			// 	update: function() {
			// 		var txt = ' Lag: '+Math.round(rw.getLag())+'  ';
			// 		txt += 'Score: '+eyesDead+' ';
			// 		txt += 'High Score: '+highScore+' ';
			// 		if (fatima) txt += ' Fatima! ';
			// 		if (blind) txt += ' Blind Eye ';
			// 		if (slow) txt += ' Slow ';
			// 		if (badLuck) txt += ' Bad Luck';
			// 		this.text.text = txt;
			// 	},
			// 	text: {
			// 		text: 'Score: ',
			// 		form: 'fill',
			// 		style: {
			// 			font: '16px sans-serif',
			// 			fill: '#000'
			// 		}
			// 	}
			// }).base.display(0,16,0).end()
			// .start().saveState('init');
			// 
			this.onReady();
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
