define([
		'lib/lang',
		'lib/compose'
	], function (lang, Compose){
	
	// TODO: also: 
	// templating
	// spriting
	// cssx to require stylesheet?
	var Renderable = {
		_dirty: null,
		width: 0,
		height: 0,
		node: null,
		className: "",
		sprite: null,
		frameX: 0, // frame (column) in sprite
		frameY: 0, // frame (row) in sprite
		load: function(){
			if(this.sprite && !this.sprite.loaded){
				this.sprite.load();
				console.log(this.id + "has sprite: ", this.sprite)
				// register sprites
				// sprites['enemy'] = [assetsDir+"/enemy1.png", 50, 50];
			}
		},
		render: function(container, posn){
			// initial rendering
			console.log(this.id + " Renderable.render");
			if(!container){
				container = document.body;
			}
			var node = this.node = document.createElement("div"); 
			node.className = this.className;
			this.width && (node.style.width = this.width + "px");
			this.height && (node.style.height = this.height + "px");
			if(this.sprite){
				node.style.background = [
					"url('"+this.sprite.imgSrc+"')",
					"no-repeat",
					this.frameX ? (this.width * this.frameX * -1) +"px" : 0,
					this.frameY ? (this.height * this.frameY * -1) +"px" : 0
				].join(" ");
			}
			container.appendChild(node);
		},
		update: function(){
			// we expect top/left to change
			// also sprite frame
			var dirty = this._dirty || {};
			var keys = Object.keys(dirty), 
				node = this.node, 
				ns = node.style;
			for(var key in dirty){
				if(key in lang._empty) continue;
				// translate properties to style properties
				switch(key){
					case "x":
						ns.left = this.x + "px";
						break;
					case "y":
						ns.top = this.y + "px";
						break;
					case "frameX":
					case "frameY":
					// update sprite
						ns.backgroundPosition = [
							this.frameX ? (this.width * this.frameX * -1) +"px" : 0,
							this.frameY ? (this.height * this.frameY * -1) +"px" : 0
						].join(" ");
						break;
					case "innerContent": 
						node.innerHTML = this.innerContent;
						break;
					default: 
						ns[key] = this[key] + "px";
				}
			}
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