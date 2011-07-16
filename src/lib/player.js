define([
		'lib/lang',
		'lib/Compose',
		'lib/entity',
		'lib/state',
	], function (lang, Compose, ent, Stateful){

	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var exports = {};

	exports.Dude = Compose(function(args){

	}, ent.Actor);

	// // register sprites
	// sprites['tower'] = ['${assetsDir}/simpleTower.png', 50, 50];

	return {
		sprites: sprites,
		Dude: Dude
	};
});

