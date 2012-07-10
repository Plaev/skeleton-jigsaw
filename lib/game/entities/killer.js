ig.module('game.entities.killer')
.requires('impact.entity')
.defines(function () {
    EntityKiller = ig.Entity.extend({
        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 0, 0, 0.7)',

        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        gravityFactor: 0,
        check: function (other) {
            other.kill();
        }
    });
});
