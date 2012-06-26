ig.module('game.entities.door')
.requires('impact.entity', 'game.entities.hud')
.defines(function () {
	EntityDoor = ig.Entity.extend({
		size: {x: 24, y: 32},
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,

		animSheet: new ig.AnimationSheet('media/door.png', 24, 32),

		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('closed', 1, [0]);
			this.addAnim('opened', 1, [1]);
			this.addAnim('unlocked', 1, [2]);
		},

		check: function () {
			if (ig.input.pressed('action')) {
				if (this.currentAnim == this.anims.unlocked){
					this.currentAnim = this.anims.opened;
				} else if (this.currentAnim == this.anims.opened){
					SkeletonJigsaw.NEXT_LEVEL = ig.global['Level0' + this.moveto];
				}
			}
		},

		update: function() {
			if (ig.game.hud.piece_collected && this.currentAnim == this.anims.closed) {
				this.currentAnim = this.anims.unlocked;
			}
			this.parent();
		}
	});
});
