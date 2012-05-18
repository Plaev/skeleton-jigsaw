ig.module('game.entities.door')
.requires('impact.entity')
.defines(function () {
	EntityDoor = ig.Entity.extend({
		size: {x: 16, y: 24},

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,

		animSheet: new ig.AnimationSheet('media/door.png', 16, 24),

		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
			this.addAnim('opened', 1, [3]);
		},

		check: function () {
			if (ig.input.pressed('action')){
				this.currentAnim = this.anims.opened;
			}
		}
	});
});
