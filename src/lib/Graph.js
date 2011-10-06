define(['lib/lang', 'lib/compose'], function(lang, Compose){
	console.log("defining Graph");
	var Graph = Compose({
		// more Graph methods/properties
	
		// _nextId: auto-incrementing id for components
		_nextId: 0, 
		generateId: function(stem){
			stem = stem || "component";
			return stem+"_"+(this._nextId++);
		}, 
		init: function(){
			// init 
			if(!this.Component) {
				this.Component = Graph.Component;
			}
			if(!this.ComponentCollection) {
				this.ComponentCollection = Graph.ComponentCollection;
			}
			
			this.rootComponent = new this.Component({
				graph: this,
				id: "ROOT", type: "ROOT"
			});
		},
		attachMap: {}, 
		unattach: function(c) {
			// remove a component from the graph
			// think pnode.removeChild()

			// thing1 attaching behaviorA produces
			// 	thing1.childComponents[behaviorA]
			// and
			// 	graph.attachMap.behaviorA.thing1
		
			var attachPoints = this.componentAttachList(c);
			// remove from each
			attachPoints.forEach(function(parent){
				parent.remove(c);
			}, this);
		},
		attachTo: function(c, parent) {
			parent = parent || this.rootComponent;
			parent.attachComponent(c);
		},
	
		componentAttachList: function(c){
			// get a list of everything this component is attached to
			var id = typeof c == "string" ? c : c.id, 
				attachMap = this.attachMap[id], 
				attachIds = attachMap && lang.keys(attachMap) || [], 
				registry = this.registry;
		
			var list = [], 
				comp = null;
			for(var i=0, len=attachIds.length; i<len; i++){
				comp = registry.byId(attachIds[i]);
				if(comp) {
					list.push(comp);
				}
			}
			return list;
		},
		_traverse: function(nodes, cb) {
			// console.log("traversing, with: ", nodes.componentId);
			var node, 
				stack = this.stack;
			for(var i=0, len=nodes.length; i<len; i++){
				node = nodes[i];
				stack.push(node);
				cb(node);
				if(node.childComponents && node.childComponents.length) {
					this._traverse(node.childComponents, cb);
				}
				stack.pop();
			}
		},
		traverse: function(cb, startNode) {
			startNode = startNode || this.rootComponent;
			this._traverse([startNode], cb);
		}
	}, function(){
		// unshare immutable prototype properties
		// console.log("Graph ctor");
		this.attachMap = {}, 
		
		// stack is a decorated array, to give us sugar for traversal
		this.stack = lang.mixin([], {
			get: function(idx){
				var count=this.length;
				switch(idx){
					// fast-track common accessors
					case undefined: 
					case 'current': 
					 	// the last entry
						return this[count-1];
					case "parent": 
						return this[count-2];
					case "grandparent": 
						return this[count-3];
					default: 
						idx = parseInt(idx, 10);
						return this[idx < 0 ? count + idx : idx];
				}
			}
		});

		// registry: flat array + lookup for all components
		this.registry = Compose.create(lang.KeyedArray, {
			byType: function(type){
				// by-type collection
				var coln = new lang.KeyedArray(), 
					idMap = this._byId, 
					component, 
					ctype; // need coln class?
				
				for(var i=0,len=this.length; i<len; i++) {
					component = this[i];
					if(("type" in component) && component.type == type) {
						coln.push(component);
					}
				}
				// Can apply filter to `this`?
				return coln;
			}
		}); // global lookup for all nodes in the graph
	
	
		
	}, function(){
		// run the graph's init
		// console.log("Graph ctor(2), calling this.init()");
		this.init && this.init();
	});
	
	// create a gutted KeyedArray class w/o constructor
	var _KeyedArray = function(){
		this._byId = {};
	};
	_KeyedArray.prototype = lang.KeyedArray.prototype;
	// think 'childNodes'
	// console.log("defining ComponentCollection");
	var ComponentCollection = Graph.ComponentCollection = Compose(_KeyedArray, function(){
		// var graph = this.graph;
		// if(!graph) {
		// 	throw new Error("Missing graph property in ComponentCollection constructor ", this);
		// }
	}, {
		_register: Compose.before(function(c){
			// hook the '_register' method of KeyedArray
			// to make an entry for this item in the graph-wide registry

			// thing1 attaching behaviorA produces
			// 	thing1.childComponents[behaviorA]
			// and
			// 	graph.attachMap.behaviorA.thing1

			var graph = this.graph;
		
			if(!c.id) throw new Error("Cant register component without id: " + c);
			// a component is being attached
			if(!graph.registry.byId(c.id)){
				// make sure its in our graph-wide registry also
				graph.registry.add(c);
			}
			// each component gets its own attach hash
			var attachTo = graph.attachMap[c.id] || (graph.attachMap[c.id] = {});
			// track a link between the attachee (the component this collection belongs to) 
			// ..and the attached
			attachTo[this.componentId] = c.id;
		}),
		_unregister: Compose.before(function(c){
			var graph = this.graph;
			// a component is being detached
			// break link between the attachee and attached
			var attachTo = graph.attachMap[c.id] || (graph.attachMap[c.id] = {});
			delete attachTo[this.componentId];
		}) 
	});

	// define a Component class that's hard-linked to this graph 
	// console.log("defining Graph.Component");
	var Component = Graph.Component = Compose(Compose, function(){
		// console.log("Graph.Component ctor");
		var graph = this.graph;
		if(!graph) {
			throw new Error("Missing graph property in Component constructor ", this);
		}
		// generate an id if none was provided
		// console.log("Graph.Component ctor, checking id: ", this.id);
		if(!this.id) {
			this.id = graph.generateId();
		}

		// automatically place created components in the graph registry
		// those does *not* mean they are in the heirarchy
		graph.registry.add(this);	
	}, {
		init: function(){
			// console.log("Graph.Component init");
			var graph = this.graph;
			// childComponents is verbose but unambiguous 
			// and less liable to be confused with DOMNodes
			// TODO: could be lazily-created as we'll have many leaf components
			var childComponents = this.childComponents = new graph.ComponentCollection();
			childComponents.graph = graph;

			// a id-ref back to the component which owns the collection
			childComponents.componentId = this.id;
		},
		attachComponent: function(cmp){
			// TODO: support operators to indicate precedence?
			this.childComponents.push(cmp);
			cmp.onAttach && cmp.onAttach(this); // you are now attached to me
			return this;
		},
		detachComponent: function(cmp){
			if(!cmp.id) throw new Error("Cant detachComponent without id: " + cmp);
			this.childComponents.remove(cmp);
			cmp.onDetach && cmp.onDetach(this); // you are detached from me
			return this;
		},
		destroy: function(){
			// remove registry entry
			var graph = this.graph;
			graph.registry.remove(this);
		}
	}, function(){
		// console.log("Graph.Component init: ", this.id);
		// run any init method
		this.init && this.init();
	});

	return Graph;
});