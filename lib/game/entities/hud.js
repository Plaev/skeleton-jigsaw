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
			this.font.draw("noooooooooooooooooooooo", ig.game.screen.x+50, ig.game.screen.y+50, ig.Font.ALIGN.CENTER);
			this.pos.x = ig.game.screen.x;
			this.pos.y = ig.game.screen.y;
			this.parent();
		}
	});
});

