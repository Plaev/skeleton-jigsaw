ig.module('gamemain')
.requires(
	'impact.game',
	'impact.font',
	'game.entities.dokuro',
	'game.levels.test01'
)
.defines(function(){

MyGame = ig.Game.extend({
	font: new ig.Font( 'media/04b03.font.png' ),

	init: function() {
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.X, 'shoot' );
		ig.input.bind( ig.KEY.Z, 'jump' );

		this.loadLevel( LevelTest01 );
	},

	update: function() {
		this.parent(); // Update all entities and backgroundMaps
		// Add your own, additional update code here
	},

	draw: function() {
		this.parent(); // Draw all entities and backgroundMaps

		var x = ig.system.width/2,
			y = ig.system.height/2;

		this.font.draw('It Works!', x, y, ig.Font.ALIGN.CENTER);
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
