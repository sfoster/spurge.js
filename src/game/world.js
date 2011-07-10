define([
		'lib/lang',
		'lib/Compose',
		'game/Scene'
	], function (lang, Compose, Scene){
	console.log("welcome module");
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	return Compose.create(function(){
		console.log("world scene ctor");
	},Scene, 
	{
		// update: notimpl("update"),
		// redraw: notimpl("redraw"),
		id: "world",
		className: "scene scene-world",
		render: from(Scene),
		exit: from(Scene),
		load: from(Scene),
		unload: from(Scene),
	});
});