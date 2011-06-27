define([
	'lib/rosewood',
	'lib/lang',
	'lib/npc'
], function (
	rw,	// Rosewood module
	lang,	// lang utilities
	npc	// npc entitites
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
				console.log("setMode: ", mode);
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
	var sprites = {};
	
	modeMgr
		.register({
			name: "running",
			enter: function(){
				rw.loadState("running");
				console.log("enter running mode");
				console.log("remove all ents from the run loop")
				//rw.start();
			},
			exit: function(){
				console.log("exit running mode");
				console.log("restore all ents from the run loop")
				//rw.stop();
			}
		}, 1)
		.register({
			name: "pause",
			enter: function(){
				rw.saveState("running");
				console.log("enter pause mode");
				rw.loadState("paused");
			},
			exit: function(){
				console.log("exit pause mode");
			}
		}, true)
		.register({
			// ...
			enter: function(){
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
		})
		.register({
			name: "menu",
			enter: function(){
				console.log("enter menu mode");
				//rw.stop();
			},
			exit: function(){
				console.log("exit menu mode");
			}
		});

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
	var settings = {
		x:480, 
		y:480,
		FPS:30,
		mouse:true,
		keys:['ua','da','la','ra'],
		sequence:['rule','ents','cols','kill','rule','blit','rule']
	};
	
	var initGame = function(callback) {
		callback = callback || function(){};
		var imgdir = lang.modulePath("lib/rosewood", "../assets");

		var modules = [npc];
		console.log("game (this): ", this);
		modules.forEach(function(mod){
			if(mod.sprites) {
				lang.mixin(sprites, mod.sprites);
			}
		});
		
		rw.loadSprites(sprites, function() {
			
			rw.init('playarea', settings)
			.tilesOn(30,30)
			.setFPS(30)
			.newRule('myRule', modeMgr)
			// .newRule('endGame', new GameReset())
			// .newEnt({
			// 	base: new rw.Ent('bg','bg',480,480),
			// 	update: function() {}
			// }).base.display(0,0,-16).end()
			.newEnt(new npc.Missile('missile', gameExports))
				.base.display(240,240,240).end()
			.newEnt(new npc.Enemy('enemy1', gameExports))
				.base.display(40,40,240).end()
			.newEnt({
				base: new rw.Ent('text', 'text', 100, 100),
				update: function() {
					var str = lang.templatize('Frame Count: ${count}', { count: +(new Date)});
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
	var gameExports = {
		initGame: initGame,
		getTarget: function(){
			var t = {};
			t.x = (typeof rw.mouse.x == "function") ? rw.mouse.x() : Math.round(settings.x/2); 
			t.y = (typeof rw.mouse.y == "function") ? rw.mouse.y() : Math.round(settings.y/2); 
			console.log("returning target: x: %s, y: %s", t.x, t.y);
			return t;
			// return { x: 100, y: 100 };
		},
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
	return gameExports;
});
