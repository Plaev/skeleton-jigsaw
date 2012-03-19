ig.module('game.entities.piece')
.requires('impact.entity', 'game.entities.hud')
.defines(function(){
	EntityPiece = ig.Entity.extend({
		size: {x: 16, y: 16},
		offset: {x: 0, y: 5},

		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,

		animSheet: new ig.AnimationSheet( 'media/piece.png', 16, 16 ),

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'stay', 0.15, [0, 1, 2, 3, 4, 5, 6, 7] );
			this.addAnim( 'collect', 0.15, [8, 9, 10, 11, 12] );
		},

		update: function() {
			this.parent();
		},

		check: function( other ) {
			ig.game.hud.collected = true;
			this.kill();
		}
	});
});
