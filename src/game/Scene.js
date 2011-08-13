define([
		'lib/lang',
		'lib/Compose',
		'lib/controls',
		'lib/Scene',
		'game/config'
	], function (lang, Compose, controls, Scene, config){
	
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

  
	var controls = new controls.Controls();
	var hdl = controls.addEventListener("/keys/down/ENTER", function(){
		console.info("ENTER was pressed");
	});
	
	return Compose(function(){
		this.config = config;
		this.entities = [];
		this.controls = controls;
		console.log("game/Scene ctor: " + this.id);
	}, Scene);
});