ig.module('game.entities.killer32')
.requires('impact.entity', 'game.entities.killer')
.defines(function () {
	EntityKiller32 = EntityKiller.extend({
		size: {x: 32, y: 32}
	});
});
