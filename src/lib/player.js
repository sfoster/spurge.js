define(['lib/rosewood', "lib/lang", "lib/config"], function (
		rw,  // Rosewood module
		lang, 
		config
	){

	var sprites = {}, 
		assetsDir = config.get("assetsDir");

	// define main player/good-guy entities
	var Tower = function(id) {
		this.base = new rw.Ent(id, 'tower', 50, 50);
		this.update = function(){
			// need to pass movement through the game object
			// to check collisions, rules?
			if (rw.key('ua')) this.base.move(0,-2);
			if (rw.key('da')) this.base.move(0,2);
			if (rw.key('la')) this.base.move(-2,0);
			if (rw.key('ra')) this.base.move(2,0);
		}
	}
	// register sprites
	sprites['tower'] = ['${assetsDir}/simpleTower.png', 50, 50];

	return {
		sprites: sprites,
		Tower: Tower
	};
});

