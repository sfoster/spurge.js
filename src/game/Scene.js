define([
		'lib/lang',
		'lib/Compose',
		'lib/Scene',
		'game/config'
	], function (lang, Compose, Scene, config){
	
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	return Compose(function(){
		console.log("game/Scene ctor");
		this.config = config;
	}, Scene, 
	{
		// update: notimpl("update"),
		// redraw: notimpl("redraw"),
		render: before(function(container){
			console.log( this.id +" Scene rendering:", container);
			// var node = this.config.get("gameNode"); 
			// node.appendChild( document.createTextNode(this.id +" Scene entered") );
		}),
		exit: function(){
			console.log(this.id +" Scene exit");
			if(this.node){
				this.node.style.zIndex = 0;
			}
		},
		load: function(){
			console.log(this.id +" Scene loading");
		},
		unload: function(){
			console.log(this.id +" unloading");
		},
	});
});