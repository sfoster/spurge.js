define(['lib/lang', 'lib/Compose'], function(lang, Compose){
	window.lang = lang;
	describe("lang.KeyedArray", function() {
		var karray;
		beforeEach(function() {
			karray = new lang.KeyedArray(
				{
					id: "thing1"
				}, 
				{
					id: "thing2"
				}, 
				{
					id: "thing3"
				}
			);
		});

		it("should instantiate ok", function() {
			expect(karray).toBeTruthy();
		});

		it("should push like an array", function() {
			karray.push({
				id: "pushed"
			});
			expect(karray.length).toEqual(4);
			expect(karray[3].id).toEqual("pushed");
			expect(karray.byId("pushed")).toBeTruthy();
		});
		it("should pop like an array", function() {
			var entry = karray.pop();
			expect(karray.length).toEqual(2);
			expect(entry).toBeTruthy();
			expect(entry.id).toEqual("thing3");
			expect(karray.byId("thing3")).toBeUndefined();
		});
		it("should shift like an array", function() {
			var entry = karray.shift();
			expect(karray.length).toEqual(2);
			expect(entry).toBeTruthy();
			expect(entry.id).toEqual("thing1");
			expect(karray.byId("thing1")).toBeUndefined();
		});
		it("should unshift like an array", function() {
			karray.unshift({
				id: "unshifted"
			});
			expect(karray.length).toEqual(4);
			expect(karray[0].id).toEqual("unshifted");
			expect(karray.byId("unshifted")).toBeTruthy();
		});
		it("should remove from array and byId lookup", function() {
			var entry = karray.byId("thing2");
			karray.remove(entry);
			expect(karray.length).toEqual(2);
			expect(karray.byId("thing2")).toBeUndefined();
			expect(karray[1].id).toEqual("thing3");
		});
		it("should concat like an array", function() {
			var more = new lang.KeyedArray({ id: "more1" }, { id: "more2" });
			var combined = karray.concat(more);
			// check the original is unchanged
			expect(karray.length).toEqual(3);
			// check the output looks right
			expect(combined.length).toEqual(5);
			expect(combined[3].id).toEqual("more1");
			expect(combined[4].id).toEqual("more2");
		});
		it("should splice like an array", function() {
			// check the array is as expected
			var removed; 
			expect(karray.length).toEqual(3);
			
			// check removing elements with splice
			removed = karray.splice(0, 1);
			// check the result looks right
			expect(karray.length).toEqual(2);
			expect(removed.length).toEqual(1);
			expect(removed[0].id).toEqual("thing1");
			expect(karray.byId("thing1")).toBeFalsy();

			// check replacing elements with splice
			removed = karray.splice(0, 1, { id: "new1"}, { id: "new2"});
			// check the result looks right
			expect(removed.length).toEqual(1);
			expect(removed[0].id).toEqual("thing2");
			expect(karray.length).toEqual(3);
			expect(karray[0].id).toEqual("new1");
			expect(karray[1].id).toEqual("new2");
		});
		it("should track length like an array", function() {
			var len = karray.length;
			expect(len).toBeDefined();
			karray.push({id: "foo"}, {id: "foo2"});
			expect(karray.length).toEqual(len + 2);
			karray.unshift({id: "foo3"});
			expect(karray.length).toEqual(len+3);

			karray.pop();
			expect(karray.length).toEqual(len+2);
			karray.shift();
			expect(karray.length).toEqual(len+1);

			karray.splice(0, 1);
			expect(karray.length).toEqual(len);
		});

		it("should subclass and still work like an array", function() {
			var pushed = false;
			var myarray = Compose.create(lang.KeyedArray, {
				push: Compose.before(function(){
					pushed = true;
				})
			}, function(){
				this.declaredClass = "MyArray";
			});

			expect(myarray.length).toEqual(0);
			
			myarray.push({id: "foo"}, {id: "foo"});
			
			expect(myarray.length).toEqual(2);
		});
		

	});
});