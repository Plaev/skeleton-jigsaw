ig.module('game.entities.door')
.requires('impact.entity')
.defines(function () {
	EntityDoor = ig.Entity.extend({
		size: {x: 24, y: 36},

		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,

		animSheet: new ig.AnimationSheet('media/door.png', 24, 32),

		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('closed', 1, [0]);
			this.addAnim('opening', 1, [1,2,3,4,5]);
		},

		check: function () {
			if (ig.input.pressed('action')){
				this.currentAnim = this.anims.opening;
			}
		}
	});
});
