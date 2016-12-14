window.cx = window.cx || {};

if (!window.requestAnimationFrame) {
    (function () {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    } ());
}



(function (ns) {
    ns.Scene = function (canvas, bgImgUrl) {
        this.isRunning = false;
        this.width = canvas.width;
        this.height = canvas.height;
        this.diagonal = Math.sqrt(this.width * this.width + this.height * this.height);
        this.scale = { x: this.width / 1024.0, y: this.height / 768.0, d: this.diagonal / Math.sqrt(1024 * 1024 + 768 * 768) };
        this.resizeTimer = null;
        this.canvas = canvas;
        this.drawTimer = null;
        this.objects = [];

        this.bg = bgImgUrl ? new ns.CanvasImage(0, 0, this.width, this.height, bgImgUrl) : null;
        this.stats = (location.href.indexOf('stats') > 0);
        this.lastFrameTime = 0;
        this.elapsedTime = 0.0;
        this.runTime = 0;
        this.elapsedTimeSeconds = this.elapsedTime * 0.001;
        this.touch = false;
    }
    /*
    ns.Scene.prototype.onLoad = function (canvas, canvascol) {
        this.stats = window.location.href.indexOf('#stats') > 0
        this.canvas = canvas;
        this.resize(window.innerWidth, window.innerHeight);

        this.drawTimer = setTimeout(this.draw, 50);
    };*/

    ns.Scene.prototype.move = function (dt) {
        var i = 0;
        for (; i < this.objects.length; i++) {
            this.objects[i].move(dt);
        }
    };

    ns.Scene.prototype.draw = function (ctx) {
        var i = 0;
        ctx.globalCompositeOperation = "source-over";
        this.bg ? this.bg.draw(ctx) : ctx.clearRect(0, 0, this.width, this.height);
        for (; i < this.objects.length; i++) {
            this.objects[i].draw(ctx);
        }
    };

    ns.Scene.prototype.drawStats = function (ctx) {
        var fps = ((1000.0 / this.elapsedTime) << 0);
        ctx.fillStyle = '#33e';
        ctx.font = 'italic bold ' + (this.scale.y * 25) + 'px sans-serif';
        ctx.textBaseline = 'bottom';
        ctx.fillText(fps + 'fps ' + this.renderTime + 'ms render time', 20, this.scale.y * 30 + 10);
        ctx.fillText('w:' + this.width + '  winw: ' + window.innerWidth, 20, this.scale.y * 60 + 10);
    }

    ns.Scene.prototype.renderLoop = function () {
        if (!this.isRunning) {
            return;
        }
        var self = this,
            ctx = this.canvas.getContext('2d'),
            a = ctx.globalAlpha,
            now = new Date().getTime();
        var elapsed = now - this.lastFrameTime;
        //this.elapsedTimeSeconds = elapsed * 0.001;
        if (elapsed > 15) {//reduce cpu by not drawing unless at least 30ms has elapsed
            this.elapsedTime = elapsed;
            this.runTime += elapsed;
            this.move(elapsed);
            this.lastFrameTime = now;
            this.draw(ctx);
            this.renderTime = ((new Date().getTime()) - this.lastFrameTime);
            this.stats && this.drawStats(ctx);
            ctx.globalAlpha = a;
        }
        window.requestAnimationFrame(function () { self.renderLoop() });
    }

    ns.Scene.prototype.start = function () {
        this.isRunning = true;
        this.runTime = 0;
        this.lastFrameTime = new Date().getTime();
        this.renderLoop();
    }

    ns.Scene.prototype.stop = function () {
        this.isRunning = false;
    }



    ns.Scene.prototype.resize = function (w, h) {
        var i;
        this.width = w;
        this.height = h;
        this.scale = { x: w / 1024.0, y: h / 768.0 };
        this.canvas.width = w;
        this.canvas.height = h;
        if (this.bg) {
            this.bg.width = w;
            this.bg.height = h;
        }
        for (i = 0; i < this.objects.length; i++) {
            if (this.objects[i].resize) {
                this.objects[i].resize(w, h);
            }
        }
    };

    ns.Scene.prototype.onResize = function (w, h) {
        var self = this;
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }

        this.resizeTimer = setTimeout(function () {
            self.resizeTimer = null;
            if (w == self.width && h == self.height) {
                return;
            }
            self.resize(w, h);
        }, 500);
    };

    ns.Scene.prototype.createCanvas = function () {
        if (this.canvas) {
            this.deleteCanvas();
        }
        this.ctx = this.canvas.getContext('2d');
    }
    ns.Scene.prototype.deleteCanvas = function () {
        this.canvas = null;
    };


} (window.cx))

