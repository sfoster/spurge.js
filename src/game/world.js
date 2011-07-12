define([
		'lib/lang',
		'lib/Compose',
		'game/Scene'
	], function (lang, Compose, Scene){
	console.log("welcome module");
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	return Compose.create(function(){
		console.log("world scene ctor");
	},Scene, 
	{
		// update: notimpl("update"),
		// redraw: notimpl("redraw"),
		id: "world",
		className: "scene scene-world",

		run: function(){
			// experiment, with the scene as host of the main game loop
			// as we have some "scenes" that don't need a loop at all,
			this.update();
			this.redraw();
		},
		redraw: function(){
			this.node.innerHTML = "<h2>"+this.id +" Scene entered: " + (new Date()).getTime() + "</h2>";
		},
		update: function(){
			// update logic: 
			// process rules
			// call update on all entities, 
			// console.log("Scene update");
		},
		enter: after(function(){
			console.log("Scene/state enter");
			this._intervalId = setInterval(lang.bind(this, this.run), 1000 / 60); // FPS = 60
		}),
		// enter: function(){
		// 	(function() {
		// 	  var onEachFrame;
		// 	  if (window.webkitRequestAnimationFrame) {
		// 	    onEachFrame = function(cb) {
		// 	      var _cb = function() { cb(); webkitRequestAnimationFrame(_cb); }
		// 	      _cb();
		// 	    };
		// 	  } else if (window.mozRequestAnimationFrame) {
		// 	    onEachFrame = function(cb) {
		// 	      var _cb = function() { cb(); mozRequestAnimationFrame(_cb); }
		// 	      _cb();
		// 	    };
		// 	  } else {
		// 	    onEachFrame = function(cb) {
		// 	      setInterval(cb, 1000 / 60);
		// 	    }
		// 	  }
		// 
		// 	  window.onEachFrame = onEachFrame;
		// 	})();
		// 
		// 	window.onEachFrame(Game.run);
		// },

		render: from(Scene),
		exit: before(function(){
			console.log("Scene exit, clearing interval: ", this._intervalId);
			this._intervalId && clearInterval(this._intervalId);
		}),
		load: from(Scene),
		unload: from(Scene),
	});
});