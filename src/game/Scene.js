define([
		'lib/lang',
		'lib/Compose',
		'lib/controls',
		'lib/entity',
		'lib/collision',
		'lib/Scene',
		'game/config'
	], function (lang, Compose, controls, entity, collision, Scene, config){
	
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

  
	var controls = new controls.Controls();
	var hdl = controls.addEventListener("/keys/down/ENTER", function(){
		console.info("ENTER was pressed");
	});
	
	return Compose(Scene, collision.Manager, entity.Manager, {
		initCollisions: from(collision.Manager, "init"),
		init: from(Scene),
		// init: after(function(){
		// 	console.log("in game/Scene ctor, config got assigned? ", this.config);
		// 	this.controls = controls;
		// 	console.log("game/Scene ctor: " + this.id);
		// }),
		registerCollisionGroup: from(collision.Manager, "registerGroup"),
		getCollisionGroup: from(collision.Manager, "getGroup"), 
		registerCollisionMember: from(collision.Manager, "registerMember")
	});
	// , collision.Manager
});