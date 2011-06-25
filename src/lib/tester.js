define([
	'lib/rosewood',
	'lib/lang'
], function (
	rw,	// Rosewood module
	lang	// lang utilities
){
	/* 
		loop start/stop
			running state
				exit state stops run loop
			pause state
				exit state starts run loop
		start screen: welcome, instructions etc. 
		menu screen: pick tower, show credits
			click to pick up, click to put down
		round
			setup: create the requested towers if not done already
			plan the opponent attack/defense
			create opponent towers, troops
			go
				no further user interaction
				attack/defense is autonomous
		main loop
			set flags to trigger state change?
			or cause immediate state change
	*/

	var endGame = true;
	var gameMode = "round"; // menu|play|something
	var modeRequest = "";
	var counter = 0;
	var modeMgr = (function(){
		// large-grained state changes
		var mgr = new function(){
			this.current = null;
			this.registry = {};
			this.base = new rw.Rule(1);
			this.setMode = function(mode){
				this.current && this.current.exit();
				mode = (typeof mode == "string") ? this.registry[mode] : mode;
				if(!mode) {
					throw new Error("Cant switch to unregistered game mode: ", mode);
				}
				this.current = mode; 
				mode.enter();
			};
			this.register = function(mode, priority) {
				console.log("register mode: ", mode);
				this.registry[mode.name] = mode;
				if(priority) {
					modeRequest = mode.name;
				}
				return this;
			},
			this.rule = function(){
				var name = modeRequest; 
				modeRequest = "";
				switch(name) {
					case "menu":
						this.setMode("menu");
						break;
					case "round":
					case "running":
						this.setMode("running");
						// prepare entity states for next update
						break;
				}
			};
		};
		return mgr;
	})();
	console.log("returning mgr: ", modeMgr);
	
	modeMgr
		.register({
			name: "running",
			enter: function(){
				console.log("enter running mode");
				rw.start();
			},
			exit: function(){
				console.log("exit running mode");
				rw.stop();
			}
		})
		.register({
			name: "pause",
			enter: function(){
				console.log("enter pause mode");
				rw.stop();
			},
			exit: function(){
				console.log("exit pause mode");
			}
		}, true)
		.register({
			name: "menu",
			enter: function(){
				console.log("enter menu mode");
				rw.stop();
			},
			exit: function(){
				console.log("exit menu mode");
			}
		});

	var Missile = function() {
		this.base = new rw.Ent('fireball', 'fireball.f0', 32, 32);
		this.frameidx = 0;
		var lastIdx = 0;
		this.update = function(X1, Y1, X2, Y2) {
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
		var imgdir = lang.modulePath("lib/rosewood", "../assets");
		
		rw.loadSprites({
			fireball: {
				src: imgdir+'/explode1.png',
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
			}
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
			.newRule('myRule', modeMgr)
			// .newRule('endGame', new GameReset())
			// .newEnt({
			// 	base: new rw.Ent('bg','bg',480,480),
			// 	update: function() {}
			// }).base.display(0,0,-16).end()
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
			callback();
		});
	}
	return {
		initGame: initGame,
		setMode: function(mode) {
			modeRequest = mode;
		},
		start: function() {
			rw.start().saveState('init');
		}, 
		pause: function(){
			rw.stop();
		}
	};
});
