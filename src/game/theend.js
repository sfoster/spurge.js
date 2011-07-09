define([
		'lib/lang',
		'lib/Compose',
		'lib/Scene'
	], function (lang, Compose, Scene){
	
	return Compose.create(function(){
		console.log("the End Game scene ctor");
	}, Scene, 
	{
		// update: notimpl("update"),
		// redraw: notimpl("redraw"),
		enter: function(){
			console.log("End Game Scene entered");
			var node = this.config.get("gameNode"); 
			node.appendChild( document.createTextNode("The End") );
		},
		exit: function(){
			console.log("End Game Scene exit");
		},
		load: function(){
			console.log("End Game Scene loading");
		},
		unload: function(){
			console.log("Scene unloading");
		},
	});
});