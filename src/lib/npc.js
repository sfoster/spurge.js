define(['lib/rosewood', "lib/lang", "lib/config"], function (
		rw,  // Rosewood module
		lang, 
		config
	){
		console.log("npc module");
	// define main enemy entities
	var sprites = {}, 
		assetsDir = config.get("assetsDir");
	
	var Enemy = function(id) {
		// nameIn, spriteIn, widthIn, heightIn
		this.base = new rw.Ent(id, 'enemy', 50, 50);
		this.update = function(){
		}
	}
	// register sprites
	sprites['enemy'] = ['${assetsDir}/enemy1.png', 50, 50];

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
		Enemy: Enemy
	};
});

