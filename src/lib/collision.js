define([
		'lib/lang',
		'lib/Compose',
		'lib/entity',
		'lib/state',
	], function (lang, Compose, entity, Stateful){

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
		registerMember: function(ent, name){
			var group = this.__groupsByName[name], 
				entId = ent.id || ent;
			if(!group) {
				throw new Exception("Cant register member "+entId+" of non-existent group:" + name);
			} else {
				console.log("Registering collidable entity "+entId+" in group: " + name);
				group.members.push(entId);
			}
		},
		rectsOverlap: function(x0, y0, w0, h0, x2, y2, w2, h2) {
			// x/y, width, height of rectangle 1
			// x/y, width, height of rectangle 2
			
			// left edge of box1 is right of right edge of box2
			// right edge of box1 is left of left edge of box2
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
		name: "Actors",
		description: "All active (non-player?) entities (i.e. the do or can move)",
		collidesWith: ["Actors"]
	});

	var blockerGroup = new collision.Group({
		name: "Blockers",
		description: "Passive, non-player entities like walls, obstacles",
		collidesWith: ["Actors"]
	});

	collision.registerGroup(actorsGroup.name, actorsGroup);
	collision.registerGroup(blockerGroup.name, blockerGroup);

	collision.Collidable = Compose({
		// summary: 
		// 	mixin for things that need collision behavior
		// 	ghosty things simply don't add the Collidable trait
		
		// shape: the shape of the bounding area we use to calculate intersection and collision
		// only support box (rectangle) for now, maybe circle/triangle/polygon another day
		collisionShape: 'box',

		// group: the name/id of the collision group this entity belongs to
		// membership of a collision group determines which kinds of objects we can/cant collide with
		collisionGroup: '', 
		
		checkForCollisions: function(){
			// get a list of all entities in my collision group I might collide with
			var groupName = this.collisionGroup, 
			 	group = groupName && collision.getGroup(this.collisionGroup), 
				self = this,
				rectsOverlap = collision.rectsOverlap, 
				registry = entity.registry;
				
			// console.log(this.id + " checkForCollisions in group: " + groupName);
			if(group) {
				var entities = [];
				lang.forEach(group.collidesWith, function(name){
					var targGroup = collision.getGroup(name),
					 	members = targGroup.members,
						ent = null;
					for(var i=0,len=members.length; i<len; i++){
						ent = registry[members[i]];
						if(!ent || ent == self) continue;
						var boxArgs = [self.x, self.y, self.width, self.height,
						ent.x, ent.y, ent.width, ent.height];
						if(rectsOverlap.apply(null, boxArgs)){
							console.log("overlap!", self, ent);
							ent.onHit && ent.onHit(self);
							self.onHit && self.onHit(ent);
						}
					}
				});
			}
		},
		
		isBoundaryOverlap: function(box1, box2) {
			var left1, left2, 
				right1, right2, 
				top1, top2, 
				bottom1, bottom2;
			
			// box: {
			// 	x: int px offset from left
			// 	y: int px offset from top
			// 	width: int px tile/sprite width
			// 	height: int px tile/sprite height
			// 	xOffset: optional offset from x, x+width for the collision
			// 	yOffset: optional offset from y, y+height for the collision
			// }

			left1 = box1.x + (box1.xOffset || 0);
			left2 = box2.x + (box2.xOffset || 0);
			right1 = left1 + box1.width;
			right2 = left2 + box2.width;
			top1 = box1.y + (box1.yOffset || 0);
			top2 = box2.y + (box1.yOffset || 0);
			bottom1 = top1 + box1.height;
			bottom2 = top2 + box2.height;

			if (bottom1 < top2) return true;
			if (top1 > bottom2) return true;

			if (right1 < left2) return false;
			if (left1 > right2) return false;

			return true;
		},

		onHit: function(/*hitee*/ent){
			// do something when a collision occurs
		}
	}, function(){
		console.log("Collidable constructor, collisionGroup", this.collisionGroup, this);
		if(this.collisionGroup){
			collision.registerMember(this, this.collisionGroup);
		}
	});

	// Players, Tiles, Doodads, Actors
	// Swords, Enemies, Grass, Enemy Projectile, Enemy Blocker, 
	// Collectables

	return collision; 
});