ig.module('game.entities.jigsaw')
.requires('impact.entity')
.defines(function(){
    EntityJigsaw = ig.Entity.extend({
        size: {x: 48, y: 48},
        type: ig.Entity.TYPE.NONE,
        gravityFactor: 0,

        animSheet: new ig.AnimationSheet( 'media/jigsaw.png', 48, 48 ),

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'stay', 0.15, [0, 1, 2, 3] );
        }
    });
});
