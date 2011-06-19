define(['lib/rosewood', "lib/lang", "lib/config"], function (
		rw,  // Rosewood module
		lang, 
		config
	){
		console.log("map module");
	// define main enemy entities
	var sprites = {}, 
		assetsDir = config.get("assetsDir");;

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
			w = config.get("assetsDir"), 	// todo: get from config
			y = 50;
		layout.forEach(function(row){
			row.forEach(function(col){
				
			})
			curY += y;
		})
	}
	sprites['wall'] = ['${assetsDir}/Path.png', 50, 50];

	return {
		sprites: sprites,
		render: render
	};
});

