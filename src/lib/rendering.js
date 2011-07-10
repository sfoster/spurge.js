define([
		'lib/lang',
		'lib/compose',
	], function (lang, Compose){
	
	// TODO: also: 
	// templating
	// spriting
	// cssx to require stylesheet?
	var Renderable = {
		width: 0,
		height: 0,
		node: null,
		className: "",
		render: function(container, posn){
			console.log(this.id + " Renderable.render");
			if(!container){
				container = document.body;
			}
			var node = this.node = document.createElement("div"); 
			node.className = this.className;
			this.width && (node.style.width = this.width + "px");
			this.height && (node.style.height = this.height + "px");
			container.appendChild(node);
		},
		unrender: function(){
			if(this.node && this.node.parentNode) {
				this.node.parentNode.removeChild(this.node);
				this.node = null;
			}
		}
	};
	return Renderable;
});