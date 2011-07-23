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
		console.log("collidable");
	},{
		// summary: 
		// 	mixin for things that need collision behavior
		// 	ghosty things simply don't add the Collidable trait
		
		// shape: the shape of the bounding area we use to calculate intersection and collision
		// only support box (rectangle) for now, maybe circle/triangle/polygon another day
		collisionShape: 'box',

		// group: the name/id of the collision group this entity belongs to
		// membership of a collision group determines which kinds of objects we can/cant collide with
		collisionGroup: ''
	});

	// Players, Tiles, Doodads, Actors
	// Swords, Enemies, Grass, Enemy Projectile, Enemy Blocker, 
	// Collectables

	return collision; 
});