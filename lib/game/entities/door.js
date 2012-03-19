ig.module('game.entities.door')
.requires('impact.entity')
.defines(function () {
	EntityDoor = ig.Entity.extend({
		size: {x: 16, y: 24},
		offset: {x: (this.flip ? 10 : 0), y: 0},

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,

		animSheet: new ig.AnimationSheet('media/door.png', 16, 24),

		flip: false,

		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
			this.addAnim('opened', 1, [3]);
		},

		update: function () {
			this.currentAnim.flip.x = this.flip;
			this.parent();
		},

		check: function () {
			this.currentAnim = this.anims.opened;
		}
	});
});
