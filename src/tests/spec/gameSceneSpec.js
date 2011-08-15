define(['game/Scene', 'tests/sceneTestConfig'], function(Scene, config){

	describe("game/Scene", function() {
		var scene;
		beforeEach(function() {
			scene = new Scene();
			console.log("game/Scene spec beforeEach, scene instance created");
		});

		it("should instantiate ok", function() {
			expect(scene).toBeTruthy();
		});

	});
	describe("game/Scene+init", function() {
		var scene;

		beforeEach(function() {
			scene = new Scene();
			console.log("game/Scene+init spec beforeEach, scene instance created");
			scene.config = config;
			if(scene.init){
				scene.init();
				console.log("spec beforeEach, scene initd");
			}
		});

		it("should manage an entity by-id lookup", function() {
			expect(scene.entities).toBeDefined()
		});

		it("should expose the entity registry to any of its components", function() {
			expect(scene.entities.add).toBeDefined();
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
