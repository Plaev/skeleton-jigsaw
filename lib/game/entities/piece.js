ig.module('game.entities.piece')
.requires('impact.entity')
.defines(function(){

	EntityPiece = ig.Entity.extend({
		size: {x: 10, y: 10},
		offset: {x: 0, y: 5},

		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,

		animSheet: new ig.AnimationSheet( 'media/piece.png', 10, 10 ),
		startPosition: {x:0, y:0},

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'stay', 0.15, [0, 1, 2, 3] );
		},

		update: function() {
			this.parent();
		},

		kill: function() {
			this.pos.x = this.startPosition.x;
			this.pos.y = this.startPosition.y;
		}
	});
});
