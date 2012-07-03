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
			var options = {};
			if (this.flip) {
				options = {direction: "down", offset: {x:0, y:-2}};
			} else {
				options = {direction: "up", offset: {x:0, y:2}};
			}

			if (!ig.game.actionLock) {
				ig.game.spawnEntity( EntityFireballY, this.pos.x+1, this.pos.y+(this.flip ? 0 : this.size.y-10), options );
			}
		}
	});
});
