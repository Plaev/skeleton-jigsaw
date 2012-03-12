ig.module('game.entities.hud')
.requires('impact.entity')
.defines(function () {
	EntityHud = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/hud.png', 10, 10),
		gravityFactor: 0,
		zIndex: 300,
		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
		},
		update: function () {
			this.parent();
		},
		draw: function() {
			this.parent();
		}
	});
});

