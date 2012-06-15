ig.module('game.entities.ladder')
.requires('impact.entity')
.defines(function(){
	EntityLadder = ig.Entity.extend({
		size: {x: 16, y: 80},

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,

		check: function(other) {
			other.climb = true;
			other.gravityFactor = 0;
		}
	});
});
