ig.module('game.entities.killerSmallRectangle')
.requires('impact.entity')
.requires('game.entities.killer')
.defines(function () {
	EntityKillerSmallRectangle = EntityKiller.extend({
		size: {x: 128, y: 32}
	});
});

