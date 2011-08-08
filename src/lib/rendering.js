define([
		'lib/lang',
		'lib/compose'
	], function (lang, Compose){
	
	// TODO: also: 
	// templating
	// spriting
	// cssx to require stylesheet?
	var strUA = navigator.userAgent.toLowerCase();
	var ua = strUA.indexOf("webkit") > -1 ? 'webkit' : 
		strUA.indexOf("gecko") > -1 ? 'gecko' : 
		strUA.indexOf("opera") > -1 ? 'opera' : 
		strUA.indexOf("internet explorer") > -1 ? 'ie' : 'unknown';
		
		
	var addClass = function(obj, cls) {
		// remove existing 
		var className = (' '+ obj.className + ' ').replace(
			new RegExp('\\s+'+cls+'\\s+', 'g'), 
			' '
		);
		// tack it on the end
		obj.className = className.substring(1) + cls;
	}
	var removeClass = function(obj, cls) {
		// remove existing 
		var className = (' '+ obj.className + ' ').replace(
			new RegExp('\\s+'+cls+'\\s+', 'g'), 
			' '
		);
		obj.className = className.substring(1);
	}
	
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
			if(!container){
				container = document.body;
			}
			var node = this.node = document.createElement("div");
			node.className = this.className;
			var dirty = this._dirty || (this._dirty = {});
			dirty.x = dirty.y = true; // we'll pick up width/height from css
			
			if(this.sprite){
				dirty.frameX = dirty.frameY = true;
				node.style.background = [
					"url('"+this.sprite.imgSrc+"')",
					"no-repeat"
				].join(" ");
			}
			// console.log("calling initial render/update: ", this.id, JSON.stringify(dirty));
			this.update();
			container.appendChild(node);
		},
		update: function(){
			// we expect top/left to change
			// also sprite frame
			var dirty = this._dirty || {}, 
				node = this.node, 
				ns = node.style;
			
			for(var key in dirty){
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
					case "glow":
						if(this.glow) {
							addClass(this, 'glow');
						} else {
							removeClass(this, 'glow');
						}
						node.className = this.className;
						break;
					default: 
						// default (rare?) is to copy this[key]
						// straight into node.style
						// e.g. 'width'
						if(key in this && !(key in lang._empty)) {
							ns[key] = this[key] + "px";
						}
				}
				this._dirty = {};
			}
		},
		unrender: function(){
			if(this.node && this.node.parentNode) {
				this.node.parentNode.removeChild(this.node);
				this.node = null;
			}
		},
		ua: ua
	};
	return Renderable;
});