ig.module('game.entities.lava')
.requires('impact.entity')
.defines(function () {

	EntityLava = ig.Entity.extend({
		size: {y: 1, x: 6},
		offset: {y: 6, x: 0},

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,
		check: function (other) {
			other.kill();
		},

		animSheet: new ig.AnimationSheet('media/lava.png', 8, 8),

		flip: false,

		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 0.7, [0, 1]);
		},

		update: function () {
			this.currentAnim.flip.x = this.flip;
			this.parent();
		}
	});
});
