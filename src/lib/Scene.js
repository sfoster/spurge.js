define([
		'lib/lang',
		'lib/compose',
		'lib/event',
		'lib/state'
	], function (lang, Compose, Evented, State){
	
	var notimpl = function(name){
		return function(){
			console.log("method " + name + " is not implemented");
		};
	};
	return Compose(Compose, Evented, State, {
		id: "",
		type: "Scene",
		update: notimpl("update"),
		redraw: notimpl("redraw"),
		enter: function(){
			console.log("Enter not impl");
		},
		exit: notimpl("exit"),
		load: function(){
			console.log("Scene loading");
		},
		unload: function(){
			console.log("Scene unloading");
		},
	}, function(){
		// this.setState("active") has same effect as this.start() (?)
		console.log(this.id + ": in scene ctor");
		this.registerState("active", {
			enter: lang.bind(this, function(){
				this.enter();
			})
		});
	});

});