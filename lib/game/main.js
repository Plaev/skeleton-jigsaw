ig.module('gamemain')
.requires(
    //'impact.debug.debug',
    'impact.game',
    'impact.font',
    'plugins.bot',
    'game.entities.dokuro',
    'game.entities.hud',
    'game.entities.vignette',
    'game.levels.01',
    'game.levels.02',
    'game.levels.03',
    'game.levels.04',
    'game.levels.ending'
)
.defines(function(){
    Gameover = ig.Class.extend({
        gravity: 500,
        startKey: 'action',
        gameoverImg: new ig.Image('media/game-over' + (ig.ua.mobile ? '-mobile' : '') + '.png'),

        init: function() {
            ig.input.unbindAll();
            upBindings(this.startKey);

            ig.music.stop();
            ig.music.play('gameover');
            if( ig.music.currentTrack ) ig.music.currentTrack.loop = true;

            if (ig.ua.mobile) { activateMobile(); }
        },

        run: function() {
            ig.system.clear('#000000');
            this.gameoverImg.draw(0, 0)

            if (ig.input.pressed(this.startKey)) {
                ig.music.stop();
                ig.system.setGame(SkeletonJigsaw);
                return;
            }
        }
    });

    TitleScreen = ig.Class.extend({
        startKey: 'action',
        titlescreenImg: new ig.Image('media/title-screen-intro' + (ig.ua.mobile ? '-mobile' : '') + '.png'),

        init: function() {
            ig.input.unbindAll();
            upBindings(this.startKey);

            if (ig.ua.mobile) { activateMobile(); }

            ig.music.add( 'media/audio/intro.*', 'intro' );
            ig.music.add( 'media/audio/ending.*', 'ending' );
            ig.music.add( 'media/audio/game.*', 'game' );
            ig.music.add( 'media/audio/credits.*', 'credits' );
            ig.music.add( 'media/audio/gameover.*', 'gameover' );

            ig.music.play('intro');
            if( ig.music.currentTrack ) ig.music.currentTrack.loop = true;
        },

        run: function() {
            ig.system.clear('#000000');
            this.titlescreenImg.draw(0, 0)

            if (ig.input.pressed(this.startKey)) {
                ig.music.stop();
                ig.system.setGame(SkeletonJigsaw);
            }
        }
    });

    SkeletonJigsaw = ig.Game.extend({
        gravity: 500,
        hud: {},
        actionLock: false,
        gameover: false,

        init: function() {
            // bindings
            ig.input.unbindAll();
            upBindings(); actionBindings(); leftBindings(); rightBindings();

            ig.music.play('game');
            if( ig.music.currentTrack ) ig.music.currentTrack.loop = true;

            if (ig.ua.mobile) { activateMobile(); }

            ig.game.skeleton = {};
            ig.game.skeleton.next_level = 0;

            if (!SkeletonJigsaw.getCurrentLevel()) {
                SkeletonJigsaw.setCurrentLevel("Level01");
            }

            this.prepareLevel();
            this.loadLevel(ig.global[SkeletonJigsaw.getCurrentLevel()]);
        },

        update: function() {
            this.parent();

            var dokuro = this.getEntitiesByType( EntityDokuro )[0];

            if( dokuro ) {
                // screen follows the player

                if (!this.caged) {
                    this.screen.x = dokuro.pos.x - ig.system.width/2;
                    this.screen.y = dokuro.pos.y - ig.system.height/2;
                }

                if (dokuro.animating) dokuro.animating++;

                if (ig.game.skeleton.next_level) {
                    dokuro.getInAnimation();

                    if (dokuro.animating > ig.system.fps) {
                        // No more animation being done.
                        dokuro.animating = 0;

                        this.prepareLevel();
                        this.loadLevelDeferred(ig.game.skeleton.next_level);

                        ig.game.skeleton.next_level = 0;
                    }
                }
            }

            if (this.gameover) {
                if (this.gameover.delta() > 1.5) {
                    ig.system.setGame(Gameover);
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

        setGameover: function (time) {
            this.gameover = new ig.Timer(time);
        },

        endGame: function() {
            ig.input.unbindAll();
            ig.music.play('ending');
            if( ig.music.currentTrack ) ig.music.currentTrack.loop = true;

            this.vig = ig.game.spawnEntity( EntityVignette, 0, 0 );

            this.caged = true;

            this.loadLevelDeferred(LevelEnding);
        },

        setCredits: function() {
            SkeletonJigsaw.setCurrentLevel('Level01');
            ig.game.spawnEntity(EntityFadegame);
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
            "Sound Effects", "PLAEV TEAM",
            "",
            "",
            "Music", "Flesheaters by MATT NIDA", "chessboss by BERT FISK", "Crap-yo-pants by RAWMIN", "Wake Up by CRAZY GAMES",
            "",
            "",
            "Plaev is",
            "Rafael Masoni and Willian Molinari",
            "Play Everywhere",
            "",
            "",
            "Follow us on Twitter",
            "@PotHix  @plaevteam  @rmasoni"
        ],

        init: function () {
            // No buttons for the credits
            ig.music.stop();

            ig.music.play('credits');
            if( ig.music.currentTrack ) ig.music.currentTrack.loop = true;

            ig.input.unbindAll();
            this.timer = new ig.Timer();
        },

        run: function () {
            ig.system.clear('rgb(0,0,0)');
            var delta = this.timer.delta();

            var creditsPosition = ig.system.height - this.scrollPos + this.credits.length * this.lineHeight;

            if (creditsPosition < 100 && !this.outOfScreen) {
                ig.music.fadeOut(3);
                this.outOfScreen = true
            }

            if (creditsPosition < 0) {
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
