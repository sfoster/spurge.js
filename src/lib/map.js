define(['lib/rosewood', "lib/lang", "lib/config"], function (
		rw,  // Rosewood module
		lang, 
		config
	){
		console.log("map module");
	// define main enemy entities
	var sprites = {}, 
		assetsDir = config.assetsDir;

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
	function render() {
		var rows = layout.split("\n");
		var rowItr = function(row){
			rows.forEach(function(row) {
				var cols = row.split("");
				cols.forEach(colItr);
			})
		}
		var colItr = function(col){
			switch(col) }{
				case "#": 
					// create wall entity
					break;
				default
			}
		}
	}
	sprites['wall'] = ['${assetsDir}/Path.png', 50, 50];

	return {
		sprites: sprites,
		render: render
	};
});

