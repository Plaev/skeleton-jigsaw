ig.module('game.entities.killer64')
.requires('impact.entity', 'game.entities.killer')
.defines(function () {
	EntityKiller64 = EntityKiller.extend({
		size: {x: 64, y: 64}
	});
});

