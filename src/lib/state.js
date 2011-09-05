define([
	'lib/lang',
	'lib/compose'
	], function(lang, Compose){
		
	Stateful = Compose({
		// a thing which manages some states
		// states are a predictable way of generating events
		// not components, think more phases
		
		// TODO: consider a stack of states, i.e. nesting
		// 	so alive -> asleep -> dreaming
		// 	I can exit dreaming state but still be sleeping
		//	I can exit asleep state but still be alive
		// 	exiting alive state implicitly exits dreaming and asleep states
		
		// multiple stacks could exist
		// 	e.g. alive 
					// running 
					// 	jumping
		__statesByName: null, 
		__statesByType: null,
		exitState: function(name){
			var state = this.__statesByName[name];
			state.exit();
		},
		enterState: function(name){
			console.log("state: enterState: ", name);
			var state = this.__statesByName[name], 
				type = state.type, 
				states = this.__statesByType[type], 
				altState = null;
			
			// states on the same object, of the same type
			// are mutually exclusive, entry of one implies exit of the other(s)
			for(var i=0, len=states.length; i<len; i++){
				altState = states[i];
				if(altState != state && altState.active){
					// do we need to exit this state first?
					altState.exit();
					altState.active = false;
				}
			}
			console.log("entering state: ", state.id);
			state.active = true;
			state.enter && state.enter();
		},
		registerState: function(name, props){
			// e.g. set("running", false);
			// exclusive states
			// set("running", true); implicitly sets "walking" to false first
			
			if(name && undefined == props) {
				props = name; 
				name = props.name;
			}
			
			// console.log("register state: " + name, this.__statesByType);
			var state = lang.createObject({
				active: false,
				type: name, // default to name==type
				name: name
			}, props || {});
			
			var	name = state.name, 
				type = state.type, 
				hookName = "on"+name.charAt(0).toUpperCase() +name.substring(1)+"StateChange",
				byName = this.__statesByName, 
				byType = this.__statesByType, 
				statesOfType = byType[type] || (byType[type] = []);
			
			if(byName[name]){
				console.log(this.id + " registerState: error");
				// throw new Error("A " + name + " state is already registered");
			} else {
				byName[name] = state;
			}
			statesOfType.push(state);

			// define destructor for this state
			state.remove = function(){
				// FIXME: what state becomes active when a state is removed?
				var arr = byType[type], 
					idx = arr.indexOf(state);
				if(idx >= 0) {
					arr.splice(idx, 1);
				}
				delete byName[name];
				this[hookName] = null;
				delete this[hookName];
			};

			// create hooks for this state
			// console.log("defining hooks for: ", hookName, this);
			this[hookName] = function(){
				console.log(hookName);
			};

			// return a state object decorated with destructor to undo the registration we just did
			return state;
		},
	}, function(){
		console.log(this.id + " Stateful ctor");
		this.__statesByName = {}; 
		this.__statesByType = {};
	});
  // console.log("state module");
	return Stateful;
});