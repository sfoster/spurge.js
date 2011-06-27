define(['lib/rosewood', "lib/lang", "lib/config"], function (
		rw,  // Rosewood module
		lang, 
		config
	){
		console.log("npc module");
	// define main enemy entities
	var sprites = {}, 
		assetsDir = lang.modulePath("lib/rosewood", "../assets");
	
	var Enemy = function(id, game) {
		// nameIn, spriteIn, widthIn, heightIn
		this.base = new rw.Ent(id, 'enemy', 50, 50);
		this.update = function(x1, y1, x2, y2){
			var target = game.getTarget();
			// calculate center point
			var cX = x1 + ((x2 -x1) * 0.5), 
				cY = y1 + ((y2 -y1) * 0.5);
			var tX = target.x, tY = target.y;
			// calculate x/y move offsets
			var moveX = tX > cX ? Math.min(2, tX - cX) * 1 : Math.min(2, cX - tX) * -1, 
				moveY = tY > cY ? Math.min(2, tY - cY) * 1 : Math.min(2, cY - tY) * -1;

			console.log("moving to: ", moveX, moveY);
			this.base.move(moveX,moveY);
		}
	}
	// register sprites
	sprites['enemy'] = [assetsDir+"/enemy1.png", 50, 50];

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
		}, 
		this.target = { x:0, y: 0 }
	}
	// register sprites
	sprites['fireball'] = {
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

