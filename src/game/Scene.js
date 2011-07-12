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
		console.log("game/Scene ctor: " + this.id);
		this.config = config;
		this.entities = [];
	}, Scene, 
	{
		// update: notimpl("update"),
		render: after(function(container){
			console.log( this.id +" Initial Scene rendering:", container);
			console.log("scene node: ", this.node);
			// var node = document.createElement("div"); 
			this.node.innerHTML = "<h2>"+this.id +" Scene entered</h2>";

			var ents = this.entities || [];
			for(var i=0, len=ents.length; i<len; i++){
				ents[i].render(this.node);
			}
			
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