ig.module('game.entities.vignettegameover')
.requires('impact.entity', 'game.entities.hud')
.defines(function () {
	EntityVignettegameover = EntityVignette.extend({
		zIndex: 320,
		animSheet: new ig.AnimationSheet('media/game-over.png', 320, 240),
	});

	EntityVignetteFade = EntityVignette.extend({
		zIndex: 310,
		animSheet: new ig.AnimationSheet('media/fade.png', 320, 240),
	});
});

