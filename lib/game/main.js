ig.module('gamemain')
.requires(
	'impact.game',
	'impact.font',
	'game.entities.dokuro',
	'game.entities.hud',
	'game.levels.01'
)
.defines(function(){
    TitleScreen = ig.Class.extend({
        introTimer: null,
        titleImage: new ig.Image('media/title-screen.png'),
        font: new ig.Font('media/04b03.font.png'),
        init: function () {
			ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
			ig.input.bind( ig.KEY.A, 'left' );
			ig.input.bind( ig.KEY.H, 'left' );

			ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
			ig.input.bind( ig.KEY.D, 'right' );
			ig.input.bind( ig.KEY.L, 'right' );

			ig.input.bind( ig.KEY.UP_ARROW, 'jump' );
			ig.input.bind( ig.KEY.K, 'jump' );
			ig.input.bind( ig.KEY.W, 'jump' );

			ig.input.bind( ig.KEY.Z, 'jump' );
			ig.input.bind( ig.KEY.X, 'action' );
			ig.input.bind( ig.KEY.DOWN_ARROW, 'action' );
            this.introTimer = new ig.Timer(1);
        },
        run: function () {
			ig.system.clear('#666666');
			this.titleImage.draw(0,0);
			this.font.draw('Press jump key to start', 240, 210, ig.Font.ALIGN.CENTER);
            if (ig.input.pressed('action') || ig.input.pressed('jump')) {
                ig.system.setGame(SkeletonJigsaw);
                return;
            }
            var delta = this.introTimer.delta();
        }
    });

	SkeletonJigsaw = ig.Game.extend({
		gravity: 500,
		hud: {},

		init: function() {
			ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
			ig.input.bind( ig.KEY.A, 'left' );
			ig.input.bind( ig.KEY.H, 'left' );

			ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
			ig.input.bind( ig.KEY.D, 'right' );
			ig.input.bind( ig.KEY.L, 'right' );

			ig.input.bind( ig.KEY.UP_ARROW, 'jump' );
			ig.input.bind( ig.KEY.K, 'jump' );
			ig.input.bind( ig.KEY.W, 'jump' );

			ig.input.bind( ig.KEY.Z, 'jump' );
			ig.input.bind( ig.KEY.X, 'action' );
			ig.input.bind( ig.KEY.DOWN_ARROW, 'action' );

			if (ig.ua.mobile) { this.activateMobile(); }

			this.loadLevel( Level01 );
			this.vignette = ig.game.spawnEntity( EntityVignette, 0, 0 );
			this.hud = ig.game.spawnEntity( EntityHud, 0, 0 );
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
		},

		draw: function() {
			if( this.hud ) {
				this.hud.pos.x = this.screen.x+5;
				this.hud.pos.y = this.screen.y+5;
				this.vignette.pos.x = this.screen.x;
				this.vignette.pos.y = this.screen.y;
			}
			this.parent(); // Draw all entities and backgroundMaps
		},

		activateMobile: function () {
			ig.input.bindTouch('#buttonLeft', 'left');
			ig.input.bindTouch('#buttonRight', 'right');
			ig.input.bindTouch('#buttonAction', 'action');
			ig.input.bindTouch('#buttonJump', 'jump');

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
