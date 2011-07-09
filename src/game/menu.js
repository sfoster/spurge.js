define([
		'lib/lang',
		'lib/Compose',
		'lib/Scene'
	], function (lang, Compose, Scene){
	
	return Compose.create(function(){
		console.log("the menu ctor");
	}, Scene, 
	{
		// update: notimpl("update"),
		// redraw: notimpl("redraw"),
		enter: function(){
			console.log("Menu Scene entered");
			var node = this.config.get("gameNode"); 
			node.appendChild( document.createTextNode("The Menu") );
		},
		exit: function(){
			console.log("Menu Scene exit");
		},
		load: function(){
			console.log("Menu Scene loading");
		},
		unload: function(){
			console.log("Scene unloading");
		},
	});
});