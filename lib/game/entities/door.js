ig.module('game.entities.door')
.requires('impact.entity')
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
		},

		check: function () {
			if (ig.input.pressed('action')){
				if(this.currentAnim == this.anims.opened){
					this.currentAnim = this.anims.closed;
				} else {
					this.currentAnim = this.anims.opened;
				}
			}
		}
	});
});
