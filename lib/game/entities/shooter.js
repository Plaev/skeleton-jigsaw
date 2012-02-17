ig.module('game.entities.shooter')
.requires('impact.entity')
.defines(function () {

	EntityShooter = ig.Entity.extend({
		size: {y: 8, x: 8},

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,
		check: function (other) {
			if (ig.input.pressed('item')) {
				this.holding = other;
			}
		},

		animSheet: new ig.AnimationSheet('media/shooter.png', 8, 16),

		flip: false,

		init: function (x, y, settings) {
			this.parent(x, y, settings);

			// Add the animations. No animations for now
			// this.addAnim('idle', 1, [0, 1]);
		},

		update: function () {

			// shoot
			if( ig.input.pressed('shoot') ) {
				ig.game.spawnEntity( EntityFireball, this.pos.x, this.pos.y, {flip:this.flip} );
			}

			this.currentAnim.flip.x = this.flip;
			this.parent();
		}
	});

	EntityFireball = ig.Entity.extend({
		size: {x: 6, y: 6},

		bounciness: 0.6,

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,

		animSheet: new ig.AnimationSheet( 'media/fireball.png', 6, 6 ),

		bounceCounter: 0,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );

			this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
			this.vel.y = -50;
			this.addAnim( 'idle', 0.2, [0,1] );
		},

		handleMovementTrace: function( res ) {
			this.parent( res );
			if( res.collision.x || res.collision.y ) {

				// only bounce 3 times
				this.bounceCounter++;
				if( this.bounceCounter > 3 ) {
					this.kill();
				}
			}
		},

		check: function( other ) {
			other.receiveDamage( 10, this );
			this.kill();
		}
	});
});