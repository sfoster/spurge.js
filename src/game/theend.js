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
		console.log("ended scene ctor");
	},Scene, 
	{
		// update: notimpl("update"),
		// redraw: notimpl("redraw"),
		id: "ended",
		className: "scene scene-ended",
		render: after(function(){
			this.node.innerHTML = "<h2>The End</h2>";
		}),
		exit: from(Scene),
		load: from(Scene),
		unload: from(Scene),
	});
});