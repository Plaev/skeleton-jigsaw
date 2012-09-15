ig.module('game.entities.fadegame')
.requires('impact.entity')
.defines(function(){
    EntityFadegame = ig.Entity.extend({
        alpha: 0,

        init: function (settings) {
            this.fadeTimer = new ig.Timer(2);
        },

        update: function () {
            this.alpha = this.fadeTimer.delta().map(-1, 0, 0, 1).limit(0, 1);
            if (this.fadeTimer.delta() >= 2)
                ig.system.setGame(Credits);
        },

        draw: function () {
            ig.system.context.globalAlpha = this.alpha;
            ig.system.clear("#000");
            ig.system.context.globalAlpha = 1;
        }
    });
});
