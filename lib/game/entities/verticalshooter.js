ig.module('game.entities.verticalshooter')
.requires(
	'impact.entity',
	'game.entities.shooter'
).defines(function () {
	EntityVerticalshooter = EntityShooter.extend({
		size: {x: 8, y: 8},
		animSheet: new ig.AnimationSheet('media/verticalshooter.png', 8, 8),

		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.shootTimer = new ig.Timer(2);
			this.shootWaitTimer = new ig.Timer(2);
			this.addAnim('idle', 1, [0]);
			this.addAnim('preshoot', 1, [1]);
			this.addAnim('shooting', 1, [2]);

			if (settings.flip) {
				this.gravityFactor = 0;
				for(var i in this.anims) {
					this.anims[i].flip.y = true;
				}
			}
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
				ig.game.spawnEntity( EntityFireball, this.pos.x+1, this.pos.y+(this.flip ? 10 : this.size.y-10), {direction: this.flip ? "down" : "up"} );
			}

			this.currentAnim.flip.x = this.flip;
			this.parent();
		}
	});
});
