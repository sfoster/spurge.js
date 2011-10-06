define(['lib/Compose'], function(Compose){

	describe("Compose", function() {
		// Compose should: 

		define("Compose simple usage", function(){
			it("can compose simple instances with Compose.create", function() {
				var ob1 = Compose.create({ id: 1 }), 
					 ob2 = Compose.create({ id: 1 }, { type: 2 });

				expect(ob1).toBeTruthy();
				expect(ob1.id).toEqual(1);
				expect(ob2.id).toEqual(1);
				expect(ob2.type).toEqual(2);
			});
			
			it("can define and instantiate a simple class", function() {
				var Clz = Compose({ type: "clz" }),
					ob1 = new Clz(), 
					ob2 = new Clz({ id: 1, type: "foo"});
					
				expect(ob1).toBeTruthy();
				expect(ob1.type).toEqual("clz"); // from the prototype
				expect(ob2.type).toEqual("clz"); // no mixin, so from the prototype
				expect(ob2.id).toBeUndefined();
			});
			
			it("can use Compose to mix in properties at instantiation", function() {
				var Clz = Compose(Compose, { type: "clz" })
					ob1 = new Clz(), 
					ob2 = new Clz({ id: 1, type: "foo"})

				expect(ob1.type).toEqual("clz"); // from the prototype
				expect(ob2.type).toEqual("foo"); // mixed in
				expect(ob2.id).toEqual(1); // mixed in
			});

			it("picks up properties from the prototype before the ctor fires", function() {
				var result;
				// ctor then prototype
				var C1 = Compose(function(args){
					console.log("C1 ctor, this.name: ", this.name);
					result = this.name;
				}, { 
					name: "protoname" 
				});
				var o1 = new C1;
				console.log("o1: ", o1);
				expect(result).toEqual("protoname");

				// prototype then ctor
				var C2 = Compose({ 
					name: "protoname" 
				}, function(args){
					console.log("C2 ctor, this.name: ", this.name);
					result = this.name;
				});
				var o2 = new C2;
				console.log("o2: ", o2);
				expect(result).toEqual("protoname");

			});
			

			it("Mixin and ctor happen in the order supplied", function() {
				var result;
				// mixin then ctor then prototype
				var A = Compose(Compose, function(args){
					console. log("A ctor, this.name: ", this.name);
					result = this.name;
				}, { 
					name: "protoname" 
				});
				var a1 = new A;
				expect(result).toEqual("protoname");

				var a2 = new A({ name: "argname" });
				expect(result).toEqual("argname");

				// ctor then mixin then prototype
				var B = Compose(function(args){
					console. log("B ctor, this.name: ", this.name);
					result = this.name;
				}, Compose, { 
					name: "protoname" 
				});
				var b1 = new B;
				expect(result).toEqual("protoname");

				var b2 = new B({ name: "argname" });
				expect(result).toEqual("protoname");
				// the mixin happens after the ctor in this arrangement
				expect(b2.name).toEqual("argname");

				// ctor then prototype then mixin
				var C = Compose(function(args){
					console. log("C ctor, this.name: ", this.name);
					result = this.name;
				}, { 
					name: "protoname" 
				}, Compose);
				var c1 = new C;
				expect(result).toEqual("protoname");

				var c2 = new C({ name: "argname" });;
				expect(result).toEqual("protoname");
				// the mixin happens after the ctor in this arrangement
				expect(c2.name).toEqual("argname");
			});

			it("does fire multiple constructors in the correct order", function() {
				var result = [];
				var A = Compose(
					function(args){
						result.push(1);
					},
					function(args){
						result.push(2);
					},
					function(args){
						result.push(3);
					}
				);
				var a1 = new A;
				expect(result.join('')).toEqual('123');
			});

		});

		define("Compose inheritance", function(){
			// can create subclass
			// does fire ctor function in both super and subclass
			// does fire multiple ctors in both super and subclass

			if("can create subclass", function(){
				var A = Compose({
					a: true
				});
				var B = Compose({
					b: true
				});
				var C = Compose(A, B);
				
				var abc = new C;
				expect(abc.a).toBeDefined();
				expect(abc.b).toBeDefined();
			});

			if("subclass ctors fire in the expected sequence", function(){
				result = '';
				var A = Compose(function(){
					result +='a';
				}, {
					a: true
				});
				var B = Compose(function(){
					result +='b';
				},{
					b: true
				});
				var AB = Compose(A, B);
				var BA = Compose(B, A);
				var ABF = Compose(A, B, function(){
					result +='f';
				});
				
				var ab = new AB;
				expect(result).toEqual('ab');
				result = '';

				var ab = new BA;
				expect(result).toEqual('ba');
				result = '';

				var abf = new ABF;
				expect(result).toEqual('abf');
				result = '';
			});

		});
	});
	
});
