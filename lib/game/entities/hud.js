ig.module('game.entities.hud')
.requires('impact.entity')
.defines(function () {
	EntityHud = ig.Entity.extend({
		_wmIgnore: true,
		animSheet: new ig.AnimationSheet('media/hud.png', 10, 10),
		gravityFactor: 0,

		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('empty', 1, [0]);
			this.addAnim('full', 1, [1]);
		},

		update: function () {
			if( ig.game.hud.piece_collected ){ this.currentAnim = this.anims.full; }
			this.parent();
		}
	});

	EntityVignette = EntityHud.extend({
		_wmIgnore: true,
		animSheet: new ig.AnimationSheet('media/vignette.png', 320, 240),

		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('full', 1, [0]);
		},

		update: function () {
			this.parent();
		}
	});
});

