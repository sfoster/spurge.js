define(['lib/lang', 'lib/compose'], function(lang, Compose){
	var Graph = Compose({
		// more Graph methods/properties
	
		// _nextId: auto-incrementing id for components
		_nextId: 0, 
		generateId: function(stem){
			stem = stem || "component";
			return stem+"_"+(this.nextId++);
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
			console.log("traversing, with: ", nodes.componentId);
			var node;
			for(var i=0, len=nodes.length; i<len; i++){
				node = nodes[i];
				cb(node);
				if(node.childComponents && node.childComponents.length) {
					this._traverse(node.childComponents, cb);
				}
			}
		},
		traverse: function(cb, startNode) {
			startNode = startNode || this.rootComponent;
			this._traverse([startNode], cb);
		}
	}, function(){
		// unshare immutable prototype properties
		this.attachMap = {};

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
	
	
		// use a closure to define a ComponentCollection class 
		// that's hard-linked to this graph 
		var graph = this; 
		// think 'childNodes'
		var ComponentCollection = this.ComponentCollection = Compose(lang.KeyedArray, {
			_register: Compose.before(function(c){
				// hook the '_register' method of KeyedArray
				// to make an entry for this item in the graph-wide registry

				// thing1 attaching behaviorA produces
				// 	thing1.childComponents[behaviorA]
				// and
				// 	graph.attachMap.behaviorA.thing1
			
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
				// a component is being detached
				// break link between the attachee and attached
				var attachTo = graph.attachMap[c.id] || (graph.attachMap[c.id] = {});
				delete attachTo[this.componentId];
			}) 
		});
		
		// define a Component class that's hard-linked to this graph 
		this.Component = Compose(Compose, function(){
			// generate an id if none was provided
			if(!this.id) {
				this.id = graph.generateId();
			}

			// childComponents is verbose but unambiguous 
			// and less liable to be confused with DOMNodes
			// TODO: could be lazily-created as we'll have many leaf components
			this.childComponents = new ComponentCollection();
			// a id-ref back to the component which owns the collection
			this.childComponents.componentId = this.id;

			// automatically place created components in the graph registry
			// those does *not* mean they are in the heirarchy
			graph.registry.add(this);	
		}, {
			attachComponent: function(cmp){
				this.childComponents.push(cmp);
				return this;
			},
			detachComponent: function(cmp){
				if(!cmp.id) throw new Error("Cant detachComponent without id: " + cmp);
				this.childComponents.remove(cmp);
				return this;
			},
			destroy: function(){
				// remove registry entry
				graph.registry.remove(this);
			}
		});
	}, function(){
		// init 
		this.rootComponent = new this.Component({
			id: "ROOT", type: "ROOT"
		});
	});

	return Graph;
});