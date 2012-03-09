ig.module('game.entities.hud')
.requires('impact.entity')
.defines(function () {
	EntityHud = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/hud.png', 10, 10),
		gravityFactor: 0,
		zIndex: 300,
		font: new ig.Font('media/default_font.png'),
		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
		},
		update: function () {
			this.parent();
		},
		draw: function() {
			this.font.draw("0", this.size.x+5, this.size.y - this.size.y / 2);
			this.parent();
		}
	});
});

