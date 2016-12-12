var TwoPI = 2 * Math.PI;

var Scene = function () {
	var self = this;
	this.width = 0;
	this.height = 0;
	this.scale = { x: 1.0, y: 1.0 };
	this.resizeTimer = null;
	this.canvas = null;
	this.drawTimer = null;
	this.snowFlakes = [];
	this.cxlogo = new CanvasImage(100, 200, 400, 100, 'img/cxlogo.png', true);
	this.bg = new CanvasImage(0, 0, 200, 200, 'img/candlewallpaper.jpg');
	this.stats = false;

	self.x = 0;
	self.y = 0;
	self.lastFrameTime = 0;
	self.elapsedTime = 0.0;
	self.elapsedTimeSeconds = self.elapsedTime * 0.001;
	self.wind = 0.0;
	self.gravx = 0.0;
	self.gravy = 1.0;
	self.touch = false;
	self.stuckFlakes = [];


	self.flame = null;
	//self.flame = new Flame(213,265);

	this.onLoad = function (canvas, canvascol) {
		var i = 0;
		self.stats = window.location.href.indexOf('#stats') > 0
		self.canvas = canvas;
		self.resize(window.innerWidth, window.innerHeight);
		var numflakes = Math.max(Math.min(self.width * self.height * 0.001, 1000), 300);
		for (i = self.snowFlakes.length; i < numflakes; i++) {
			self.snowFlakes.push(new SnowFlake(Math.random() * self.width, Math.random() * self.height, 0, 1));
		}
		self.drawTimer = setTimeout(self.draw, 50);
	};

	this.move = function () {
		var now = elapsed = new Date().getTime();
		if (self.lastFrameTime == 0) {
			self.lastFrameTime = now;
		}
		var elapsed = self.elapsedTime = now - self.lastFrameTime;
		self.elapsedTimeSeconds = elapsed * 0.001;
		if (elapsed == 0) return;

		var sf = self.snowFlakes;
		var f;

		for (i = 0; i < sf.length; i++) {
			f = sf[i];
			f.move(elapsed);
			if (f.y > self.height) {
				f.y -= self.height;
				f.x = Math.random() * self.width;
			}
			if (f.y < -200) {
				f.y += self.height;
			}
			if (f.x > self.width) {
				f.x -= self.width;
			}
			if (f.x < 0) {
				f.x += self.width;
			}
			//melting
			f.life -= self.flame.melts(f.x, f.y);
			if (f.speedx * f.speedy == 0.0) {
				f.life -= 0.0001 * elapsed;
			}
			if (f.life <= 0) {
				f.life = 1.0;
				f.y = -Math.random() * 200;
				f.x = Math.random() * self.width;
				self.unStuckFlake(f);
			}
		}
		self.lastFrameTime = now;
	};

	this.draw = function () {

		var i,
			sf = self.snowFlakes,
			ctx = self.canvas.getContext('2d'),
			a = ctx.globalAlpha;
		//c.clearRect(0,0, self.width,self.height);
		//maps

		self.move();

		//gfx
		self.bg.draw(ctx);
		self.cxlogo.draw(ctx);



		//c.strokeStyle   = '#fff'; 

		for (i = 0; i < sf.length; i++) {
			sf[i].draw(ctx);
		}
		ctx.globalAlpha = a;

		if (self.flame) {
			self.flame.draw(ctx);
		}


		if (self.stats) {//statistics
			ctx.fillStyle = '#33e';
			ctx.font = 'italic bold 30px sans-serif';
			ctx.textBaseline = 'bottom';
			ctx.fillText(((1000.0 / self.elapsedTime) << 0) + 'fps', 100, 100);
			ctx.fillText(self.snowFlakes.length + 'flakes', 100, 200);
		}
		self.drawTimer = setTimeout(self.draw, 1);
		//self.canvas.style.transform="rotate(30deg)";
	};

	this.collides = function (obj, x, y) {
		var st = self.touch;

		if (st) {//
			for (var i = 0; i < self.stuckFlakes.length; i++) {
				var o = self.stuckFlakes[i];
				if (o.obj == obj) {
					return { x: st.x + o.dx, y: st.y + o.dy };
				}
			}
			var r = Math.sqrt((st.x - x) * (st.x - x) + (st.y - y) * (st.y - y));
			if (r < 30) {
				self.stuckFlakes.push({ obj: obj, dx: x - st.x, dy: y - st.y, t: self.lastFrameTime });
				return { x: obj.x, y: obj.y };
			}
		}
		if (x > self.cxlogo.x && y > self.cxlogo.y && x < self.cxlogo.x + self.cxlogo.width && y < self.cxlogo.height + self.cxlogo.y) {
			return self.cxlogo.collides(obj, x, y);
		}
		return false;
	}

	self.unStuckFlake = function (obj) {
		for (var i = 0; i < self.stuckFlakes.length; i++) {
			if (obj == self.stuckFlakes[i].obj) {
				self.stuckFlakes.splice(i, 1);
				return;
			}
		}
	};


	this.resize = function (w, h) {
		self.width = w;
		self.height = h;
		self.scale = { x: w / 1024.0, y: h / 768.0 };
		self.canvas.width = w;
		self.canvas.height = h;
		self.bg.width = w;
		self.bg.height = h;
		self.cxlogo.width = Math.floor(self.scale.x * 820 * 0.8);
		self.cxlogo.height = Math.floor(self.scale.y * 262 * 0.8);
		self.cxlogo.x = Math.floor(self.scale.x * 30);
		self.cxlogo.y = Math.floor(self.scale.y * 450);
		self.cxlogo.createCollisionMap();

		self.flame = new Flame(self.scale.x * 806.0, self.scale.y * 330.0);

		var numflakes = Math.max(Math.min(self.width * self.height * 0.001, 1000), 300);
		for (i = self.snowFlakes.length; i < numflakes; i++) {
			self.snowFlakes.push(new SnowFlake(Math.random() * self.width, Math.random() * self.height, 0, 1));
		}

		var card = document.getElementById('card');
		card.style.height = h + 'px';

	};

	this.onResize = function (w, h) {
		if (self.resizeTimer) {
			clearTimeout(self.resizeTimer);
		}

		self.resizeTimer = setTimeout(function () {
			self.resizeTimer = null;
			if (w == self.width && h == self.height) {
				return;
			}
			self.resize(w, h);
		}, 500);
	};

	this.createCanvas = function () {
		if (self.canvas) {
			self.deleteCanvas();
		}

		self.ctx = self.canvas.getContext('2d');
	}
	this.deleteCanvas = function () {

		self.canvas = null;
	};
}

var scene = new Scene();

function setReceipient() {
	var receipient = window.location.hash.substr(1);

	var to = document.getElementById('to');
	to.innerText = decodeURIComponent(receipient) || 'Deg';
}



window.onresize = function () {
	scene.onResize(window.innerWidth, window.innerHeight);
};

window.onload = function () {
	//alert(window.innerWidth);
	setReceipient();

	hideAddressBar();
	setTimeout(function () {
		flip(false, true);
	}, 5000);

	setTimeout(function () {
		scene.onLoad(document.getElementById('scenecanvas'), document.getElementById('canvascol'));
	}
		, 500);
};




var ondevicemotion = function (event) {
	event.acceleration = event.acceleration || { x: 0, y: 9.81, z: 0 };
	event.accelerationIncludingGravity = event.accelerationIncludingGravity || { x: 0, y: 9.81, z: 0 };
	if (event.acceleration.x === null) {
		event.acceleration.x = event.accelerationIncludingGravity.x = 0;
		event.acceleration.y = event.accelerationIncludingGravity.y = 9.81;
		event.acceleration.z = event.accelerationIncludingGravity.z = 0;
	}
	var ax = event.acceleration.x / 9.81,
		ay = -event.acceleration.y / 9.81,
		az = -event.acceleration.z / 9.81,
		gx = event.accelerationIncludingGravity.x / 9.81,
		gy = -event.accelerationIncludingGravity.y / 9.81,
		gz = -event.accelerationIncludingGravity.z / 9.81,
		landscape = scene.width > scene.height;

	if (landscape) {
		if (gx - ax < 0) {
			scene.gravx = gy;
			scene.gravy = -gx - 2 * ax;
		} else {
			scene.gravx = gy;
			scene.gravy = gx + 2 * ax;
		}
	} else {
		scene.gravx = gx;
		scene.gravy = gy + 2 * ay;
		/*if(gy-ay>0){
			scene.gravx = gx;
			scene.gravy = gy;			
		}else{
			scene.gravx = gx;
			scene.gravy = -gy;
		}*/
	}

};

window.addEventListener('devicemotion', ondevicemotion, true);


function flip(toFront, force) {
	var cssClass = "card";
	var cardElement = document.getElementById('card');
	if (toFront) {//we are on the flipside

	} else {
		if (force || scene.touch) {
			if (force || (scene.touch.x < scene.width / 10 && scene.touch.y < scene.height / 10)) {
				cssClass = "card flip";
			} else {
				return;
			}
		}
	}

	cardElement.setAttribute("class", cssClass); //For Most Browsers
	cardElement.setAttribute("className", cssClass); //For IE; harmless to other browsers.
}

function hideAddressBar() {
	if (!window.location.hash) {
		if (document.height < window.outerHeight) {
			document.body.style.height = (window.outerHeight + 50) + 'px';
		}
		setTimeout(function () { window.scrollTo(0, 1); }, 50);
	}
}


function startTouch(x, y) {
	scene.stuckFlakes = [];
	scene.touch = { x: x, y: y, time: scene.lastFrameTime };
}

document.addEventListener("touchstart", function () {
	event.preventDefault();
	startTouch(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
}, false);

document.addEventListener('mousedown', function (event) {
	startTouch(event.clientX, event.clientY);

}, false);

function endTouch() {
	flip(false);
	for (var i = 0; i < scene.stuckFlakes.length; i++) {
		scene.stuckFlakes[i].obj.speedx = scene.touch.dx * 2;
		scene.stuckFlakes[i].obj.speedy = scene.touch.dy * 2;
	}
	scene.stuckFlakes = [];
	scene.touch = false;
}

function touchMove(x, y) {
	scene.touch = { x: x, y: y, time: scene.lastFrameTime, dx: x - scene.touch.x, dy: y - scene.touch.y };
}


document.addEventListener('touchmove', function (event) {
	event.preventDefault();
	var touch = event.touches[0];
	touchMove(touch.pageX, touch.pageY);
}, false);

document.addEventListener('touchend', endTouch, false);



document.addEventListener('mousemove', function (event) {
	if (!scene.touch) {
		return;
	}
	touchMove(event.clientX, event.clientY);
}, false);

document.addEventListener('mouseup', endTouch, false);
