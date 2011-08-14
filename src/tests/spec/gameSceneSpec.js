define(['game/Scene'], function(Scene){

	describe("game/Scene", function() {
		var scene, 
			config = {
				gameNode: {}
			};

		beforeEach(function() {
			scene = new Scene();
			console.log("game/Scene spec beforeEach, scene instance created");
			scene.config = config;
			if(scene.init){
				scene.init();
				console.log("spec beforeEach, scene initd");
			}
		});

		it("should instantiate ok", function() {
			expect(scene).toBeTruthy();
		});

		it("should manage an entity registry", function() {
			expect(scene.entityRegistry).toBeDefined()
		});

		it("should expose the entity registry to any of its components", function() {
			expect(scene.entityRegistry.add).toBeDefined();
		});

		it("should manage scene-level behaviors", function() {
			expect(scene.behaviors).toBeDefined()
		});

		it("should fire enter when entering the active state", function() {
			spyOn(scene, 'enter');
			scene.enterState('active');
			expect(scene.enter).toHaveBeenCalled();
		});

	});
	
});
