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
		img: new Image();
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
		this._dirty = {};
		this.handles = [];
	}, Renderable, 
	{
		// rendering
		// behavior - set goals, rules?
		// 	needs states for dead, alive, shoot, hit(?)
		// health, stats
		// 
		redraw: from(Renderable, "update"), 
		dirty: function(){
			lang.forEach(arguments, function(name){
				this._dirty[name] = true;
			}, this);
			return this;
		},
		update: function(){
			this._dirty = {};
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