ig.module('game.entities.verticalshooter')
.requires(
	'impact.entity',
	'game.entities.shooter'
).defines(function () {
	EntityVerticalshooter = EntityShooter.extend({
		size: {x: 8, y: 8},
		animSheet: new ig.AnimationSheet('media/verticalshooter.png', 8, 8),

		applyFlip: function (settings) {
			if (settings.flip) {
				this.gravityFactor = 0;
				for(var i in this.anims) {
					this.anims[i].flip.y = true;
				}
			}
		},

		shoot: function () {
			ig.game.spawnEntity( EntityFireball, this.pos.x-1, this.pos.y+(this.flip ? 8 : this.size.y-8), {direction: this.flip ? "down" : "up"} );
		}
	});
});
