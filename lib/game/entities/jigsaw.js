ig.module('game.entities.jigsaw')
.requires('impact.entity')
.defines(function(){
    EntityJigsaw = ig.Entity.extend({
        size: {x: 48, y: 48},
        type: ig.Entity.TYPE.NONE,
        gravityFactor: 0,

        glow_sound: new ig.Sound( 'media/audio/jigsaw.*' ),

        animSheet: new ig.AnimationSheet( 'media/jigsaw.png', 48, 48 ),

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'stay', 0.15, [0] );
            this.addAnim( 'post', 0.15, [1] );
            this.addAnim( 'glow', 0.30, [1, 2, 3, 4, 3, 2, 1] );
        },

        setGlow: function() {
            this.currentAnim = this.anims.glow;
            this.glow_sound.play();
        },

        setPost: function() {
            this.currentAnim = this.anims.post;
        }
    });
});
