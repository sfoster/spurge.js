define([
		'lib/lang',
		'lib/Compose',
		'lib/state'
	], function (lang, Compose, Stateful){
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
		circlesOverlap: function(p1, r1, p2, r2) {
			var a = r1 + r2,
				dx = p1.x - p2.x, 
				dy = p1.y - p2.y;
			return a * a > (dx * dx + dy * dy);
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
		    return true;
		}, 
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

	var actorsGroup = collision.actorsGroup = new collision.Group({
		name: "Actors",
		description: "All active (non-player?) entities (i.e. the do or can move)",
		collidesWith: ["Actors"]
	});

	var blockerGroup = collision.blockerGroup = new collision.Group({
		name: "Blockers",
		description: "Passive, non-player entities like walls, obstacles",
		collidesWith: ["Actors"]
	});

	collision.Manager = Compose(Compose, function(){
	  // 
	}, {
		__groupsByName: {},
		init: function(props){
		  console.log("collision.Manager init");
		  props = props || {};
		  if(this.entityRegistry) {
		    // 
		  } else if(props.registry){
  		  this.entityRegistry = props.registry;
		  } else {
		    throw new Error("collision must init with an entity registry object");
		  }
		  this._registerDefaultGroups();
		  return this;
		},
		_registerDefaultGroups: function(){
    	this.registerGroup(actorsGroup.name, actorsGroup);
    	this.registerGroup(blockerGroup.name, blockerGroup);
    	
		},
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
	});

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
		
		checkForCollisions: function(manager){
			// get a list of all entities in my collision group I might collide with
			// console.log("checkForCollisions got manager: ", manager);
			var groupName = this.collisionGroup, 
			 	group = groupName && manager.getGroup(this.collisionGroup), 
				self = this,
				selfPoint = {
					x: self.x + (self.width/2),
					y: self.y + (self.height/2),
					r: self.width/2
				},
				registry = manager.entityRegistry,
				hasOverlap = collision.circlesOverlap, 
				collidedAlready = {};
				
			// console.log(this.id + " checkForCollisions in group: " + groupName);
			// TODO: currently, x => y and y => x will be checked
			if(group) {
				var entities = [];
				lang.forEach(group.collidesWith, function(name){
					var targGroup = manager.getGroup(name),
					 	members = targGroup.members,
						ent = null;
					for(var i=0,len=members.length; i<len; i++){
						ent = [members[i]];
						// skip entities we've already check in this loop (members of >1 groups?)
						if(!ent || ent == self || collidedAlready[ent.id]) {
							continue;
						}
						// var boxArgs = [self.x, self.y, self.width, self.height,
						// ent.x, ent.y, ent.width, ent.height];
						var circleArgs = [
							selfPoint, selfPoint.r,
							{ 
								x: ent.x + (ent.width/2),
								y: ent.y + (ent.height/2)
							}, Math.max(ent.width, ent.height)/2
						];
						if(hasOverlap.apply(null, circleArgs)){
							ent.onHit && ent.onHit(self);
							collidedAlready[ent] = true;
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
	});
  
	// Players, Tiles, Doodads, Actors
	// Swords, Enemies, Grass, Enemy Projectile, Enemy Blocker, 
	// Collectables

	return collision; 
});