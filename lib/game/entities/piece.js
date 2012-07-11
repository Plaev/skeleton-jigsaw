ig.module('game.entities.piece')
.requires('impact.entity', 'game.entities.hud')
.defines(function(){
    EntityPiece = ig.Entity.extend({
        size: {x: 16, y: 16},
        offset: {x: 4, y: 6},

        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        gravityFactor: 0.03,

        kill_counter: 0,

        animSheet: new ig.AnimationSheet( 'media/piece.png', 16, 16 ),

        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'stay', 0.15, [0, 1, 2, 3, 4, 5, 6, 7] );
        },

        check: function() {
            var hud = ig.game.getEntitiesByType(EntityHud)[0];
            if (hud && !hud.piece_collected) {
                ig.game.spawnEntity(EntityPieceCollected, this.pos.x, this.pos.y);
                this.kill();
            }

            hud.piece_collected = true;
        }
    });

    EntityPieceCollected = EntityPiece.extend({
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'collect', 0.15, [8, 9, 10, 11, 12, 13, 14] );
            this.currentAnim = this.anims.collect;
        },

        update: function() {
            this.parent();
            if (this.currentAnim === this.anims.collect) { this.kill_counter++; }
            if (this.kill_counter > 30) { this.kill(); }
        }
    });
});
