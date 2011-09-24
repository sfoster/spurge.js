define([], function(){

	var arProto = Array.prototype;
	var forEach = ("forEach" in arProto) ? 
		// use native foreach, but we can handle arguments, NodeList etc. too
		function(ar, fn, scope) {
			return arProto.forEach.call(ar, fn, scope || undefinedThis );
		} :
		// shim for foreach
		function(ar, fn, scope){
			for(var i=0, len=ar.length; i<len; i++){
				fn.call(scope || undefinedThis, ar[i], i, ar);
			}
		}
	;
	// console.log("lang module returning exports");
	return	{
		forEach: forEach
	};
});