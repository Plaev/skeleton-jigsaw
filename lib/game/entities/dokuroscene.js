ig.module(
	'game.entities.dokuroscene'
)
.requires(
	'game.entities.jigsaw',
	'game.entities.fadegame',
	'impact.entity',
	'plugins.bot'
)
.defines(function(){
	EntityDokuroscene = ig.bot.extend({
		accelDef: { ground: 400, air: 200 },
		maxVel: { x: 80, y: 240 },
        offset: {y:12, x:1},
        size: {y:20, x:14},

        animSheet: new ig.AnimationSheet('media/dokuro.png', 16, 32),

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,

		flip: true,
		jump: 100,

		bot: {
			config: {
				loop: false,
				hole_jump: false,
				hole_wall: false,
				death_fall: false
			},

			movements: [
				// Wait for player and then wait 100 milliseconds
				{ action: 'run',  direction: 'right', distance: 70, },
				{ action: 'jump', direction: 'right', vel: 100, },
				{ action: 'run',  direction: 'right', distance: 10, },
				{ action: 'jump', direction: 'right', vel: 100, },
				{ action: 'run',  direction: 'right', distance: 10, },
				{ action: 'jump', direction: 'right', vel: 100, },
				{ action: 'run',  direction: 'right', distance: 25, },

				{
					action: function() {
                        ig.game.spawnEntity(EntityFadegame);
                        this.glow = true
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
			} else if(this.glow) {
			    if (this.currentAnim != this.anims.glow) {
                    var jigsaw = ig.game.getEntitiesByType( EntityJigsaw )[0];
                    jigsaw.setGlow();
                    this.currentAnim = this.anims.glow;
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
