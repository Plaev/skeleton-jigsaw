/**
	Ladder entity for ImpactJS (http://www.impactjs.com)

	@version 1.0 - 2012-04-03
	@author Justin Stahlman ( @stahlmanDesign )

	@description

    // An entity that can use a ladder must declare these variables:

    canClimb: false,
    isClimbing: false,
    momentumDirection: {'x':0,'y':0},
    ladderReleaseTimer: new ig.Timer(0.0),
    ladderSpeed: 75 // optional

    //see example player entity to understand implementation
    //remember to require in main.js ---> 'game.entities.ladder'
*/

ig.module(
	'game.entities.ladder'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityLadder = ig.Entity.extend({
		size: { x: 8, y: 64 },
		_wmScalable: true,
		_wmDrawBox: true,
		_wmBoxColor: 'rgba(150, 150, 255, 0.7)',
		ladderSpeed: 65, // default. Override in weltmeister to affect an individual ladder (maybe vines are slower), or set in entity to determine its own climb speed

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.LITE,
		init: function (x, y, settings) {
			this.parent(x, y, settings);
		},
		update: function () {
			//player must have lower zIndex and sortEntitiesDeferred must be called in order for this to work

			var player = ig.game.getEntitiesByType(EntityDokuro)[0];
			if (player){
				player.canClimb = false; // reset every frame in case you leave ladder. Allows to walk across/atop ladder
			}

		},
		check: function (other) {
			other.standing = true;

			if (other.ladderReleaseTimer) { // if entity has this timer, then it has the ability to climb
				other.canClimb = true;  // entity is touching ladder, so climbing is an option if up or down movement

				// ladderReleaserTimer almost up, so grab on to ladder
				if (other.ladderReleaseTimer.delta() > -0.1) {

					if (other.vel.y < 0 && other.momentumDirection.y !=-1) { // moving upwards, by jumping
						other.isClimbing = true;
					}
					else{
						if (other.isClimbing && other.momentumDirection.y !=0 ) {
							// move

							// if entity has a ladderSpeed variable, use it, otherwise use default
							if (other.ladderSpeed) this.ladderSpeed = other.ladderSpeed;

							// moves player up or down depending on momentumDirection
							other.vel.y = this.ladderSpeed * other.momentumDirection.y; // 1, 0 or -1
						}
						else {
							// not climbing, but stick to ladder while falling or jumping to it
							other.momentumDirection.y = 0;
							other.vel.y = 0;
							other.pos.y = other.last.y // avoid movement due to system delay

							// uncomment to always show climbing animation while on ladder,
							// or leave comment to allow standing/walking atop ladder, and jumping animation (not climbing) when jumping past a ladder
							// if (other.canClimb == true && other.momentumDirection.y == 0)other.isClimbing = true;
						}


						//avoid climbing in place if at bottom of ladder
						if (other.momentumDirection.y == 1 && other.pos.y == other.last.y) {
							console.log("get off at bottom of ladder")
							other.momentumDirection.y = 0;
							other.isClimbing=false;
						}
					}
				}else{
					// ladderReleaseTimer < -0.1, so is jumping off or through ladder, so ignore it
				}
			}
			else{
				// entity does not have ladder timer (maybe it only flies or swims, or is a trigger or mover), so ignore ladder
			}
		}
	});
});
