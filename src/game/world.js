define([
		'lib/lang',
		'lib/Compose',
		'lib/Scene'
	], function (lang, Compose, Scene){
	
	return Compose.create(function(){
		console.log("the World scene ctor");
	}, Scene, 
	{
		// update: notimpl("update"),
		// redraw: notimpl("redraw"),
		enter: function(){
			console.log("World Scene entered");
			var node = this.config.get("gameNode"); 
			node.appendChild( document.createTextNode("Now Playing") );
		},
		exit: function(){
			console.log("World Scene exit");
		},
		load: function(){
			console.log("World Scene loading");
		},
		unload: function(){
			console.log("Scene unloading");
		},
	});
});