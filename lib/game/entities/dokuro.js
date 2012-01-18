ig.module('game.entities.dokuro')
.requires('impact.entity')
.defines(function() {

	EntityDokuro = ig.Entity.extend({
		offset: {y:0, x:1},
		size: {y:20, x:14},

		maxVel: {x: 100, y: 200},
		friction: {x: 600, y: 0},

		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,
		check: function(other){
			if( ig.input.pressed('item') ) {
				this.holding = other;
			}
		},

		animSheet: new ig.AnimationSheet('media/dokuro.png', 16, 20),

		// These are our own properties. They are not defined in the base
		// ig.Entity class. We just use them internally for the Player
		accelGround: 400,
		accelAir: 500,
		jump: 150,
		flip: false,

		holding: null,

		init: function(x, y, settings) {
			this.parent(x, y, settings);

			// Add the animations
			this.addAnim('idle', 1, [0, 1]);
			this.addAnim('run', 0.07, [3, 4, 5, 4, 3]);
			this.addAnim('jump', 1, [6]);
			this.addAnim('fall', 0.4, [7]);
		},

		update: function() {
			// move left or right
			var accel = this.standing ? this.accelGround : this.accelAir;
			if (ig.input.state('left')) {
				this.accel.x = -accel;
				this.flip = true;
			} else if (ig.input.state('right')) {
				this.accel.x = accel;
				this.flip = false;
			} else {
				this.accel.x = 0;
			}

			// jump
			if (this.standing && ig.input.pressed('jump')) {
				this.vel.y = -this.jump;
			}

			// set the current animation, based on the player's speed
			if (this.vel.y < 0) {
				this.currentAnim = this.anims.jump;
			} else if (this.vel.y > 0) {
				this.currentAnim = this.anims.fall;
			} else if (this.vel.x != 0) {
				this.currentAnim = this.anims.run;
			} else {
				this.currentAnim = this.anims.idle;
			}

			this.currentAnim.flip.x = this.flip;

			if( this.holding != null ){
				if( ig.input.pressed('item') ){
					this.throwItem();
				} else {
					this.holding.pos.x = this.pos.x;
					this.holding.pos.y = this.pos.y - 15;
				}
			}

			// move!
			this.parent();
		},

		throwItem: function(){
			if( this.currentAnim.flip.x ){
				this.holding.pos.x -= 15;
				this.holding.pos.y -= 10;
			} else {
				this.holding.pos.x += 15;
				this.holding.pos.y -= 10;
			}
			this.holding = null;
		}
	});
});
