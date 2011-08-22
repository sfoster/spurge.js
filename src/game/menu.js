define([
		'lib/lang',
		'lib/Compose',
		'game/Scene'
	], function (lang, Compose, Scene){
	console.log("welcome module");
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	return Compose(function(){
		console.log("menu scene ctor");
	},Scene, 
	{
		// update: notimpl("update"),
		// redraw: notimpl("redraw"),
		id: "menu",
		className: "scene scene-menu",
		render: after(function(){
			this.node.innerHTML = '<h2>The Menu Scene</h2>'
		}),
		exit: from(Scene),
		load: from(Scene),
		unload: from(Scene),
	});
});