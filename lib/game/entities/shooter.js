ig.module('game.entities.shooter')
.requires('impact.entity')
.defines(function () {

	EntityShooter = ig.Entity.extend({
		size: {x: 8, y: 16},

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.FIXED,
		check: function (other) {
			if (ig.input.pressed('item')) {
				this.holding = other;
			}
		},

		animSheet: new ig.AnimationSheet('media/shooter.png', 8, 16),

		flip: false,
		canShoot: false,

		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.shootTimer = new ig.Timer(2);
			this.shootWaitTimer = new ig.Timer(2);
			this.addAnim('idle', 1, [0]);
		},

		update: function () {
			if (this.shootWaitTimer.delta() > 0) {
				this.canShoot = true;
			}

			if (this.canShoot && this.shootTimer.delta() > 0) {
				this.canShoot = false;
				this.shootWaitTimer.set(2);
				this.shootTimer.set(2);
				ig.game.spawnEntity( EntityFireball, this.pos.x-10, this.pos.y+5, {flip:this.flip} );
			}

			this.currentAnim.flip.x = this.flip;
			this.parent();
		}
	});

	EntityFireball = ig.Entity.extend({
		size: {x: 6, y: 6},
		maxVel: {x: 100, y: 0},

		gravityFactor: 0,

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,

		animSheet: new ig.AnimationSheet( 'media/fireball.png', 6, 6 ),

		init: function( x, y, settings ) {
			this.parent( x, y, settings );

			this.vel.x = (settings.flip ? this.maxVel.x : -this.maxVel.x);
			console.log(this.vel.x);

			this.addAnim( 'idle', 0.2, [0] );
		},

		update: function () {
			this.parent();
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
