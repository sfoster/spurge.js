define(['lib/compose', 'lib/lang/array', 'lib/lang/object'], function(Compose, array, object){
	console.log("KeyedArray module");
	
	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	// make local aliases for object module methods
	var mixin = object.mixin, 
		keys = object.keys,
		forIn = object.forIn, 
		createObject = object.createObject, 
		_empty = _empty;

	// make local alias for array module method
	var forEach = array.forEach;

	// Augmented Array which maintains a by-id lookup

	var KeyedArray = Compose(Array, {
		_register: function(entry){
			this._byId[entry.id] = entry;
		}, 
		_unregister: function(entry, idx, coln){
			delete this._byId[entry.id];
		}, 
		push: before(function(){
			forEach(arguments, function(entry){
				this._register(entry);
			}, this);
		}),
		unshift: before(function(){
			forEach(arguments, function(entry){
				this._register(entry);
			}, this);
		}),
		pop: before(function(){
			var entry = this[this.length-1];
			entry && this._unregister(entry);
		}),
		shift: before(function(){
			var entry = this[0];
			entry && this._unregister(entry);
		}),
		add: function(entry){
			return this.push(entry);
		},
		remove: function(entry){
			var idx = this.indexOf(entry);
			if(idx > -1) {
				this.splice(idx, 1);
				// this._unregister(entry);
			}
		},
		byId: function(id) {
			return this._byId[id];
		}, 
		concat: function(ar) {
			var newAr = this.slice();
			// add our byId dict. 
			var byId = newAr._byId = mixin({}, this._byId);
			// add in ids for the array we concated on
			forEach(ar, function(entry){
				newAr.push(entry);
				byId[entry.id] = entry;
			}, this);
			return newAr;
		}, 
		splice: before(function(idx, howMany) {
			// unregister items to be removed
			for(var i=idx; i<Math.min(this.length, idx+howMany); i++){
				this._unregister(this[i]);
			}
			for(var j=2; j<arguments.length; j++){
				this._register(arguments[j]);
			}
		})
	}, function(){
		this._byId = {};
		if(arguments.length){
			this.push.apply(this, arguments);
		}
		return this;
	});

	return	KeyedArray;
});