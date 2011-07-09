define([
		'lib/lang',
		'lib/Compose',
		'lib/Scene'
	], function (lang, Compose, Scene){
	
	var scene = new Compose(function(){
		console.log("the welcome scene ctor");
		this.ctorfoo = "ctorbar";
	}, Scene, 
	{
		// update: notimpl("update"),
		// redraw: notimpl("redraw"),
		foo: "bar",
		enter: function(){
			console.log("Welcome Scene entered:", node);
			var node = this.config.get("gameNode"); 
			node.appendChild( document.createTextNode("Welcome Scene entered") );
		},
		exit: function(){
			console.log("Welcome Scene exit");
		},
		load: function(){
			console.log("Welcome Scene loading");
		},
		unload: function(){
			console.log("Scene unloading");
		},
	});
	return scene;
});