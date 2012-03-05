ig.module('game.entities.dokuro')
.requires('impact.entity', 'game.entities.particle')
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
		jump_count: 0,
		flip: false,

		holding: null,

		init: function(x, y, settings) {
			this.parent(x, y, settings);

			// Add the animations
			this.addAnim('idle', 1, [0, 1]);
			this.addAnim('run', 0.07, [3, 4, 5, 4, 3]);
			this.addAnim('jump', 1, [6]);
			this.addAnim('fall', 0.4, [7,8]);
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
			if ((this.standing || this.jump_count < 1) && ig.input.pressed('jump')) {
				this.vel.y = -this.jump;
				this.jump_count++;
				if (this.standing) {
					RandomSpawner(this, EntityBones, 2);
				}
			}

			if (this.standing) { this.jump_count = 0; }

			// set the current animation, based on the player's speed
			if (this.vel.y < 0) {
				this.currentAnim = this.anims.jump;
			} else if (this.vel.y > 0) {
				this.currentAnim = this.anims.fall;
			} else if (this.vel.x !== 0) {
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
		},

		kill: function() {
			ig.game.removeEntity( this );
			ig.game.spawnEntity( EntityDokuroHead, this.pos.x, this.pos.y-10, {flip:this.flip} );
			RandomSpawner(this, EntityDokuroDeathBones, 3);
		}
	});

	EntityDokuroHead = ig.Entity.extend({
		size: {x: 10, y: 8},

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.B,
		collides: ig.Entity.COLLIDES.PASSIVE,

		animSheet: new ig.AnimationSheet( 'media/dokuro-death.png', 10, 8 ),

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'stay', 1, [0] );
		},

		update: function() {
			this.parent();
		}
	});

    EntityDokuroDeathBones = EntityParticle.extend({
		gravityFactor: 0,
		fadetime: 0.5,
		lifetime: 1,
		vel: {x: 30, y: 80},
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

	RandomSpawner = function(th, entity, quantity){
		var x = 0, y = 0;

		x = th.flip ? th.pos.x + th.size.x : th.pos.x-5;
		y = th.pos.y + th.size.y-10;

		for(var i = 0; i < quantity; i++) {
			ig.game.spawnEntity(entity, x ,y, {flip:th.flip});
		}
	};
});
