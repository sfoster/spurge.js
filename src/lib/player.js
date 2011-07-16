define([
		'lib/lang',
		'lib/Compose',
		'lib/Actor',
		'lib/state',
	], function (lang, Compose, Actor, Stateful){

	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var exports = {};
	console.log("defining TestThing");
	exports.Dude = Compose(function(args){

	});
	// register sprites
	sprites['tower'] = ['${assetsDir}/simpleTower.png', 50, 50];

	return {
		sprites: sprites,
		Dude: Dude
	};
});

