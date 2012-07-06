ig.module('game.entities.vignette')
.requires('impact.entity')
.defines(function () {
    EntityVignette = ig.Entity.extend({
        _wmIgnore: true,
        animSheet: new ig.AnimationSheet('media/vignette.png', 320, 240),
        gravityFactor: 0,

        init: function (x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('full', 1, [0]);
        }
    });
});
