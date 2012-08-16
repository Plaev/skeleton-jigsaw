ig.module('game.entities.dokuro')
.requires('impact.entity', 'game.entities.particle')
.defines(function() {

    EntityDokuro = ig.Entity.extend({
        offset: {y:0, x:1},
        size: {y:20, x:14},
        zIndex: 1,

        maxVel: {x: 100, y: 200},
        friction: {x: 600, y: 0},

        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet('media/dokuro.png', 16, 20),

        accelAir: 500,
        accelGround: 400,
        animating: false,
        climb: false,
        falling: false,
        flip: false,
        isClimbing: false,
        jump: 150,
        jump_count: 0,
        ladderReleaseTimer: new ig.Timer(0.0),
        ladderSpeed: 75,
        momentumDirection: {x:0, y:0},

        jump_sound: new ig.Sound( 'media/audio/jump.*' ),
        death_sound: new ig.Sound( 'media/audio/death.*' ),
        jumpfall_sound: new ig.Sound( 'media/audio/jumpfall.*' ),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0, 1]);
            this.addAnim('run', 0.07, [4, 5, 6, 5, 4]);
            this.addAnim('jump', 1, [8]);
            this.addAnim('fall', 0.4, [9,10]);
            this.addAnim('getIn', 0.4, [12,13,14,15]);
            this.addAnim('getOut', 0.4, [16,17,18,19]);
            this.addAnim('climbUp', 0.4, [9,10]);
            this.addAnim('climbDown', 0.4, [9,10]);
        },

        update: function() {
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

            if( this.canClimb && (ig.input.pressed('up') || ig.input.pressed('action')) ) {
                this.isClimbing=true;
                this.ladderReleaseTimer.set(0.0); // allow to cling to ladder instead of jumping past, if up or down pressed

                this.vel.x = 0; // don't fall off sides of ladder unintentionally

                // momentumDirection allows for up, down and idle movement (-1, 0 & 1) so you can stop on ladders
                if (ig.input.pressed('up')) {
                    this.momentumDirection.y >-1 ? this.momentumDirection.y -- : this.momentumDirection.y = -1;
                } else if( ig.input.pressed('action' )){
                    this.momentumDirection.y <1 ? this.momentumDirection.y ++ : this.momentumDirection.y = 1;
                }
            }

            // jump
            if ((this.standing || this.jump_count < 1) && !this.isClimbing && ig.input.pressed('up')) {
                this.jump_sound.play();

                this.vel.y = -this.jump;
                this.jump_count++;
                if (this.standing) {
                    BoneJumpSpawner(this, 2);
                }

                // allow to jump off ladders
                this.ladderReleaseTimer.set(0.5); // approximate seconds your player takes to jump and fall back down
                this.isClimbing=false;
            }

            // when climbing past top of ladder, the entity falls back softly and can walk left or right
            if (!this.standing && !this.canClimb && this.vel.y < 0) this.isClimbing=false;

            // prevent fall down ladder if ground touched but ladderReleaseTimer still running from recent jump
            if (this.standing) this.ladderReleaseTimer.set(0.0);

            if ( this.vel.y < 0 && this.isClimbing && this.momentumDirection.y == -1){
                this.currentAnim = this.anims.climbUp;

            } else if ( this.vel.y > 0 && this.isClimbing && this.momentumDirection.y == 1){
                this.currentAnim = this.anims.climbDown;
            }

            if (this.standing) { this.jump_count = 0; }

            if (this.vel.y < 0) {
                this.currentAnim = this.anims.jump;
            } else if (this.vel.y > 0) {
                this.falling = true;
                this.currentAnim = this.anims.fall;
            } else if (this.vel.x !== 0) {
                this.currentAnim = this.anims.run;
            } else if (!this.animating) {
                this.currentAnim = this.anims.idle;
            }

            if (this.vel.y === 0 && this.falling) {
                this.jumpfall_sound.play();
                this.falling = false;
            }

            this.currentAnim.flip.x = this.flip;
            this.canClimb = false;

            this.parent();
        },

        spawnBones: function(number) {
            BoneJumpSpawner(this, number);
        },

        kill: function() {
            ig.game.removeEntity( this );
            ig.game.spawnEntity( EntityDokuroHead, this.pos.x, this.pos.y-10, {flip:this.flip} );

            for(var i = 0; i < 5; i++) {
                ig.game.spawnEntity(EntityDokuroDeathBones, this.pos.x ,this.pos.y, {flip:this.flip});
            }
            this.death_sound.play();
        },

        getInAnimation: function() {
            if( !this.animating ) this.currentAnim = this.anims.getIn
            this.animating = true;
        }
    });

    EntityDokuroHead = ig.Entity.extend({
        size: {x: 10, y: 8},
        gravityFactor: 0.5,
        bounciness: 0.4,

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet( 'media/dokuro-death.png', 10, 8 ),

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'stay', 1, [0] );
            ig.game.gameover.set(1);
        },

        update: function() {
            this.parent();
        }
    });

    EntityDokuroDeathBones = EntityParticle.extend({
        size: {x: 8, y: 8},
        vel: {x: 60, y: 70},
        gravityFactor: 0.3,
        bounciness: 1,
        fadetime: 0.1,
        lifetime: 1,
        animSheet: new ig.AnimationSheet('media/dokuro-death.png', 10, 8),
        init: function (x, y, settings) {
            this.addAnim('idle', 1, [Math.round(Math.random(1)*3)+1]);
            this.parent(x, y, settings);
        }
    });

    EntityBones = EntityParticle.extend({
        size: {x: 8, y: 8},
        vel: {x: 60, y: 70},
        gravityFactor: 0.3,
        fadetime: 0.1,
        lifetime: 1,
        type: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,

        animSheet: new ig.AnimationSheet( 'media/bones.png', 8, 8 ),

        init: function( x, y, settings ) {
            this.addAnim( 'stay', 2, [Math.round(Math.random(1)*4)] );
            this.parent( x, y, settings );
        },

        update: function() {
            this.parent();
        }
    });

    BoneJumpSpawner = function(th, quantity){
        var x = 0, y = 0;

        x = th.flip ? th.pos.x + th.size.x-8 : th.pos.x;
        y = th.pos.y + th.size.y-10;

        for(var i = 0; i < 2; i++) {
            ig.game.spawnEntity(EntityBones, x, y);
        }
    };
});
