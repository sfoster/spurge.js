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
		// redraw: notimpl("redraw"),
		id: "welcome",
		className: "scene scene-welcome",
		render: after(function(){
			this.node.innerHTML = '<h2>The Welcome Scene</h2>';
		}),
		load: from(Scene),
		unload: from(Scene),
	});
});