ig.module('game.entities.killerBigRectangle')
.requires('impact.entity', 'game.entities.killer')
.defines(function () {
	EntityKillerBigRectangle = EntityKiller.extend({
		size: {x: 256, y: 64}
	});
});

