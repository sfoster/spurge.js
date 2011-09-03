define(['lib/Graph'], function(Graph){

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
		describe("Attachment", function(){
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
		describe("Detachment", function(){
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
		describe("Graph heirarchy", function(){
			var graph = new Graph(), 
				graphRegistry = graph.registry, 
				graphRoot = graph.rootComponent;
				
			["thing0", "thing1", "thing2"].forEach(function(name, idx){
				graphRoot.attachComponent(new graph.Component({
					id: name, type: idx % 2 ? "odd" : "even"
				}))
			});

			it("registered top-level components", function() {
				expect(
					graphRegistry.byId("thing0") &&
					graphRegistry.byId("thing1") &&
					graphRegistry.byId("thing2")
				).toBeTruthy();
			});
			
			["cthing0", "cthing1", "cthing2"].forEach(function(name, idx){
				graphRegistry.byId("thing0").attachComponent(new graph.Component({
					id: name, type: idx % 2 ? "odd" : "even"
				}))
			});
			
			it("registered child components", function() {
				expect(
					graphRegistry.byId("cthing0") &&
					graphRegistry.byId("cthing1") &&
					graphRegistry.byId("cthing2")
				).toBeTruthy();
			});
			it("created the correct heirarchy", function() {
				expect(
					graphRoot.childComponents.length
				).toEqual(3);

				expect(
					graphRoot.childComponents[0].id
				).toEqual("thing0");

				expect(
					graphRoot.childComponents[0].childComponents.length
				).toEqual(3);

				expect(
					graphRoot.childComponents[1].childComponents.length
				).toEqual(0);
				
				expect(
					graphRoot.childComponents[0].childComponents.componentId
				).toEqual("thing0");

			});
			describe("Graph traversal", function(){
				var count = 0, 
					oddCount = 0, 
					evenCount = 0;
				graph.traverse(function(comp){
					// console.log("callback with: ", comp.id, comp.type);
					count++;
					if(comp.type == "odd") {
						oddCount++;
					} else if(comp.type == "even") {
						evenCount++;
					}
				});
				expect( count ).toEqual(7); // 6 components + root
				expect( evenCount ).toEqual(4); // idx 0,2 of thing, cthing components
				expect( oddCount ).toEqual(2); // idx 1 of thing, cthing components
			});
			
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
