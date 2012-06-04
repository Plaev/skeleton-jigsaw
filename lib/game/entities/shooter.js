ig.module('game.entities.shooter')
.requires('impact.entity')
.defines(function () {
	EntityShooter = ig.Entity.extend({
		size: {x: 8, y: 16},

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.FIXED,

		interval: 2,

		animSheet: new ig.AnimationSheet('media/shooter.png', 8, 16),

		flip: false,
		canShoot: false,

		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.shootTimer = new ig.Timer(this.interval);
			this.shootWaitTimer = new ig.Timer(this.interval);
			this.addAnim('idle', 1, [0]);
			this.addAnim('preshoot', 1, [1]);
			this.addAnim('shooting', 1, [2]);
			this.applyFlip(settings);
		},

		update: function () {
			if (this.shootWaitTimer.delta() > 0) {
				this.canShoot = true;
			} else if (this.shootWaitTimer.delta() > -0.5){
				this.currentAnim = this.anims.preshoot;
			} else {
				this.currentAnim = this.anims.idle;
			}

			if (this.canShoot && this.shootTimer.delta() > 0) {
				this.canShoot = false;
				this.shootWaitTimer.set(this.interval);
				this.shootTimer.set(this.interval);
				this.currentAnim = this.anims.shooting;
				this.shoot();
			}

			this.currentAnim.flip.x = this.flip;
			this.parent();
		},

		applyFlip: function (settings) {},

		shoot: function () {
			var options = {};
			if (this.flip) {
				options = {direction: "right", offset: {x:-2, y:0}};
			} else {
				options = {direction: "left", offset: {x:2, y:0}};
			}
			ig.game.spawnEntity( EntityFireballX, this.pos.x+(this.flip ? 0 : -10), this.pos.y+5, options );
		}
	});

	EntityFireball = ig.Entity.extend({
		gravityFactor: 0,
		maxVel: {x: 130, y: 130},

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,
		hit: false,

		update: function () {
            if (this.hit && this.currentAnim.loopCount > 0.5) { this.kill(); }
			this.parent();
		},

        handleMovementTrace: function (res) {
            this.parent(res);

            if (res.collision.x || res.collision.y) {
				this.currentAnim = this.anims.hit;
                this.hit = true;
            }
        },

		check: function( other ) {
			other.receiveDamage( 10, this );
			this.kill();
		}
	});

	EntityFireballX = EntityFireball.extend({
		size: {x: 14, y: 6},
		animSheet: new ig.AnimationSheet( 'media/fireball-x.png', 14, 6 ),

		init: function( x, y, settings ) {
			this.addAnim( 'moving', 0.1, [0, 1, 2, 3, 4, 5] );
			this.addAnim( 'hit', 0.1, [6, 7, 8, 9, 10, 11] );

			if (settings.direction === "left") {
				this.vel.x = -this.maxVel.x;
				this.currentAnim = this.anims.moving;
				this.currentAnim.flip.x = true;
			} else {
				this.vel.x = this.maxVel.x;
				this.currentAnim = this.anims.moving;
			}

			this.parent( x, y, settings );
		}
	});

	EntityFireballY = EntityFireball.extend({
		size: {x: 6, y: 14},
		animSheet: new ig.AnimationSheet( 'media/fireball-y.png', 6, 14 ),

		init: function( x, y, settings ) {
			this.addAnim( 'moving', 0.1, [0, 1, 2, 3, 4, 5] );
			this.addAnim( 'hit', 0.1, [6, 7, 8, 9, 10, 11] );

			if (settings.direction === "up") {
				this.vel.y = -this.maxVel.y;
				this.currentAnim = this.anims.moving;
			} else {
				this.vel.y = this.maxVel.y;
				this.currentAnim = this.anims.moving;
				this.currentAnim.flip.y = true;
			}
			this.parent( x, y, settings );
		}
	});
});
