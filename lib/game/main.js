ig.module('gamemain')
.requires(
    'impact.game',
    'impact.font',
    'game.entities.dokuro',
    'game.entities.vignettegameover',
    'game.entities.hud',
    'game.entities.vignette',
    'game.levels.title',
    'game.levels.01',
    'game.levels.02',
    'game.levels.03',
    'game.levels.04'
)
.defines(function(){
    TitleScreen = ig.Game.extend({
        gravity: 500,
        startKey: 'action',
        intro_sound: new ig.Sound( 'media/audio/intro.*' ),

        init: function() {
            ig.input.unbindAll();
            upBindings(this.startKey);

            if (ig.ua.mobile) { activateMobile(); }

            this.intro_sound.play();
            this.vig = ig.game.spawnEntity( EntityVignette, 0, 0 );
            this.loadLevel( LevelTitle );
        },

        update: function() {
            this.parent();

            if (ig.input.pressed(this.startKey)) {
                this.intro_sound.stop();
                ig.system.setGame(SkeletonJigsaw);
                return;
            }
        }
    });

    SkeletonJigsaw = ig.Game.extend({
        gravity: 500,
        hud: {},
        actionLock: false,
        game_sound: new ig.Sound( 'media/audio/game.*' ),

        init: function() {
            // bindings
            ig.input.unbindAll();
            upBindings(); actionBindings(); leftBindings(); rightBindings();
            this.game_sound.play();

            if (ig.ua.mobile) { activateMobile(); }

            ig.game.skeleton = {};
            ig.game.skeleton.next_level = 0;

            if (!SkeletonJigsaw.getCurrentLevel()) {
                SkeletonJigsaw.setCurrentLevel("Level01");
            }

            this.prepareLevel();
            this.loadLevel(ig.global[SkeletonJigsaw.getCurrentLevel()]);

            this.gameover = new ig.Timer();
        },

        update: function() {
            this.parent();

            if (ig.game.skeleton.next_level) {
                this.prepareLevel();
                this.loadLevelDeferred(ig.game.skeleton.next_level);

                ig.game.skeleton.next_level = 0;
            } else {
                var dokuro = this.getEntitiesByType( EntityDokuro )[0];

                if( EntityPiece ) {
                    var piece = this.getEntitiesByType( EntityPiece )[0];
                }

                if( dokuro ) {
                    // screen follows the player
                    this.screen.x = dokuro.pos.x - ig.system.width/2;
                    this.screen.y = dokuro.pos.y - ig.system.height/2;
                } else {
                    this.game_sound.stop();
                    if ( this.vigfade && this.gameover.delta() > 2) {
                        if ( !this.viggameover ) {
                            this.viggameover = ig.game.spawnEntity( EntityVignettegameover, this.screen.x, this.screen.y );
                            this.actionLock = true;
                        }
                    }

                    if ( !this.viggameover && this.gameover.delta() > 0 ) {
                        this.vigfade = ig.game.spawnEntity( EntityVignetteFade, this.screen.x, this.screen.y );
                    }
                }
            }
        },

        draw: function() {
            var vig = this.getEntitiesByType(EntityVignette)[0];
            var hud = this.getEntitiesByType(EntityHud)[0];

            if( hud ) {
                hud.pos.x = this.screen.x+5;
                hud.pos.y = this.screen.y+5;
            }

            if( vig ) {
                vig.pos.x = this.screen.x;
                vig.pos.y = this.screen.y;
            }

            this.parent();
        },

        endGame: function() {
            SkeletonJigsaw.setCurrentLevel('Level01');
            ig.system.setGame(Credits);
        },

        prepareLevel: function() {
            var vig = this.getEntitiesByType(EntityVignette)[0];
            var hud = this.getEntitiesByType(EntityHud)[0];

            var levelEntities = ig.global[SkeletonJigsaw.getCurrentLevel()].entities;
            var lastLevelEntity = levelEntities[levelEntities.length -1].type;

            if (vig) { vig.kill(); vig = null; }
            if (hud) { hud.kill(); hud = null; }

            if(!(lastLevelEntity == "EntityVignette" || lastLevelEntity == "EntityHud")) {
                levelEntities.push({type: "EntityHud", x:0, y:0});
                levelEntities.push({type: "EntityVignette", x:0, y:0});
            }
        }
    });

    Credits = ig.Class.extend({
        font: new ig.Font('media/04b03.font.png'),

        scrollPos: 0,
        lineHeight: 20,

        credits: [
            "Thanks for playing!",
            "YOU HAVE FINISHED THE DEMO",
            "",
            "",
            "Level Design", "PLAEV TEAM",
            "",
            "",
            "Programming", "WILLIAN MOLINARI",
            "",
            "",
            "Art & Design", "RAFAEL MASONI",
            "",
            "",
            "Follow us on Twitter",
            "@PotHix  @plaevteam  @rmasoni"
        ],

        init: function () {
            this.timer = new ig.Timer();
        },

        run: function () {
            ig.system.clear('rgb(0,0,0)');
            var delta = this.timer.delta();
            var creditsEnded = ig.system.height - this.scrollPos + this.credits.length * this.lineHeight < 0;

            if (ig.input.pressed('action') || creditsEnded) {
                ig.system.setGame(TitleScreen);
            }

            if (delta > 2) {
                this.scrollPos += ig.system.tick * 20;

                for (var i = 0; i < this.credits.length; i++) {
                    this.font.draw(
                        this.credits[i],
                        ig.system.width / 2 - this.font.widthForString(this.credits[i]) / 2,
                        ig.system.height - this.scrollPos + i * this.lineHeight
                    );
                }
            }
        }
    });

    SkeletonJigsaw.setCurrentLevel = function(level) {
        localStorage.setItem("SkeletonJigsawLevel", level);
    };

    SkeletonJigsaw.getCurrentLevel = function() {
        return localStorage.getItem("SkeletonJigsawLevel");
    };

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

    if (ig.ua.mobile) {
        ig.Sound.enabled = false;
        ig.main('#canvas', TitleScreen, 60, 155, 155, 2);
    } else {
        ig.main('#canvas', TitleScreen, 60, 320, 240, 2);
    }
});
