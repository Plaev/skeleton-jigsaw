ig.module('game.entities.killer')
.requires('impact.entity')
.defines(function () {
	EntityKiller = ig.Entity.extend({
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,
		gravityFactor: 0,
		check: function (other) {
			other.kill();
		}
	});
});
