define(['lib/rosewood', "lib/lang", "lib/config"], function (
		rw,  // Rosewood module
		lang, 
		config
	){
		console.log("npc module");
	// define main enemy entities
	var sprites = {}, 
		assetsDir = lang.modulePath("lib/rosewood", "../assets");

	var Npc = function(id, args) {
		// generic init
		this.id = id;
		lang.mixin(this, args || {});
		this.base = new rw.Ent(id, this.spriteId, this.width, this.height);
	};
	lang.mixin(Npc.prototype, {
		hitType: "npc",
		frameCount: 0,
		_npc: true,
		updateMethods: [],
		width: 0,
		height: 0,
		init: function(){
			this.startTime = (new Date()).getTime();
		},
		update: function(x1, y1, x2, y2){
			// console.log("Npc update, looping over methods: ", this.updateMethods);
			this.frameCount++; 
			// loop over all registered update methods
			this.updateMethods.forEach(function(name){
				this[name].call(this, x1, y1, x2, y2);
			}, this);
		}
	});

	var Enemy = function(id, args) {
		Enemy.superclass.constructor.apply(this, arguments);
	};
	lang.extend(Enemy, Npc);

	lang.mixin(Enemy.prototype, {
		spriteId: 'enemy',
		hitType: "npc",
		width: 50,
		height: 50,
		shootInterval: 2000, // shoot every 2s
		speed: 1,
		missilesShot: 0,
		updateMethods: Npc.prototype.updateMethods.concat(["seekTarget"]),
		init: function(){
			Enemy.superclass.init.apply(this);
			this.lastShotTime = this.startTime = (new Date()).getTime();
		},
		seekTarget: function(x1, y1, x2, y2){
			// target seeking behavior
			// move *very slowly*
			if(this.frameCount % 10) {
				return;
			}
			var now = (new Date()).getTime(); // frame based rather than time?
			var speed = this.speed;
			var target = this.target || game.getTarget();
			// calculate center point
			var cX = x1 + ((x2 -x1) * 0.5), 
				cY = y1 + ((y2 -y1) * 0.5);
			var tX = Math.round(target.x), tY = Math.round(target.y);
			
			// calculate x/y move offsets
			var deltaX = Math.abs(Math.abs(tX) - Math.abs(cX)), 
				deltaY = Math.abs(Math.abs(tY) - Math.abs(cY));
				
			var moveX = tX > cX ? Math.min(2, tX - cX) * speed : Math.min(2, cX - tX) * -1 * speed, 
				moveY = tY > cY ? Math.min(2, tY - cY) * speed : Math.min(2, cY - tY) * -1 * speed;

			// console.log("moving to: ", moveX, moveY);
			// console.log("time to next shot: ", this.lastShotTime + this.shootInterval -now);
			if(
				(now - this.lastShotTime > this.shootInterval)
			) {
				// shooting distance
				this.lastShotTime = now;
				console.log("Deltas: ", deltaY, deltaX);
				if(deltaY + deltaX > 10) {
					this.shoot({ x: cX, y: cY}, { x: tX, y: tY });
					this.shootInterval += 1000;
				}
			}
			this.base.move(moveX,moveY);
		},
		shoot: function(source, target){
			// make a missile entity
			// provide it with target coords
			// leave it run itself
			console.log("shooting at: ", JSON.stringify(source), JSON.stringify(target));
			var missile = new Missile(
				'missile'+(this.missilesShot++), 
				{ target: target }
			);
			
			// TODO: as missiles are destroyed they aren't spliced out of this array yet
			rw.newEnt(missile).base.display(source.x,source.y,source.z || 100).end();
		}
	});

	// register sprites
	sprites['enemy'] = [assetsDir+"/enemy1.png", 50, 50];

	var Missile = function(id, args) {
		Missile.superclass.constructor.apply(this, arguments);
		
		console.log("Creating missile: ", id);
		this.target = args.target || { x:0, y: 0 };

		var lastIdx = 0, 
			boundsX = config.get("mapWidth"), 
			boundsY = config.get("mapHeight"); 
	};
	lang.extend(Missile, Npc);
	lang.mixin(Missile.prototype, {
		frameidx: 0,
		speed: 2,
		width: 16,
		height: 16,
		hitType: "missile",
		spriteId: 'fireball.f0',
		updateMethods: Npc.prototype.updateMethods.concat(["seekTarget"]),
		
		seekTarget: function(x1, y1, x2, y2) {
			var target = this.target, 
				speed = this.speed, 
				boundsX = config.get("boundsX"), 
				boundsY = config.get("boundsY");
			
			// remove if it goes off the map, or if its arrives at the target without a collision
			if ((x1<0)||(x2>boundsX)||(y1<0)||(y2>boundsY)) {
				this.inactive = true;
				return false;
			}
			if (Math.abs(x1 - target.x) <= 2 && Math.abs(y1 - target.y) <= 2) {
				// console.log(this.id + ": target met: ", Math.abs(x1 - target.x), Math.abs(y1 - target.y));
				this.inactive = true;
				return false;
			}

			var idx = this.frameidx;
			if(idx >= 9) {
				idx = 0;
			} else {
				idx += 1;
			}
			// console.log("missile update: ", x1, y1, x2, y2);
			this.frameidx = idx;
			this.base.changeSprite('fireball.f'+Math.floor(idx));
			// console.log(this.id +" sprite changed");
			
			// calculate center point
			var cX = x1 + ((x2 -x1) * 0.5), 
				cY = y1 + ((y2 -y1) * 0.5);
			var tX = target.x, tY = target.y;
			
			// calculate x/y move offsets
			var deltaX = Math.abs(Math.abs(tX) - Math.abs(cX)), 
				deltaY = Math.abs(Math.abs(tY) - Math.abs(cY));
				
			var moveX = tX > cX ? Math.min(2, tX - cX) * speed : Math.min(2, cX - tX) * -1 * speed, 
				moveY = tY > cY ? Math.min(2, tY - cY) * speed : Math.min(2, cY - tY) * -1 * speed;

			// console.log("move "+ this.id + " to: ", moveX,moveY);
			this.base.move(moveX,moveY);
		},
		hitMap: [ // shared on the prototype: plz read-only
			['missile', // hit type. Will match with entries in the 2nd array of other entities
				[	// kinds of things it can collide with. 
					// these string will be matched against the first (0th) entry in hitMap
					'rWall',
					'lWall',
					'tWall',
					'bWall',
					'tri'
				],
				// 4 points: rectangle hit map
				// 3 points: rectangle hit map
				20,20,20 // coo
			]
		],
		gotHit: function(by) {
			if (this.hit==false) {
				switch (by) {
					case 'rWall':
						this.dirX = 'l'
						break
					case 'lWall':
						this.dirX = 'r';
						break
					case 'tWall':
						this.dirY = 'd'
						break
					case 'bWall':
						this.dirY = 'u'
						break
					case 'ball':
						(this.dirX=='r') ? this.dirX='l' : this.dirX='r'
						;(this.dirY=='u') ? this.dirY='d' : this.dirY='u'
						this.base.wipeMove()
						this.spdMod = 10*Math.random()
						break
				}
				this.hit=true
			}
		}
	});

	// register sprites
	sprites['explosion'] = {
		src: assetsDir+'/explode1.png',
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
	};
	sprites['fireball'] = {
		src: assetsDir+'/fireballz.gif',
		f0:  [16, 16, 0,   33],
		f1:  [16, 16, 16,  33],
		f2:  [16, 16, 32,  33],
		f3:  [16, 16, 48,  33],
		f4:  [16, 16, 64, 33],
		f5:  [16, 16, 80, 33],
		f6:  [16, 16, 96, 33],
		f7:  [16, 16, 112, 33],
		f8:  [16, 16, 128, 33],
		f9:  [16, 16, 144, 33]
	};


	// bg: ['sprites/bg.png', 480, 480],
	// hero: {
	// 	src: 'sprites/hero.png',
	// 	d1: [30, 30, 0, 0],
	// 	d2: [30, 30, 0, 30],
	// 	u1: [30, 30, 30, 0],
	// 	u2: [30, 30, 30, 30],
	// 	l1: [30, 30, 60, 0],
	// 	l2: [30, 30, 60, 30],
	// 	r1: [30, 30, 90, 0],
	// 	r2: [30, 30, 90, 30]
	// },

	return {
		sprites: sprites,
		Enemy: Enemy,
		Missile: Missile
	};
});

