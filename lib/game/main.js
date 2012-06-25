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
		startKey: 'action',

		init: function() {
			ig.input.unbindAll();
			upBindings(this.startKey);

			if (ig.ua.mobile) { activateMobile(); }

			this.vignette = ig.game.spawnEntity( EntityVignette, 0, 0 );
			this.loadLevel( LevelTitle );
		},

		update: function() {
			this.parent();

			if (ig.input.pressed(this.startKey)) {
				ig.system.setGame(SkeletonJigsaw);
				return;
			}
		}
    });

	SkeletonJigsaw = ig.Game.extend({
		gravity: 500,
		hud: {},

		init: function() {
			// bindings
			ig.input.unbindAll();
			upBindings();
			actionBindings();
			leftBindings();
			rightBindings();

			if (ig.ua.mobile) { activateMobile(); }

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
	});

	if (ig.ua.mobile) {
		ig.Sound.enabled = false;
		ig.main('#canvas', TitleScreen, 60, 155, 155, 2);
	} else {
		ig.main('#canvas', TitleScreen, 60, 320, 240, 2);
	}

	activateMobile = function() {
		var buttons = document.getElementsByClassName("button");
		for( var i=0; i<buttons.length; i++ ) {
			buttons[i].style.display = "block";
		}
	}

	upBindings = function(key_action) {
		if (!key_action) key_action = 'up';

		ig.input.bindTouch('#buttonJump', key_action); // Mobile
		ig.input.bind( ig.KEY.UP_ARROW, key_action ); // Arrows
		ig.input.bind( ig.KEY.W, key_action ); // FPS style
		ig.input.bind( ig.KEY.K, key_action ); // Vi bindings
		ig.input.bind( ig.KEY.Z, key_action ); // Common HTML5 buttons
		ig.input.bind( ig.KEY.SPACE, key_action ); // Common thinking
	}

	actionBindings = function(key_action) {
		if (!key_action) key_action = 'action';

		ig.input.bindTouch('#buttonAction', key_action); // Mobile
		ig.input.bind( ig.KEY.DOWN_ARROW, key_action ); // Arrows
		ig.input.bind( ig.KEY.S, key_action ); // FPS style
		ig.input.bind( ig.KEY.J, key_action ); // Vi bindings
		ig.input.bind( ig.KEY.X, key_action ); // Common HTML5 buttons
	}

	leftBindings = function(key_action) {
		if (!key_action) key_action = 'left';

		ig.input.bindTouch('#buttonLeft', key_action); // Mobile
		ig.input.bind( ig.KEY.LEFT_ARROW, key_action ); // Arrows
		ig.input.bind( ig.KEY.A, key_action ); // FPS style
		ig.input.bind( ig.KEY.H, key_action ); // Vi bindings
	}

	rightBindings = function(key_action) {
		if (!key_action) key_action = 'right';

		ig.input.bindTouch('#buttonRight', key_action); // Mobile
		ig.input.bind( ig.KEY.RIGHT_ARROW, key_action ); // Arrows
		ig.input.bind( ig.KEY.D, key_action ); // FPS style
		ig.input.bind( ig.KEY.L, key_action ); // Vi bindings
	}
});
