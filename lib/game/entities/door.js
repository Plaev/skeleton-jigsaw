ig.module('game.entities.door')
.requires('impact.entity', 'game.entities.hud')
.defines(function () {
    EntityDoor = ig.Entity.extend({
        size: {x: 1, y: 32},
        offset: {x: 12, y: 0},
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

        check: function (other) {
            if(this.keepClosed) return;

            if (other.standing && ig.input.pressed('action')) {
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
            var hud = ig.game.getEntityByName("hud");
            if (hud && hud.piece_collected && this.currentAnim == this.anims.closed) {
                this.currentAnim = this.anims.unlocked;
            }
            this.parent();
        }
    });
});
