ig.module('gamemain')
.requires(
    //'impact.debug.debug',
    'impact.game',
    'impact.font',
    'plugins.bot',
    'plugins.impact_extensions',
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
        mainImg: new ig.Image('media/game-over' + (ig.ua.mobile ? '-mobile' : '') + '.png'),
        imagePos: {x:0, y:0},

        init: function() {
            ig.input.unbindAll();
            upBindings(this.startKey);

            ig.music.stop();
            ig.music.play('gameover');
            if( ig.music.currentTrack ) ig.music.currentTrack.loop = true;

            if (ig.ua.mobile) {
                activateMobile();

                this.imagePos.x = ig.system.width/2 - 155/2;
                this.imagePos.y = ig.system.height/2 - 155/2;
            }
        },

        run: function() {
            ig.system.clear('#211516');
            this.mainImg.draw(this.imagePos.x, this.imagePos.y)

            if (ig.input.pressed(this.startKey)) {
                ig.music.stop();
                ig.system.setGame(SkeletonJigsaw);
                return;
            }
        }
    });

    TitleScreen = ig.Class.extend({
        startKey: 'action',
        mainImg: new ig.Image('media/title-screen-intro' + (ig.ua.mobile ? '-mobile' : '') + '.png'),
        imagePos: {x:0, y:0},

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

            if (ig.ua.mobile) {
                this.imagePos.x = ig.system.width/2 - 155/2;
                this.imagePos.y = ig.system.height/2 - 155/2;
            }
        },

        run: function() {
            ig.system.clear('#211516');
            this.mainImg.draw(this.imagePos.x, this.imagePos.y)

            if (ig.input.pressed(this.startKey)) {
                ig.music.stop();
                ig.system.setGame(SkeletonJigsaw);
            }
        }
    });

    SkeletonJigsaw = ig.Game.extend({
        gravity: 500,
        actionLock: false,
        gameover: false,

        init: function() {
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

            if (this.gameover && this.gameover.delta() > 1.5) {
                ig.system.setGame(Gameover);
            }
            var dokuro = this.getEntityByName("dokuro");
            var player = dokuro ? dokuro : this.getEntitiesByType( EntityDokuroscene )[0];

            if (player) {
                this.screen.x = player.pos.x - ig.system.width/2 + player.size.x/2;
                this.screen.y = player.pos.y - ig.system.height/2 + (ig.ua.mobile ? player.size.y : 0);
            }

            if( dokuro ) {
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
        },

        draw: function() {
            var vig = this.getEntityByName("vignette");
            var hud = this.getEntityByName("hud");

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

        loadLevel: function (level) {
            if (ig.ua.androidBrowser || ig.ua.iPhone4) {
                this.fullFallbackLoadFor(level);
            } else if (ig.ua.androidChrome){
                this.removeMobileTerrainFor(level);
                this.halfFallbackLoadFor(level);
            } else {
                this.removeMobileTerrainFor(level);
            }

            this.parent(level);
        },

        setGameover: function (time) {
            this.gameover = new ig.Timer(time);
        },

        endGame: function() {
            ig.input.unbindAll();
            ig.music.play('ending');
            if( ig.music.currentTrack ) ig.music.currentTrack.loop = true;

            this.prepareLevel("LevelEnding", {vig: true, hud: false})
            this.loadLevelDeferred(LevelEnding);
        },

        setCredits: function() {
            SkeletonJigsaw.setCurrentLevel('Level01');
            ig.game.spawnEntity(EntityFadegame);
        },

        prepareLevel: function(level, settings) {
            var vig = this.getEntityByName("vignette");
            var hud = this.getEntityByName("hud");
            var currentLevel = level || SkeletonJigsaw.getCurrentLevel();

            if (vig) { vig.kill(); vig = null; }
            if (hud) { hud.kill(); hud = null; }

            var levelEntities = ig.global[currentLevel].entities;
            var lastLevelEntity = levelEntities[levelEntities.length -1].type;

            if(!(lastLevelEntity == "EntityVignette" || lastLevelEntity == "EntityHud")) {
                if (settings) {
                    if (settings.vig) levelEntities.push({type: "EntityVignette", x:0, y:0});
                    if (settings.hud) levelEntities.push({type: "EntityHud", x:0, y:0});
                } else {
                    levelEntities.push({type: "EntityVignette", x:0, y:0});
                    levelEntities.push({type: "EntityHud", x:0, y:0});
                }
            }
        },

        removeMobileTerrainFor: function (level) {
            // Removing mobile terrain for non mobile devices
            for (var i = level.layer.length-1; i>=0; i--) {
                if (level.layer[i].name === "mobile_terrain") {
                    level.layer.splice(i, 1);
                }
            }
        },

        fullFallbackLoadFor: function (level) {
            // Removing lava animations for mobile
            for (var i = level.entities.length-1; i>=0; i--) {
                if (
                    level.entities[i].type === "EntityLavaanimation" ||
                    level.entities[i].type === "EntityVignette"
                ) {
                    level.entities.splice(i, 1);
                }
            }

            // Removing some layers for mobile
            for (var i = level.layer.length-1; i>=0; i--) {
                if (
                    level.layer[i].name === "doodads01" ||
                    level.layer[i].name === "mountains" ||
                    level.layer[i].name === "terrain01" ||
                    level.layer[i].name === "background"
                ) {
                    level.layer.splice(i, 1);

                }
            }
        },

        halfFallbackLoadFor: function (level) {
            // Removing lava animations for mobile
            for (var i = level.entities.length-1; i>=0; i--) {
                if (
                    level.entities[i].type === "EntityLavaanimation"
                ) {
                    level.entities.splice(i, 1);
                }
            }

            // Removing some layers for mobile
            for (var i = level.layer.length-1; i>=0; i--) {
                if (
                    level.layer[i].name === "doodads01"
                ) {
                    level.layer.splice(i, 1);

                }
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
            "Level Design",
            "PLAEV TEAM",
            "",
            "",
            "Programming",
            "WILLIAN MOLINARI",
            "",
            "",
            "Art & Design",
            "RAFAEL MASONI",
            "",
            "",
            "Sound Effects",
            "PLAEV TEAM",
            "",
            "",
            "Music",
            "Flesheaters by MATT NIDA",
            "chessboss by BERT FISK",
            "Crap-yo-pants by RAWMIN",
            "Wake Up by CRAZY GAMES",
            "",
            "",
            "Plaev is",
            "RAFAEL MASONI & WILLIAN MOLINARI",
            "Play Everywhere",
            "",
            "",
            "Follow us on Twitter",
            "@PotHix  @plaevteam  @rmasoni",
            "",
            "GitHub",
            "github.com/Plaev"
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

    if (ig.ua.iPad || ig.ua.nexus7) {
        ig.Sound.enabled = false;
        ig.main('#canvas', TitleScreen, 60, 240, 180, 2);
    } else if (ig.ua.mobile) {
        ig.Sound.enabled = false;
        ig.main('#canvas', TitleScreen, 60, 160, 160, 2);
    } else {
        ig.main('#canvas', TitleScreen, 60, 320, 240, 2);
    }
});
