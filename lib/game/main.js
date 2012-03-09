ig.module('gamemain')
.requires(
	'impact.game',
	'impact.font',
	'game.entities.dokuro',
	'game.entities.hud',
	'game.levels.01'
)
.defines(function(){

	SkeletonJigsaw = ig.Game.extend({
		gravity: 500,
		hud: {},

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
			this.hud = ig.game.spawnEntity( EntityHud, 0, 0 );
		},

		update: function() {
			this.parent();

			var dokuro = this.getEntitiesByType( EntityDokuro )[0];
			var piece = this.getEntitiesByType( EntityPiece )[0];

			if( dokuro ) {
				// screen follows the player
				this.screen.x = dokuro.pos.x - ig.system.width/2;
				this.screen.y = dokuro.pos.y - ig.system.height/2;
			}
		},

		draw: function() {
			if( this.hud ) {
				this.hud.pos.x = this.screen.x+5;
				this.hud.pos.y = this.screen.y+5;
			}
			this.parent(); // Draw all entities and backgroundMaps
		}
	});

	// Start the Game with 60fps, a resolution of 320x240, scaled up by a factor of 2
	ig.main( '#canvas', SkeletonJigsaw, 60, 320, 240, 2 );
});
