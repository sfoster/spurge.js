define(['lib/Scene', 'tests/sceneTestConfig'], function(Scene, config){

  describe("Scene", function() {
	var scene;

	beforeEach(function() {
		scene = new Scene();
		console.log("SceneSpec: assigning config to scene");
		scene.config = config;
		scene.init && scene.init();
	});

    it("should instantiate ok", function() {
      expect(scene).toBeTruthy();
    });

    it("should know nothing of entity management", function() {
      expect(scene.entityRegistry).toBeFalsy();
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
