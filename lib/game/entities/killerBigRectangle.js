ig.module('game.entities.killerBigRectangle')
.requires('impact.entity')
.requires('game.entities.killer')
.defines(function () {
	EntityKillerBigRectangle = EntityKiller.extend({
		size: {x: 256, y: 64}
	});
});

