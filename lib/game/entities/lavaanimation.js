ig.module('game.entities.lavaanimation')
.requires('impact.entity')
.defines(function(){
    EntityLavaanimation = ig.Entity.extend({
        size: {x: 32, y: 8},
        state: 1,
        gravityFactor: 0,

        animSheet: new ig.AnimationSheet( 'media/lava-animation.png', 32, 8 ),

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'state1', 0.4, [ 0,  1,  2,  3,  4,  5] );
            this.addAnim( 'state2', 0.4, [ 6,  7,  8,  9, 10, 11] );
            this.addAnim( 'state3', 0.4, [12, 13, 14, 15, 16, 17] );
            this.addAnim( 'state4', 0.4, [18, 19, 20, 21, 22, 23] );

            this.currentAnim = this.anims["state" + this.state];
        }
    });
});
