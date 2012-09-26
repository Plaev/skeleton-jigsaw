ig.module(
	'game.entities.dokuroscene'
)
.requires(
	'game.entities.jigsaw',
	'impact.entity',
	'plugins.bot'
)
.defines(function(){
	EntityDokuroscene = ig.bot.extend({
        accelDef: { ground: 150, air: 400 },
        maxVel: {x: 100, y: 200},
        offset: {y:12, x:1},
        size: {y:20, x:14},

        animSheet: new ig.AnimationSheet('media/dokuro.png', 16, 32),

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,

		jump: 150,

		bot: {
			config: {
				loop: false,
				hole_jump: false,
				hole_wall: false,
				death_fall: false
			},

			movements: [
				{ action: 'wait', entity: 'player', duration: 2 },
				{ action: 'run',  direction: 'right', distance: 60 },
				{ action: 'wait', entity: 'player', duration: 0.5 },
				{ action: 'jump', direction: 'right', vel: 150 },
				{ action: 'wait', entity: 'player', duration: 0.5 },
				{ action: 'run',  direction: 'right', distance: 45 },
				{ action: 'wait', entity: 'player', duration: 2 },

				{
					action: function() {
                        var jigsaw = ig.game.getEntitiesByType(
                            EntityJigsaw
                        )[0];

                        var dokuro = ig.game.spawnEntity(
                            EntityDokuro, this.pos.x, this.pos.y
                        );
					    this.kill();

                        jigsaw.setGlow();
					    dokuro.glow = true;
					}
				}
			]
		},

		init: function(x, y, settings)  {
			this.parent( x, y, settings);

            this.addAnim('idle', 1, [0, 1]);
            this.addAnim('run', 0.07, [4, 5, 6, 5, 4]);
            this.addAnim('jump', 1, [8]);
            this.addAnim('fall', 0.4, [9,10]);
            this.addAnim('glow', 0.4, [16,17,18]);
            this.addAnim('sword', 0.4, [20,21,22]);
		},

		update: function() {
			if(this.vel.x != 0 && this.vel.y == 0) {
				if(this.currentAnim != this.anims.run) {
				    this.currentAnim = this.anims.run;
                }
			} else if(this.vel.y < 0) {
                if(this.currentAnim != this.anims.jump) {
                    this.currentAnim = this.anims.jump;
                    this.currentAnim.rewind();
                }
			} else if(this.vel.y > 0) {
				if(this.currentAnim != this.anims.fall) {
				    this.currentAnim = this.anims.fall;
                }
			} else if(this.standing) {
                if(this.currentAnim != this.anims.idle) {
                    this.currentAnim = this.anims.idle;
                }
			}

			if(this.vel.x > 0) {
			    this.flip = false;
			} else if(this.vel.x < 0) {
			    this.flip = true;
			}

			this.currentAnim.flip.x = this.flip;
			this.parent();
		}
	});
});
