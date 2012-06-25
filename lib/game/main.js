ig.module('gamemain')
.requires(
	'impact.game',
	'impact.font',
	'game.entities.dokuro',
	'game.entities.vignettegameover',
	'game.entities.hud',
	'game.levels.title',
	'game.levels.02'
)
.defines(function(){
	TitleScreen = ig.Game.extend({
		gravity: 500,

		init: function() {
			ig.input.bind( ig.KEY.UP_ARROW, 'up' );
			ig.input.bind( ig.KEY.K, 'up' );
			ig.input.bind( ig.KEY.W, 'up' );
			ig.input.bind( ig.KEY.Z, 'up' );

			if (ig.ua.mobile) { this.activateMobile(); }

			this.vignette = ig.game.spawnEntity( EntityVignette, 0, 0 );
			this.loadLevel( LevelTitle );
		},

		update: function() {
			this.parent();

			if (ig.input.pressed('up')) {
				ig.system.setGame(SkeletonJigsaw);
				return;
			}
		}
    });

	SkeletonJigsaw = ig.Game.extend({
		gravity: 500,
		hud: {},

		init: function() {
			// Arrows
			ig.input.bind( ig.KEY.UP_ARROW, 'up' );
			ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
			ig.input.bind( ig.KEY.DOWN_ARROW, 'action' );
			ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );

			// FPS style
			ig.input.bind( ig.KEY.W, 'up' );
			ig.input.bind( ig.KEY.A, 'left' );
			ig.input.bind( ig.KEY.S, 'action' );
			ig.input.bind( ig.KEY.D, 'right' );

			// Vi bindings
			ig.input.bind( ig.KEY.K, 'up' );
			ig.input.bind( ig.KEY.H, 'left' );
			ig.input.bind( ig.KEY.J, 'action' );
			ig.input.bind( ig.KEY.L, 'right' );

			// Common HTML5 buttons
			ig.input.bind( ig.KEY.Z, 'up' );
			ig.input.bind( ig.KEY.X, 'action' );

			if (ig.ua.mobile) { this.activateMobile(); }

			this.loadLevel( Level02 );
			this.vignette = ig.game.spawnEntity( EntityVignette, 0, 0 );
			this.hud = ig.game.spawnEntity( EntityHud, 0, 0 );
			this.gameover = new ig.Timer();
		},

		update: function() {
			this.parent();

			var dokuro = this.getEntitiesByType( EntityDokuro )[0];

			if( EntityPiece ) {
				var piece = this.getEntitiesByType( EntityPiece )[0];
			}

			if( dokuro ) {
				// screen follows the player
				this.screen.x = dokuro.pos.x - ig.system.width/2;
				this.screen.y = dokuro.pos.y - ig.system.height/2;
			}

			if ( !dokuro ) {
				if ( this.vignettefade && this.gameover.delta() > 2) {
					if ( !this.vignettegameover ) {
						this.vignettegameover = ig.game.spawnEntity( EntityVignettegameover, this.screen.x, this.screen.y );
						ig.system.stopRunLoop.call(ig.system);
					}
				}

				if ( !this.vignettegameover && this.gameover.delta() > 0 ) {
					this.vignettefade = ig.game.spawnEntity( EntityVignetteFade, this.screen.x, this.screen.y );
				}
			}
		},

		draw: function() {
			if( this.hud ) {
				this.hud.pos.x = this.screen.x+5;
				this.hud.pos.y = this.screen.y+5;
				this.vignette.pos.x = this.screen.x;
				this.vignette.pos.y = this.screen.y;
			}

			this.parent();
		},

		activateMobile: function () {
			ig.input.bindTouch('#buttonLeft', 'left');
			ig.input.bindTouch('#buttonRight', 'right');
			ig.input.bindTouch('#buttonAction', 'action');
			ig.input.bindTouch('#buttonJump', 'up');

			var buttons = document.getElementsByClassName("button");
			for( var i=0; i<buttons.length; i++ ) {
				buttons[i].style.display = "block";
			}
		}
	});

	if (ig.ua.mobile) {
		ig.Sound.enabled = false;
		ig.main('#canvas', TitleScreen, 60, 155, 155, 2);
	} else {
		ig.main('#canvas', TitleScreen, 60, 320, 240, 2);
	}
});
