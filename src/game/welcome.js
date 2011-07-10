define([
		'lib/lang',
		'lib/Compose',
		'game/Scene'
	], function (lang, Compose, Scene){

	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	return Compose.create(function(){
		console.log("welcome ctor");
	},Scene, 
	{
		// update: notimpl("update"),
		// redraw: notimpl("redraw"),
		id: "welcome",
		className: "scene scene-welcome",
		render: from(Scene),
		exit: from(Scene),
		load: from(Scene),
		unload: from(Scene),
	});
});