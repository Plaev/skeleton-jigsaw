ig.module('game.entities.shooter')
.requires('impact.entity')
.defines(function () {

	EntityShooter = ig.Entity.extend({
		size: {x: 8, y: 16},

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.FIXED,

		animSheet: new ig.AnimationSheet('media/shooter.png', 8, 16),

		flip: false,
		canShoot: false,

		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.shootTimer = new ig.Timer(2);
			this.shootWaitTimer = new ig.Timer(2);
			this.addAnim('idle', 1, [0]);
			this.addAnim('shooting', 1, [1]);
		},

		update: function () {
			if (this.shootWaitTimer.delta() > 0) {
				this.canShoot = true;
			} else if (this.shootWaitTimer.delta() > -10){
				this.currentAnim = this.anims.idle;
			}

			if (this.canShoot && this.shootTimer.delta() > 0) {
				this.canShoot = false;
				this.shootWaitTimer.set(2);
				this.shootTimer.set(2);
				this.currentAnim = this.anims.shooting;
				ig.game.spawnEntity( EntityFireball, this.pos.x+(this.flip ? 10 : -10), this.pos.y+5, {flip:this.flip} );
			}

			this.currentAnim.flip.x = this.flip;
			this.parent();
		},

		check: function( other ) {
			// Just a workaround to remove the bones...
			if (other.bounceCounter === 0) {
				other.kill();
			}
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
			this.addAnim( 'idle', 1, [0] );
		},

		update: function () {
			this.parent();
		},

		handleMovementTrace: function( res ) {
			this.parent( res );
			if( res.collision.x || res.collision.y ) {
				this.kill();
			}
		},

		check: function( other ) {
			other.receiveDamage( 10, this );
			this.kill();
		}
	});
});
