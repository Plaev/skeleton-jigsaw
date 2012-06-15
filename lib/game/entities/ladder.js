ig.module('game.entities.ladder')
.requires('impact.entity')
.defines(function(){
	EntityLadder = ig.Entity.extend({
		size: {x: 16, y: 16},

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'stay', 0.15, [0, 1, 2, 3, 4, 5, 6, 7] );
		},

		check: function() {
			// Collides with Dokuro
		}
	});
});
