define([
	'lib/rosewood',
	'lib/lang'
], function (
	rw,	// Rosewood module
	lang	// lang utilities
){
	
	var endGame = true;
	var gameMode = "round"; // menu|play|something
	var counter = 0;
	var RuleThing = function(){
		this.base = new rw.Rule(1);
		this.rule = function(){
			switch(gameMode) {
				case "menu":
					displayMenu();
					break;
				case "round":
					// plan moves
					// prepare entity states for next update
					break;
			}
			// counter
		};
	};
	var Missile = function() {
		this.base = new rw.Ent('fireball', 'fireball.f0', 32, 32);
		this.frameidx = 0;
		var lastIdx = 0;
		this.update = function(X1, Y1, X2, Y2) {
			if("round" != gameMode) {
				return;
			}
			var idx = this.frameidx;
			if(idx >= 15) {
				idx = 0;
			} else {
				idx += 1/2;
			}
			this.frameidx = idx;
			this.base.changeSprite('fireball.f'+Math.floor(idx));
		}
	}

	var GameReset = function() {
		this.base = new rw.Rule(2);
		this.rule = function() {
			if (endGame) {
				endGame = false;
				heroX = 0;
				heroY = 0;
				heroXTile = 0;
				heroYTile = 0;
				rw.wipeAll().stop(function(){
					rw.loadState('init').start()
				});
			}
		}
	};
	
	var menuNode = null, 
		menuIsDisplayed = false;
	var displayMenu = function() {
		if(menuIsDisplayed) {
			return;
		} else {
			console.log("displaying menu");
			if(!menuNode) {
				menuNode = document.getElementById("menu");
			}
			menuNode.style.display = "block";
			menuIsDisplayed = true;
		}
	}
	var hideMenu = function(){
		menuNode && (menuNode.style.display = "none");
		menuIsDisplayed = false;
	}
	var initGame = function(callback) {
		callback = callback || function(){};
		rw.loadSprites({
			bg: ['../../Rosewood/examples/evileye/sprites/bg.png', 480, 480],
			fireball: {
				src: './assets/explode1.png',
				f0:  [32, 32, 0,   0],
				f1:  [32, 32, 32,  0],
				f2:  [32, 32, 64,  0],
				f3:  [32, 32, 96,  0],
				f4:  [32, 32, 128, 0],
				f5:  [32, 32, 160, 0],
				f6:  [32, 32, 192, 0],
				f7:  [32, 32, 224, 0],
				f8:  [32, 32, 256, 0],
				f9:  [32, 32, 288, 0],
				f10: [32, 32, 320, 0],
				f11: [32, 32, 352, 0],
				f12: [32, 32, 284, 0],
				f13: [32, 32, 416, 0],
				f14: [32, 32, 448, 0],
				f15: [32, 32, 480, 0],
			},
			slow: ['../../Rosewood/examples/evileye/sprites/slow.gif', 30, 30]
		}, function() {
			rw.init('playarea', {
				x:480, 
				y:480,
				FPS:30,
				mouse:false,
				keys:['ua','da','la','ra'],
				sequence:['rule','ents','cols','kill','rule','blit','rule']
			})
			.tilesOn(30,30)
			.setFPS(30)
			.newRule('myRule', new RuleThing("something"))
			.newRule('endGame', new GameReset())
			.newEnt({
				base: new rw.Ent('bg','bg',480,480),
				update: function() {}
			}).base.display(0,0,-16).end()
			.newEnt(new Missile('missile'))
				.base.display(240,240,240).end()
			.newEnt({
				base: new rw.Ent('text', 'text', 100, 100),
				update: function() {
					var str = lang.templatize('Frame Count: ${count}', { count: counter});
					this.text.text = str;
				},
				text: {
					text: 'Frame Count: ',
					form: 'fill',
					style: {
						font: '16px sans-serif',
						fill: '#000'
					}
				}
			}).base.display(0,16,0).end();
			
			
			// .newEnt(new hero('hero'))
			// 	.base.display(240,240,240).end();
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
			// }).base.display(0,16,0).end();
			
			callback();
			// .start().saveState('init');
		});
	}
	return {
		initGame: initGame,
		setMode: function(mode) {
			gameMode = mode;
			if(mode !== "menu") {
				hideMenu();
			}
		},
		start: function() {
			rw.start().saveState('init');
		}, 
		pause: function(){
			rw.stop();
		}
	};
});
