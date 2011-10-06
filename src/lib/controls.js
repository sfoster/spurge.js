define([
		'lib/lang',
		'lib/compose',
		'lib/Evented',
	], function (lang, Compose, Evented){

var exports = {};
// TODO: move this keys manager elsewhere
var keysMap = exports.keysMap = {
	13: "ENTER",
	16: "SHIFT",
	' ': "SPACE",
	32: "SPACE",
	37: "LEFTARROW",
	38: "UPARROW",
	39: "RIGHTARROW",
	40: "DOWNARROW"
};
exports.Controls = Compose(function(){
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

return exports;
});