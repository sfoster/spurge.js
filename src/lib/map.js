define(['lib/rosewood', "lib/lang", "lib/config"], function (
		rw,  // Rosewood module
		lang, 
		config
	){
		console.log("map module");
	// define main enemy entities
	var sprites = {}, 
		assetsDir = lang.get("assetsDir");;

	var layout = ''
		+ "#-#---#-#-#-"
		+ "#-#---#-#-#-"
		+ "#-#---#-#-#-"
		+ "#-#---#-#-#-"
		+ "#-#---#-#-#-"
		+ "#-#-------#-"
		+ "#-#-------#-"
		+ "#-#-#-#-#-#-"
	;
	function parse(strLayout) {
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
	function render(layout) {
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
	sprites['wall'] = [assetsDir + '/Path.png', x, y];

	return {
		sprites: sprites,
		render: render
	};
});

