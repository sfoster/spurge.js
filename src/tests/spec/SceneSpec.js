define(['lib/Scene'], function(Scene){

  describe("Scene", function() {
    var scene;

    beforeEach(function() {
      scene = new Scene();
    });

    it("should instantiate ok", function() {
      expect(scene).toBeTruthy();
    });

    it("entering active state should fire enter", function() {
      spyOn(scene, 'enter');
      scene.enterState('active');
      expect(scene.enter).toHaveBeenCalled();
    });

  });
  
});
