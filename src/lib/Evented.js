define(function (){

	// summary: 
	//    a mixin/trait that provides basic event management capabilities

	var Evented = {
		// dictionary of all event-names => listener arrays
		__events: {},
		addEventListener: function(name, fn) {
			// pubsub thing
			var events = this.__events, 
				listeners = events[name] || (events[name] = []);
			listeners.push(fn);
			return {
				type: name,
				remove: function(){
					var idx = listeners.indexOf(fn);
					if(idx >= 0) {
						listeners.splice(idx, 1);
					}
				}
			};
		},
		removeAllListeners: function(name) {
		  // remove all listeners of a particular type
			// pubsub thing
			
			// ditch all listeners associated w. that nam
			// no ceremonies here.
			this.__events[name] = [];
		},
		raiseEvent: function(name, payload){
			var listeners = this.__events[name] || [];
			payload = payload || {};
			payload.type = name;
			for(var i=0; i<listeners.length; i++){
				listeners[i](payload);
			}
		}
	};
	return Evented;

});