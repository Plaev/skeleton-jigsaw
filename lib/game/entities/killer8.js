ig.module('game.entities.killer8')
.requires('impact.entity', 'game.entities.killer')
.defines(function () {
	EntityKiller8 = EntityKiller.extend({
		size: {x: 8, y: 8}
	});
});

