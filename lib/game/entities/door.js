ig.module('game.entities.door')
.requires('impact.entity', 'game.entities.hud')
.defines(function () {
    EntityDoor = ig.Entity.extend({
        size: {x: 24, y: 32},
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        keepClosed: false,

        animSheet: new ig.AnimationSheet('media/door.png', 24, 32),

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.door_sound = new ig.Sound( 'media/audio/door.*' );
            this.addAnim('closed', 1, [0]);
            this.addAnim('opened', 1, [1]);
            this.addAnim('unlocked', 1, [2]);
            this.addAnim('locked', 1, [3]);

            if( this.keepClosed) {
                this.currentAnim = this.anims.locked;
            }
        },

        check: function () {
            if(this.keepClosed) return;

            if (ig.input.pressed('action')) {
                if (this.currentAnim == this.anims.unlocked){
                    this.currentAnim = this.anims.opened;
                    this.door_sound.play();
                } else if (this.currentAnim == this.anims.opened){
                    if( parseInt(this.moveTo) < 0) {
                        ig.game.endGame();
                    } else {
                        var level = 'Level0' + this.moveTo;

                        SkeletonJigsaw.setCurrentLevel(level);
                        ig.game.skeleton.next_level = ig.global[level];
                    }
                }
            }
        },

        update: function() {
            var hud = ig.game.getEntitiesByType(EntityHud)[0];
            if (hud && hud.piece_collected && this.currentAnim == this.anims.closed) {
                this.currentAnim = this.anims.unlocked;
            }
            this.parent();
        }
    });
});
