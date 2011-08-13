define(['lib/Scene'], function(Scene){

  describe("game/Scene", function() {
    var scene;

    beforeEach(function() {
      scene = new Scene();
    });

    it("should instantiate ok", function() {
      expect(scene).toBeTruthy();
    });

    it("should fire enter when entering the active state", function() {
      spyOn(scene, 'enter');
      scene.enterState('active');
      expect(scene.enter).toHaveBeenCalled();
    });

    it("should manage an entity registry", function() {
      expect(scene.entityRegistry).toBeDefined()
    });

    it("should expose the entity registry to any of its components", function() {
      expect(scene.entityRegistry).toBeDefined()
    });

    it("should manage scene-level behaviors", function() {
      expect(scene.behaviors).toBeDefined()
    });

  });
  
});
