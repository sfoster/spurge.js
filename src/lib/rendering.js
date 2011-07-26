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
		strUA.indexOf("opera") > -1 ? 'opera' : 'unknown';
		
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
		update: (function(){
			var empty = {};
			// what doesn't change here? 
			// node, node.style? (not often anyway)
		
			var update = function(){
				var dirty = this._dirty || {}, 
					node = this.node, 
					ns = node.style;

				// summary: 
				// 		reflect changed properties into the DOM
				for(var key in dirty){
					// if(key in empty) continue;
					// translate properties to style properties
					handlers[key](key, this, node, ns);
				}
				this._dirty = {};
			};
			update.cache = {};

			var handlers = {
				"x": function(pname, self, node, ns){
					ns.left = self.x + "px";
				},
				"y": function(pname, self, node, ns){
					ns.top = self.y + "px";
				},
				// and frameY
				"frameX": function(pname, self, node, ns){
					// update sprite
					ns.backgroundPosition = [
						self.frameX ? (self.width * self.frameX * -1) +"px" : 0,
						self.frameY ? (self.height * self.frameY * -1) +"px" : 0
					].join(" ");
				},
				"innerContent": function(pname, self, node, ns){
					node.innerHTML = self.innerContent;
				},
				"glow": function(pname, self, node, ns){
					if(self.glow) {
						addClass(self, 'glow');
					} else {
						removeClass(self, 'glow');
					}
					node.className = self.className;
				},
				"default": function(pname, self, node, ns){
					ns[key] = self[pname] + "px";
				}
			};
			handlers["frameY"] = handlers["frameX"];
			
			return update;
		})(),
		unrender: function(){
			if(this.node && this.node.parentNode) {
				this.node.parentNode.removeChild(this.node);
				this.node = null;
			}
		}
	};
	return Renderable;
});