ig.module('gamemain')
.requires(
	'impact.game',
	'impact.font',
	'game.entities.dokuro',
	'game.levels.01'
)
.defines(function(){

	SkeletonJigsaw = ig.Game.extend({
		gravity: 500,

		init: function() {
			ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
			ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
			ig.input.bind( ig.KEY.UP_ARROW, 'jump' );
			ig.input.bind( ig.KEY.Z, 'jump' );
			ig.input.bind( ig.KEY.X, 'item' );

			ig.input.bindTouch( '#buttonLeft', 'left' );
			ig.input.bindTouch( '#buttonRight', 'right' );
			ig.input.bindTouch( '#buttonJump', 'jump' );

			this.loadLevel( Level01 );
		},

		update: function() {
			this.parent(); // Update all entities and backgroundMaps

			// screen follows the player
			var dokuro = this.getEntitiesByType( EntityDokuro )[0];
			var jigsaw = this.getEntitiesByType( EntityJigsaw )[0];


			if( jigsaw.onHold ){
				jigsaw.pos.x = dokuro.pos.x;
				jigsaw.pos.y = dokuro.pos.y - 15;
			}

			if( dokuro ) {
				this.screen.x = dokuro.pos.x - ig.system.width/2;
				this.screen.y = dokuro.pos.y - ig.system.height/2;
			}
		},

		draw: function() {
			this.parent(); // Draw all entities and backgroundMaps
		}
	});

	// Start the Game with 60fps, a resolution of 320x240, scaled up by a factor of 2
	ig.main( '#canvas', SkeletonJigsaw, 60, 320, 240, 2 );
});
