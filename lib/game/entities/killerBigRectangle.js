ig.module('game.entities.killerBigRectangle')
.requires('impact.entity')
.requires('game.entities.killer')
.defines(function () {
	EntityKillerBigRectangle = EntityKiller.extend({
		size: {x: 64, y: 256}
	});
});

