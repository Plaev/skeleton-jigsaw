ig.module(
	'game.entities.dokuroscene'
)
.requires(
	'impact.entity',
	'plugins.bot'
)
.defines(function(){
	EntityDokuroscene = ig.bot.extend({
		// Types
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,

		// Movement properties
		maxVel: { x: 80, y: 240 },
		accelDef: { ground: 400, air: 200 },
		frictionDef: { ground: 400, air: 100 },
		jump: 100,

		// Configure bot
		bot: {
			config: {
				loop: true, // [boolean] (Optional, default true) - Loop routine
				hole_jump: true, // [boolean] (Optional, default true) - If there's a hole in the collision map, jump
				hole_wall: false, // [boolean] (Optional, default false) - If there's a hole in the collision map, change direction
				death_fall: true // [boolean] (Optional, default true) - The bot dies if it falls off the screen (pos.y > collisionMap height)
			},
			movements: [
				// Wait for player and then wait 100 milliseconds
				{
					action: 'wait',
					entity: 'player',
					duration: 2,
					start: function() {
						console.log('Starts waiting');
					},
					during: function() {
						console.log('Im waiting!');
					},
					complete: function() {
						console.log('Movement complete!')
					}
				},

				{
					action: 'walk',
					direction: 'right',
					distance: 3,
					start: function() {
						console.log('Starts walking');
					},
					during: function() {
						console.log('Im walking!');
					},
					complete: function() {
						console.log('Movement complete!')
					}
				},
				{
					action: 'walk',
					direction: 'left',
					distance: 3,
					start: function() {
						console.log('Starts walking');
					},
					during: function() {
						console.log('Im walking!');
					},
					complete: function() {
						console.log('Movement complete!')
					}
				},

				// Jump to the right
				{
					action: 'jump',
					direction: 'right',
					vel: 100,
					start: function() {
						console.log('Starts jumping');
					},
					during: function() {
						console.log('Im jumping!!1!');
					},
					complete: function() {
						console.log('Movement complete!')
					}
				},

				// Call a function
				{
					action: function() {
						console.log('Routine complete')
					}
				}
			]
		},

		// Image
        offset: {y:12, x:1},
        size: {y:20, x:14},
        animSheet: new ig.AnimationSheet('media/dokuro.png', 16, 32),
		flip: true,

		init: function(x, y, settings)  {
			this.parent( x, y, settings);

			// Animations
            this.addAnim('idle', 1, [0, 1]);
            this.addAnim('walk', 0.07, [4, 5, 6, 5, 4]);
            this.addAnim('jump', 1, [8]);
            this.addAnim('fall', 0.4, [9,10]);
		},

		update: function() {
			// Animation
			if(this.vel.x != 0 && this.vel.y == 0) {
				if(this.currentAnim != this.anims.walk) this.currentAnim = this.anims.walk;
			} else if(this.vel.y < 0) {
				if(this.currentAnim != this.anims.jump) {
					this.currentAnim = this.anims.jump;
					this.currentAnim.rewind();
				}
			} else if(this.vel.y > 0) {
				if(this.currentAnim != this.anims.fall) this.currentAnim = this.anims.fall;
			} else if(this.standing) {
				if(this.currentAnim != this.anims.idle) this.currentAnim = this.anims.idle;
			}

			// Flip
			if(this.vel.x > 0) { this.flip = false; } else if(this.vel.x < 0) { this.flip = true; }
			this.currentAnim.flip.x = this.flip;

			// Refresh
			this.parent();
		}
	});
});
