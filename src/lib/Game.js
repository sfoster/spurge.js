define([
		'lib/lang',
		'lib/compose',
		'lib/Evented',
		'lib/state',
		'lib/promise'
	], function (lang, Compose, Evented, Stateful, Promise){

	var engine; // need one

	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var Game = Compose(Compose, Evented, Stateful, function(args){
		console.log('lib/Game ctor');
		this.config = args.config || {};
	},{
		config: null,
		sprites: null,
		scenes: null,
		init: function(callback){
			// console.log("setup sprites: ", sprites);
			var game = this;
			this.scenes.forEach(function(scene){
				console.log("registering " + scene.id + " on this: ", this.id);
				this.registerState(scene.id, scene);
				scene.game = game; 
				console.log("assigning config to scene " + scene.id, game.config);
				if(!scene.config) {
					game.config; 
				}
			}, this);
		},
		load: function() {
			// load content resources
			// return a promise as necessary
		},
		run: function(){
			// start the loop, or load the thing that owns the loop
			if(!this.currentScene){
				this.currentScene = this.scenes[0].id;
				Promise.when(this.currentScene.init(), lang.bind(this, function(){
					this.enterState(this.currentScene);
				}));
			}
		},
		enter: function() {
			var sequence = ["init", "loadContent", "postLoadContent", "run"];
			sequence.next = function(){
				var meth = sequence.shift();
				if(meth) {
					console.log("calling sequence method: " +meth);
					Promise.when(
						meth.call(scope), 
						lang.bind(this, "next")
					);
				}
			};
			sequence.next();
		},
		update: function() {
			//Offset all the pane:
			// console.log("tick");
		}, 
		exit: function(){
			
		}
	});

	return Game;
});
