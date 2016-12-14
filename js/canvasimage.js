window.cx = window.cx || {};
(function (ns) {
    ns.CanvasImage = function (x, y, width, height, src) {
        var self = this;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.width = Math.floor(width) || 0;
        this.height = Math.floor(height) || 0;
        this.img = new Image();
        this.img.src = src;

        this.img.onload = function () {

        };

        this.move = function() {};
        
        this.draw = function (ctx) {
            ctx.drawImage(self.img, self.x, self.y, self.width, self.height);
        };
    }

}(window.cx));

