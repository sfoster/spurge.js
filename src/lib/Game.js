define([
	'lib/my-class/my.class', 
	'lib/base',
	'lib/lang'
], function (my, base, lang){

	var Game = my.Class(base.Game, {
		config: null,
		constructor: function(props) {
			Game.Super.call(this, props);
		},
		setup: function(){
			this._setupMenu();
			this._setupMap();
			this._setupPlayer();
		},
		_setupMap: function(){
			// need a node/context to render to
			// need dimensions
			// need a set of sprites
			// need map data
		},
		_setupPlayer: function(){
			this.player = {
				health: 100,
				credits: 100
			};
			// render via aop?
		},
		_setupMenu: function(){
			// need a node/context to render to
			// need a filtered list of towers to place
			// need avail. credits
			// need map data
			this.player = {
				health: 100,
				credits: 100
			};
			var tmpl = '<div id="qtowerMenu">${content}</div>', 
				div = $(lang.templatize(tmpl, { content: '<h3>Menu goes here</h3>'}));
			$(document.body).append(div);
			console.log("menu:", div);
			$(div).css("height", "400px");
			console.log("TODO: setupMenu");
		}, 
		start: function() {
			console.log("enter start state");
		},
		tick: function() {
			//Offset all the pane:
			console.log("tick: ", newPos);
		}
	});
	return Game;
});
