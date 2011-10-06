define([
	"lib/lang", 
	"lib/Compose"
], function (lang, Compose){
	/**
	  * A module for serializing/deserializing map data
	  * to represent a scene.
	  * Static methods to parser/stringify
	  * rendering needs to be in conjunction w. the scene
	  * as it can provide the sprites, bounds, viewport etc.
	  */

	var testLayout = ''
		+ "#-#---#-#-#-"
		+ "#-#---#-#-#-"
		+ "#-#---#-#-#-"
		+ "#-#---#-#-#-"
		+ "#-#---#-#-#-"
		+ "#-#-------#-"
		+ "#-#-------#-"
		+ "#-#-#-#-#-#-"
	;
	var exports = {};
	exports.parse = function(strLayout) {
		// summary: 
		// 	Deserialize an ascii-art representation of the map
		var layout = [];
		var strRows = strLayout.split("\n");
		var typesMap = {};
		typesMap['#'] = 'floor';
		typesMap['-'] = 'path';

		var rowItr = function(strRow){
			var row = [];
			strRow.split("").forEach(function(c){
				row.push({ 
					type: typesMap[c]
				});
			});
			return row;
		}
		strRows.forEach(function(strRow){
			layout.push( rowItr(strRow) );
		});
		return layout;
	}
	
	exports.Map = Compose(Compose, {
		width: 0,
		height: 0,
		render: function(layout) {
			var curX = 0, 
				curY = 0,
				totalWidth = config.get("mapWidth"),
				totalHeight = config.get("mapHeight");

			var x = totalWidth / layout[0].length, 
				y = totalHeight / layout.length;

			layout.forEach(function(row){
				row.forEach(function(col){

				})
				curY += y;
			})
		}
	})
	sprites['wall'] = [assetsDir + '/Path.png', x, y];

	return {
		sprites: sprites,
		render: render,
		parse: parse
	};
});

