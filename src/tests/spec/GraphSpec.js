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
	
	
	describe("Graph", function() {
		
		describe("Graph registry", function(){
			var graph = new Graph();

			var thing1 = new graph.Component({
				id: "thing1", type: "thinger"
			});

			it("is exposed", function() {
				expect(graph.registry).toBeTruthy();
			});
			it("has add method", function() {
				expect(graph.registry.add).toBeTruthy();
			});
			it("has numeric length property", function() {
				expect(typeof graph.registry.length).toEqual("number");
			});
			it("can add and remove components", function() {
				var oldLen = graph.registry.length;
				graph.registry.add(thing1);
				
				expect(graph.registry.length).toEqual(oldLen + 1);

				graph.registry.remove(thing1);
				expect(graph.registry.length).toEqual(oldLen);
			});
			it("can lookup components", function() {
				expect(graph.registry.byId("thing1")).toBeFalsy();
				graph.registry.add(thing1);
				
				expect(graph.registry.byId("thing1")).toEqual(thing1);
			});
		});
		
		describe("Graph Component", function(){
			var graph = new Graph();

			var thing1 = new graph.Component({
				id: "thing1", type: "thinger"
			});

			it("is exposed", function() {
				expect(graph.Component).toBeTruthy();
			});

			it("can be instantiated", function() {
				var c = new graph.Component({
					id: "c1"
				});
				expect(c).toBeTruthy();
				expect(c.id).toEqual("c1");
			});
			it("has expected methods", function() {
				var c = new graph.Component({
					id: "cmethods"
				});
				expect(c.attachComponent).toBeDefined();
				expect(c.detachComponent).toBeDefined();
			});
			it("automatically registers components on creation", function(){
				expect(graph.registry.byId("thing1")).toEqual(thing1);
			})

			it("automatically unregisters components on destruction", function(){
				var deadthing = new graph.Component({
					id: "dead", type: "thinger"
				});
				expect(graph.registry.byId("dead")).toEqual(deadthing);
				deadthing.destroy();
				expect(graph.registry.byId("dead")).toBeFalsy();
			})
		});

		describe("Graph registry sync", function(){
			var graph = new Graph();

			it("has registered the rootComponent", function() {
				expect(graph.rootComponent).toBeTruthy();
				expect(graph.rootComponent instanceof graph.Component).toBeTruthy();
				expect(graph.registry.byId("ROOT")).toBeTruthy();
				expect(graph.registry.byId("ROOT")).toEqual(graph.rootComponent);
			});
			it("registers attached components", function() {
				var c = new graph.Component({
					id: "cattached"
				});
				graph.rootComponent.attachComponent(c);
				
				expect(graph.rootComponent.childComponents).toBeDefined();
				expect(graph.rootComponent.childComponents.length).toBeGreaterThan(0);
				expect(graph.registry.byId("cattached")).toEqual(c);
			});
			it("registers nested components", function() {
				var thing0 = new graph.Component({
						id: "thing_0", type: "thinger"
					}),
					thing1 = new graph.Component({
						id: "thing_1", type: "thinger"
					});
				
				thing0.attachComponent(thing1);
				graph.rootComponent.attachComponent(thing0);
				graph.rootComponent.attachComponent(thing1);
				
				expect(graph.rootComponent.childComponents).toBeDefined();
				expect(graph.rootComponent.childComponents.length).toBeGreaterThan(0);
				expect(thing0.childComponents.length).toBeGreaterThan(0);

				expect(graph.registry.byId("thing_0")).toEqual(thing0);
				expect(graph.registry.byId("thing_1")).toEqual(thing1);
				
			});
		});
		define("Attachment", function(){
			var graph = new Graph();
			var thing0 = new graph.Component({
					id: "thing_0", type: "thinger"
				}),
				thing1 = new graph.Component({
					id: "thing_1", type: "thinger"
				}),
				thing2 = new graph.Component({
					id: "thing_2", type: "thinger"
				});
			// note: thingN are orphaned; 
			// they are associated with, but not attached to the graph; 
			// they are not in the heirarchy

			it("tracks component attachment", function() {
				thing0.attachComponent(thing1);

				var list = graph.componentAttachList(thing1);
				
				expect(list.length).toEqual(1);
				expect(list[0]).toEqual(thing0);
			});
		});
		define("Detachment", function(){
			var graph = new Graph();
			var thing0 = new graph.Component({
					id: "thing_0", type: "thinger"
				});
		
			it("detaches components", function() {
				var thingD = new graph.Component({
					id: "thing_D", type: "thinger"
				}), 
				root = graph.rootComponent;
				
				var childLen = root.childComponents.length;
				
				// where am I attached? should be empty
				expect(graph.componentAttachList(thingD).length).toEqual(0);
				
				root.attachComponent(thingD);
				
				// childComponent list should have grown
				expect(root.childComponents.length).toEqual(childLen + 1);
				
				// where am I attached? should be ["ROOT"]
				var list = graph.componentAttachList(thingD);
				expect(list.length).toEqual(1);
				expect(list[0]).toEqual( root );

				// take it back out
				root.detachComponent(thingD);
				expect(root.childComponents.length).toEqual(childLen);
				expect(root.childComponents.indexOf(thingD)).toEqual(-1);

				// where am I attached now? should be []
				expect(graph.componentAttachList(thingD).length).toEqual(0);
			});

			// thing th1 has behavior bv1 
			// bv1 is attached to th1
			// the loop will find and call bv1 in the context of th1
			// bv1 is destroyed
			// 	bv1.childComponents list is emptied
			// 	bv1 is removed from th1 attach list
		});

		// expect(emptyKeyed.length).toBeDefined();


		// Graph should
		// DOM API: 
		// 	appendChild, removeChild
		// 	getElementById
		// 	getElementByName|Type|Selector
		// 	childNodes
		// 	attributes
		// 	sibling traversal
		// 	behave like an array, at any/all levels
		
		// If we copy DOM API, will it be confusing? 
		// get children
		// byId lookup
		
		// byType|Family|Tag|Attribute collections
		// componentRegistry
		// 	decorates accessors/mutators to ensure it gets notified when stuff is created/moved/deleted

		// var thing = {id: "thing"},
		// 	one = {id: "one"}, 
		// 	two = {id: "two"}, 
		// 	three = {id: "three"}, 
		// 	four = {id: "four"};
		// 
		// define("KeyedArray is Array-like", function(){
		// 	it("creates object with the correct number of members", function() {
		// 		var emptyKeyed = new KeyedArray(), 
		// 			oneKeyed = new KeyedArray({id: "one"}), 
		// 			fourKeyed = new KeyedArray({id: "one"}, {id: "two"}, {id: "three"}, {id: "four"});
		// 
		// 		expect(emptyKeyed.length).toBeDefined();
		// 		expect(emptyKeyed.length).toEqual(1);
		// 		expect(oneKeyed.length).toEqual(1);
		// 		expect(fourKeyed.length).toEqual(4);
		// 	});
		// 	it("has index-addressable members", function() {
		// 		var oneKeyed = new KeyedArray({id: "one"}),
		// 			fourKeyed = new KeyedArray({id: "one"}, {id: "two"}, {id: "three"}, {id: "four"});
		// 
		// 		expect(emptyKeyed[0]).toBeDefined();
		// 		expect(emptyKeyed[0].id).toEqual("one");
		// 		expect(emptyKeyed[3].i).toEqual("three");
		// 	});
		// 	
		// 	it("preserves correct order", function() {
		// 		var fwdKeyed = new KeyedArray({id: "one"}, {id: "two"}, {id: "three"}, {id: "four"}), 
		// 			backwdKeyed = new KeyedArray({id: "four"}, {id: "three"}, {id: "two"}, {id: "one"});
		// 			
		// 		expect(fwdKeyed[0].id).toEqual("one");
		// 		expect(fwdKeyed[3].id).toEqual("four");
		// 		expect(backwdKeyed[0].id).toEqual("four");
		// 		expect(backwdKeyed[3].id).toEqual("one");
		// 	});
		// 
		// 	it("pushes just like an array", function() {
		// 		var emptyKeyed = new KeyedArray(), 
		// 			emptyAr = new Array(),
		// 			populatedKeyed = new KeyedArray(one, two, three, four), 
		// 			populatedAr = new Array(one, two, three, four);
		// 		
		// 		expect(emptyKeyed.push(thing)).toEqual(emptyAr.push(thing));
		// 		expect(emptyKeyed.length).toEqual(emptyAr.length);
		// 		expect(emptyKeyed.push(one, two)).toEqual(emptyAr.push(one, two));
		// 		expect(emptyKeyed.length).toEqual(emptyAr.length);
		// 		expect(populatedKeyed.push(thing)).toEqual(populatedAr.push(thing));
		// 		expect(populatedKeyed.length).toEqual(populatedAr.length);
		// 	});
		// 
		// 	it("pops just like an array", function() {
		// 		var emptyKeyed = new KeyedArray(), 
		// 			emptyAr = new Array(),
		// 			populatedKeyed = new KeyedArray(one, two, three, four), 
		// 			populatedAr = new Array(one, two, three, four);
		// 		
		// 		expect(emptyKeyed.pop()).toEqual(emptyAr.pop());
		// 		expect(emptyKeyed.length).toEqual(emptyAr.length);
		// 		expect(populatedKeyed.pop()).toEqual(populatedAr.pop());
		// 		expect(populatedKeyed.length).toEqual(populatedAr.length);
		// 	});
		// 
		// 	it("shifts just like an array", function() {
		// 		var emptyKeyed = new KeyedArray(), 
		// 			emptyAr = new Array(),
		// 			populatedKeyed = new KeyedArray(one, two, three, four), 
		// 			populatedAr = new Array(one, two, three, four);
		// 		
		// 		expect(emptyKeyed.shift()).toEqual(emptyAr.shift());
		// 		expect(emptyKeyed.length).toEqual(emptyAr.length);
		// 		expect(populatedKeyed.shift()).toEqual(populatedAr.shift());
		// 		expect(populatedKeyed.length).toEqual(populatedAr.length);
		// 	});
		// 
		// });
	});
	
});
