define([
		'lib/lang',
		'lib/Compose',
		'lib/rendering'
	], function (lang, Compose, Renderable){
	
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var exports = {};
	exports.Sprite = Compose(Compose, function(){
		this.img = new Image();
	}, {
		width: 16,
		height: 16,
		imgSrc: "",
		loaded: false,
		load: function(cb){
			if(cb){
				this.onload = cb;
			}
			this.img.src = this.imgSrc;
		}
	});

	exports.Actor = Compose(Compose, function(){
		this._dirty = { x: true, y: true };
		this.handles = [];
		// active state is implicit in instantiation?
		// hook into scene events we're interested in
		// TODO: maybe move event names into an array to make subclassing easier?
		this.hookEvents();
	}, Renderable, 
	{
		// rendering
		// behavior - set goals, rules?
		// 	needs states for dead, alive, shoot, hit(?)
		// health, stats
		// 
		hookEvents: function(){
			var scene = this.scene; 
			if(scene){
				this.handles.push(
					scene.addEventListener("update", lang.bind(this, "update")),
					scene.addEventListener("redraw", lang.bind(this, "redraw"))
				);
			}
		},
		redraw: from(Renderable, "update"), 
		dirty: function(){
			lang.forEach(arguments, function(name){
				this._dirty[name] = true;
			}, this);
			return this;
		},
		update: function(){
			// TODO: process rules, behaviour
		},
		destroy: function(){
			var hdl = null;
			while((hdl = this.handles.shift())){
				hdl.remove();
			}
			this.unrender();
		}
	});
	return exports;
});