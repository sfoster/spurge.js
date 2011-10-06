define([
	'lib/lang',
	'lib/compose'
	], function(lang, Compose){
		
	 var _State = Compose({
		name: "unnamed",
		follows: [], // array
		enter: function(){
			var stack = getStack(); // need ref. to attachee
			
		}
	}, function(){
		this.follows = null; // unshare from the prototype
	},Compose);
	
	Stateful = Compose({
		// a thing which manages some states
		// states are a predictable way of generating events
		// not components, think more phases
		
		// TODO: consider a stack of states, i.e. nesting
		// 	so alive -> asleep -> dreaming
		// 	I can exit dreaming state but still be sleeping
		//	I can exit asleep state but still be alive
		// 	exiting alive state implicitly exits dreaming and asleep states
		
		// multiple stacks can exist
		// 	e.g. 
		// 	alive 
		// 		-> running 
		// 			-> jumping
		// when I enter running state, I first enter alive implicitly
		// when I enter jumping, am still running, so when I exit jumping I resume running
		// otoh, if I enter walking, I exit running
		// 	these sound like grammar rules
		// 	these rules should be able to be shared
		// 	so we can define once, and say entities of class X can have these states
		// 	
		// 
		__statesByName: null, // by-name(id) lookup
		__statesByType: null, // type-keyed hash of arrays(stacks)
		registerState: function(state){
			var	
				component = this,
				name = state.name, 
				type = state.type || "default", 
				hookName = "on"+name.charAt(0).toUpperCase() +name.substring(1)+"StateChange",
				byName = this.__statesByName, 
				byType = this.__statesByType, 
				stack = byType[type] || (byType[type] = []);

			if(byName[name]){
				console.log(this.id + " registerState: error");
				// throw new Error("A " + name + " state is already registered");
			} else {
				byName[name] = state;
			}
			// stack.push(state);

			// define destructor for this state
			var handle = {
				remove: function(){
					// FIXME: what state becomes active when a state is removed?
					var arr = byType[type], 
						idx = arr.indexOf(state);
					if(idx >= 0) {
						arr.splice(idx, 1);
					}
					delete byName[name];
					component[hookName] = null;
					delete this[hookName];
				}
			}

			// create hooks for this state
			// console.log("defining hooks for: ", hookName, this);
			this[hookName] = function(){
				console.log(hookName);
			};
			
		},
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
	}, function(){
		console.log(this.id + " Stateful ctor");
		// what are the types? 
		// types are exclusive state chains/stacks
		// e.g. running/walking damaged/undamaged. 
		// Entering damaged state doesn't change the fact I'm running
		this.__statesByName = {}; 
		this.__statesByType = {};
	});
	
	Stateful._defineState = function(name, props){
		// factory for states. creates a state object with enter/exit methods
		
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

		// return a state object decorated with destructor to undo the registration we just did
		return state;
	}
	
	Stateful.defineState = function(name, props){
		// factory for state. Enter into registry
		// 	'follows'
		// e.g. td implied table > tbody > tr > td
		// and li implies (ul|ol) > li
		// { name: 'td', follows: 'table,tbody|thead,tr' }
		// creates: 
		// 	enter: function(){
		// 	get stack for this entity
		// 	loop thro' our follows, matching each in the stack
		// 	splice the stack as necessary; each removes entry needs its exit() method called
		//  create missing entries, each has its enter method called
		// 	
		var state = new _State(name, props);
	}
  	// console.log("state module");
	return Stateful;
});