define([
		'lib/lang',
		'lib/Compose',
		'lib/Scene',
		'game/config'
	], function (lang, Compose, Scene, config){
	
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	return Compose(function(){
		console.log("game/Scene ctor: " + this.id);
		this.config = config;
		this.entities = [];
	}, Scene);
});