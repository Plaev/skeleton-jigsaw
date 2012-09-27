ig.module('game.entities.hud')
.requires('impact.entity')
.defines(function () {
    EntityHud = ig.Entity.extend({
        _wmIgnore: true,
        animSheet: new ig.AnimationSheet('media/hud.png', 10, 10),
        gravityFactor: 0,
        zIndex: 2,
        name: "hud",

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('empty', 1, [0]);
            this.addAnim('full', 1, [1]);
        },

        update: function () {
            var hud = ig.game.getEntitiesByType(EntityHud)[0];
            if( hud.piece_collected ){ this.currentAnim = this.anims.full; }
            this.parent();
        }
    });
});
