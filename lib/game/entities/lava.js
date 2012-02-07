ig.module('game.entities.lava')
.requires('impact.entity')
.defines(function () {

	EntityLava = ig.Entity.extend({
		size: {y: 8, x: 8},

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,
		check: function (other) {
			if (ig.input.pressed('item')) {
				this.holding = other;
			}
		},

		animSheet: new ig.AnimationSheet('media/lava.png', 16, 20),

		flip: false,

		init: function (x, y, settings) {
			this.parent(x, y, settings);

			// Add the animations. No animations for now
			// this.addAnim('idle', 1, [0, 1]);
		},

		update: function () {
			this.currentAnim.flip.x = this.flip;
			this.parent();
		}
	});
});
