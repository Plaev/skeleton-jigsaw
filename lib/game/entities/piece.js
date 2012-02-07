ig.module('game.entities.piece')
.requires('impact.entity')
.defines(function(){

	EntityPiece = ig.Entity.extend({
		size: {x: 16, y: 16},

		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,

		animSheet: new ig.AnimationSheet( 'media/piece.png', 16, 16 ),

		onHold: false,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'stay', 1, [0] );
		},

		update: function() {
			this.parent();
		}
	});
});
