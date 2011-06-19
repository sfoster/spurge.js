define(['lib/my-class/my.class', 'lib/lang'], function(my, lang){
	console.log("base module");
	var mixin = lang.mixin, 
		uniqId = lang.uniqId, 
		base = {};
	
	var entities = base._entities = {};

	var _GameEntity = base._GameEntity = my.Class({
		id: "",
		// base class for all objects we manage in the game
		constructor: function(props) {
			console.log("_GameEntity constructor");
			if(props) {
				mixin(this, props);
			}
			if(!this.id) {
				this.id = uniqId("entity");
			}
			entities[this.id] = this;
		},
		destroy: function() {
			this.node = null;
			entities[this.id] = null;
			delete entities[this.id];
		},
	});
	
	var _Container = function(Class){
		mixin(Class.prototype, {
			addChild: function(thing){
				var children = this._children || (this._children = []);
				children.push(thing)
			},
			removeChild: function(thing) {
				var children = this._children || (this._children = []);
				var idx = children.indexOf(thing);
				if(idx >= 0) {
					children.splice(idx, 1);
				}
			}
		});
		return Class;
	}
	var _Spritish = function(Class){
		mixin(Class.prototype, {
			x: 0, 
			y: 0, 
			rotation: 0,
			addChild: function(thing){
				var children = this._children || (this._children = []);
				children.push(thing)
			},
			removeChild: function(thing) {
				var children = this._children || (this._children = []);
				var idx = children.indexOf(thing);
				if(idx >= 0) {
					children.splice(idx, 1);
				}
			}
		});
		return Class;
	}
	var _Missile = base._Missile = my.Class({
		id: "",
		damage: 1,
		templateStr: '<div class="sprite missile" id="${id}">${id}</div>',
		
		// base class for all objects we manage in the game
		constructor: function(props) {
			console.log("_GameEntity constructor");
			if(props) {
				mixin(this, props);
			}
			this.id = uniqId("missile");
			console.log("Missile id: ", this.id, "rotation: ", this.rotation);
			entities[this.id] = this;
		},
		render: function(){
			// $.html
			var node = $(lang.templatize(this.templateStr, this))[0];
				
			$(node).css({
				// 'transform': lang.templatize('rotate(${rotation}deg)', { rotation: this.rotation }),
				top: this.y + "px",
				left: this.x + "px",
			});

			if(this.hasOwnProperty("rotation")) {
				console.log("rotate by: " + this.rotation);
				$(node).rotate(this.rotation);
			}
			this.node = node;
			return node;
		},
		pointAt: function(x, y) {
			// SOHCAHTOA
			// Tangent: tan(θ) = Opposite / Adjacent
			var node = this.node;
			var originX = this.x, 
				originY = this.y, 
				deg = 0;
				
			var opp = y - originY, 
				adj = x - originX, 
				angle = 0;
			
			var deg = opp/adj ? 
				Math.round(Math.atan(opp/adj) * 180 / Math.PI) : 
				0;

			// transform to correct the rotation, 
			// from anti-clockwise, zeroed at horizontal
			// to clockwise, zeroed at vertical
			this.rotation = (-360 + 90 + deg) % 360;
			$(node).css('transform', lang.templatize('rotate(${rotation}deg)', { rotation: this.rotation }));
		}, 
		fire: function(target) {
			if(target) {
				this.target = target;
			}
		}
	});
	var _Container = function(Class){
		mixin(Class.prototype, {
			addChild: function(thing){
				var children = this._children || (this._children = []);
				children.push(thing)
			},
			removeChild: function(thing) {
				var children = this._children || (this._children = []);
				var idx = children.indexOf(thing);
				if(idx >= 0) {
					children.splice(idx, 1);
				}
			}
		});
		return Class;
	}
	
	// level, scene, chapter
	var Scene = base.Scene = _Container(my.Class(_GameEntity, {
		onEnter: function() {},
		onExit: function() {}
	}));

	// level, scene, chapter
	var Game = base.Game = _Container(my.Class(_GameEntity, {
		constructor: function(props) {
			Game.Super.call(this, props);
			return this;
		},
		start: function() {
			console.log("start the game");
		},
		pause: function() {
			
		},
		end: function() {
			
		}
	}));
	
	var Actor = base.Actor = my.Class(_GameEntity, {
		health: -1,
		width: 50,
		height: 50,
		render: function(state) {
			console.log("rendering Actor in state: ", state);
		}
	});
	
	console.log("base module returns base: ", base);
	return base;
});