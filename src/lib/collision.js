define([
		'lib/lang',
		'lib/Compose',
		'lib/entity',
		'lib/state',
	], function (lang, Compose, ent, Stateful){

	var after = Compose.after, 
		before = Compose.before, 
		from = Compose.from;

	// entities can have collidable trait
	// collision groups are typically defined in the scene, or the game
	// an entity belongs to single group
	// during an update, we can check each group to determine if
	// there are collision-compatible group members that might collide

	// collision is the module exports object
	var collision = {
		__groupsByName: {},
		registerGroup: function(name, group){
			this.__groupsByName[name] = group;
			return this;
		},
		getGroup: function(name){
			return this.__groupsByName[name];
		}, 
		rectsOverlap: function(x0, y0, w0, h0, x2, y2, w2, h2) {
			// x/y, width, height of rectable 1
			// x/y, width, height of rectable 2
			
		    if( x0 > (x2 + w2) || (x0 + w0) < x2) {
				return false;
			}
		    if( y0 > (y2 + h2) || (y0 + h0) < y2) {
				return false;
			}
		    return true
		}
	};

	collision.Group = Compose(function(){
		this.members = [];
		this.collidesWith = [];
	}, Compose, {
		name: "",
		description: "",
		members: [],
		collidesWith: []
	});

	var actorsGroup = new collision.Group({
		id: "Actors",
		description: "All active (non-player?) entities (i.e. the do or can move)"
	});

	var blockerGroup = new collision.Group({
		id: "Blockers",
		description: "Passive, non-player entities like walls, obstacles"
	});

	collision.registerGroup(actorsGroup.name, actorsGroup);
	collision.registerGroup(blockerGroup.name, blockerGroup);

	collision.Collidable = Compose(function(){
		// console.log("collidable");
	},{
		// summary: 
		// 	mixin for things that need collision behavior
		// 	ghosty things simply don't add the Collidable trait
		
		// shape: the shape of the bounding area we use to calculate intersection and collision
		// only support box (rectangle) for now, maybe circle/triangle/polygon another day
		collisionShape: 'box',

		// group: the name/id of the collision group this entity belongs to
		// membership of a collision group determines which kinds of objects we can/cant collide with
		collisionGroup: '', 
		
		onHit: function(/*hitee*/entity){
			// do something when a collision occurs
		}
	});

	// Players, Tiles, Doodads, Actors
	// Swords, Enemies, Grass, Enemy Projectile, Enemy Blocker, 
	// Collectables

	return collision; 
});