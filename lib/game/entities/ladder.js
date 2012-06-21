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

ig.module('game.entities.ladder')
.requires('impact.entity')
.defines(function(){
	EntityLadder = ig.Entity.extend({
		size: { x: 8, y: 64 },
		_wmScalable: true,
		_wmDrawBox: true,
		_wmBoxColor: 'rgba(150, 150, 255, 0.7)',
		ladderSpeed: 65,

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.BOTH,
		collides: ig.Entity.COLLIDES.LITE,
		init: function (x, y, settings) {
			this.parent(x, y, settings);
	 	},

		check: function (other) {
			other.standing = true;

			if (other.ladderReleaseTimer) { // if entity has this timer, then it has the ability to climb
				other.canClimb = true;  // entity is touching ladder, so climbing is an option if up or down movement

				// ladderReleaserTimer almost up, so grab on to ladder
				if (other.ladderReleaseTimer.delta() > -0.1) {
					if (other.vel.y < 0 && other.momentumDirection.y !=-1) { // moving upwards, by jumping
						other.isClimbing = true;
					} else {
						if (other.isClimbing && other.momentumDirection.y !=0 ) {
							if (other.ladderSpeed) this.ladderSpeed = other.ladderSpeed;
							other.vel.y = this.ladderSpeed * other.momentumDirection.y; // 1, 0 or -1
						} else {
							// not climbing, but stick to ladder while falling or jumping to it
							other.momentumDirection.y = 0;
							other.vel.y = 0;
							other.pos.y = other.last.y // avoid movement due to system delay
						}

						//avoid climbing in place if at bottom of ladder
						if (other.momentumDirection.y == 1 && other.pos.y == other.last.y) {
							other.momentumDirection.y = 0;
							other.isClimbing=false;
						}
					}
				}
			}
		}
	});
});
