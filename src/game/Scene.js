define([
		'lib/lang',
		'lib/Compose',
		'lib/Evented',
		'lib/Scene',
		'game/config'
	], function (lang, Compose, Evented, Scene, config){
	
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	var keysMap = {
		13: "ENTER",
		' ': "SPACE",
		32: "SPACE",
		37: "LEFTARROW",
		38: "UPARROW",
		39: "RIGHTARROW",
		40: "DOWNARROW"
	};
	var controls = Compose.create(function(){
		this.keys ={};
	}, {
		keyPressDown: function(evt){
			var code = evt.keyCode, 
				chr = (code in keysMap) ? 
					keysMap[code] : String.fromCharCode(code).toLowerCase() || code;
					
			// fallback to the keyCode for non-printable chars e.g. ENTER (13)
			this.keys[chr] = true;
			// this.raiseEvent("/keys/down/"+evt.keyCode);
		},
		keyPressUp: function(evt){
			var code = evt.keyCode, 
				chr = (code in keysMap) ? 
					keysMap[code] : String.fromCharCode(code).toLowerCase() || code;
					
			// use the keyCode for non-printable chars e.g. ENTER (13)
			delete this.keys[chr || code];
			// this.raiseEvent("/keys/up/"+evt.keyCode);
		},
		init: function(container){
			console.log("controls init");
			container = container || document;
			container.addEventListener('keydown',lang.bind(this, "keyPressDown"),true);
			container.addEventListener('keyup',lang.bind(this, "keyPressUp"),true);
		}
	}, Evented);

	var hdl = controls.addEventListener("/keys/down/ENTER", function(){
		console.info("ENTER was pressed");
	});
	
	return Compose(function(){
		this.config = config;
		this.entities = [];
		this.controls = controls;
		console.log("game/Scene ctor: " + this.id);
	}, Scene);
});