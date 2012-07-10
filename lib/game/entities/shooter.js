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

            if (!ig.game.actionLock) {
                ig.game.spawnEntity( EntityFireballX, this.pos.x+(this.flip ? 0 : -10), this.pos.y+5, options );
            }
        }
    });

    EntityFireball = ig.Entity.extend({
        gravityFactor: 0,
        maxVel: {x: 130, y: 130},

        kill_counter: 0,

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,

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

            if (settings.direction === "left") {
                this.vel.x = -this.maxVel.x;
                this.currentAnim = this.anims.moving;
                this.currentAnim.flip.x = true;
            } else {
                this.vel.x = this.maxVel.x;
                this.currentAnim = this.anims.moving;
            }

            this.parent( x, y, settings );
        },

        handleMovementTrace: function (res) {
            this.parent(res);

            if (res.collision.x || res.collision.y) {
                ig.game.spawnEntity(
                    EntityFireballXExplosion,
                    this.pos.x, this.pos.y,
                    {flip: this.currentAnim.flip.x}
                );
                this.kill();
            }
        }
    });

    EntityFireballY = EntityFireball.extend({
        size: {x: 6, y: 14},
        animSheet: new ig.AnimationSheet( 'media/fireball-y.png', 6, 14 ),

        init: function( x, y, settings ) {
            this.addAnim( 'moving', 0.1, [0, 1, 2, 3, 4, 5] );

            if (settings.direction === "up") {
                this.vel.y = -this.maxVel.y;
                this.currentAnim = this.anims.moving;
            } else {
                this.vel.y = this.maxVel.y;
                this.currentAnim = this.anims.moving;
                this.currentAnim.flip.y = true;
            }
            this.parent( x, y, settings );
        },

        handleMovementTrace: function (res) {
            this.parent(res);

            if (res.collision.x || res.collision.y) {
                ig.game.spawnEntity(
                    EntityFireballYExplosion,
                    this.pos.x, this.pos.y,
                    {flip: !this.currentAnim.flip.y}
                );
                this.kill();
            }
        }

    });

    EntityFireballXExplosion = EntityFireball.extend({
        animSheet: new ig.AnimationSheet( 'media/fireball-x.png', 14, 6 ),

        init: function( x, y, settings ) {
            this.parent( x, y, settings );

            this.addAnim( 'hit', 0.05, [6, 7, 8, 9, 10, 11] );
            this.currentAnim = this.anims.hit;
            if ( settings.flip ) { this.currentAnim.flip.x = true; }
        },

        check: function() {
            // Don't kill dokuro
        },

        update: function() {
            this.parent();
            this.kill_counter++;
            if (this.kill_counter > 15) { this.kill(); }
        }
    });

    EntityFireballYExplosion = EntityFireball.extend({
        animSheet: new ig.AnimationSheet( 'media/fireball-y.png', 6, 14 ),

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'hit', 0.05, [6, 7, 8, 9, 10, 11] );
            this.currentAnim = this.anims.hit;
            if ( settings.flip ) { this.currentAnim.flip.y = true; }
        },

        check: function() {
            // Don't kill dokuro
        },

        update: function() {
            this.parent();
            this.kill_counter++;
            if (this.kill_counter > 15) { this.kill(); }
        }
    });
});
