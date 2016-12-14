window.cx = window.cx || {};
(function (ns) {
   
    var byTxt = '';//E-card by Jørn Are Hatlelid @ Computas';

    ns.FrontScene = function (canvas, bgImgUrl) {
        var self = this;
        this.__proto__ = ns.Scene.prototype;
        ns.Scene.call(this, canvas, 'img/front.jpg');
        this.cxlogo = new ns.CanvasImage(290, 300, 410 * this.scale.x, 130 * this.scale.y, 'img/cxlogo.png', true);

        //this.snowFarBehind = new ns.Snow(this, 100, this.diagonal * 0.0008, true);
        this.snowBehind = new ns.Snow(this, 40, this.diagonal * 0.015);
        this.snowFront = new ns.Snow(this, 40, this.diagonal * 0.015);
        //this.objects.push(this.snowFarBehind);
        this.objects.push(this.snowBehind);
        //this.objects.push(this.cxlogo);
        this.objects.push(this.snowFront);

        this.start = function () {
            if (this.isRunning) {
                return;
            }
            this.__proto__.start.call(this);

            // //add more snow if cpu is ok with it
            // setTimeout(function () {
            //     if (self.renderTime < 20) {
            //         (!ns.editMode) && self.objects.unshift(self.snowBehind);
            //         setTimeout(function () {
            //             if (self.renderTime < 20) {
            //                 (!ns.editMode) && self.objects.unshift(self.snowFarBehind);
            //             }
            //         }, 2000);
            //     }
            // }, 2000);
        };

        this.move = function (elapsed) {
            this.__proto__.move.call(this, elapsed);
        };

        this.draw = function (ctx) {
            this.__proto__.draw.call(this, ctx);
            ctx.fillStyle = '#44a';
            ctx.font = 'italic bold ' + Math.ceil(this.height * 0.026) + 'px sans-serif';
            ctx.textBaseline = 'bottom';
            ctx.fillText(byTxt, this.width - ctx.measureText(byTxt).width - 10, this.height - 20);
        };

        this.resize = function (w, h) {
            this.__proto__.resize.call(this, w, h);
        };

        this.onMouseMove = function (x, y, buttons) {
        }
    }
    ns.FrontScene.prototype = ns.Scene.prototype;

    function distance(x1, y1, x2, y2) {
        var x = x2 - x1, y = y2 - y1;
        return Math.sqrt(x * x + y * y);
    }

    //ns.FrontScene.prototype.

} (window.cx))

