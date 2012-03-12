ig.module('game.entities.door')
.requires('impact.entity')
.defines(function () {
	EntityDoor = ig.Entity.extend({
		size: {x: 16, y: 24},
		offset: {x: -14, y: 0},

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.FIXED,

		animSheet: new ig.AnimationSheet('media/door.png', 16, 24),

		flip: false,

		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
			this.addAnim('opening', 1, [1, 2, 3]);
		},

		update: function () {
			this.currentAnim.flip.x = this.flip;
			this.parent();
		},

		check: function () {
		}
	});
});
