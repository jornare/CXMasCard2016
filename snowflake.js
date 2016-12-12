var PI2=Math.PI*2;
var snowFlakeImg = new Image();
snowFlakeImg.src = "img/snowflake.png";
//var snowflake = 

var SnowFlake = function( x, y, speedx, speedy ){
	var self = this;
	this.x=x;
	this.y=y;
	this.speedx=speedx || 0.0;
	this.speedy=speedy || 0.0;
	this.life=1.0;
	this.size = scene.scale.x*Math.random()*4+2;

	this.move = function ( dt ){
		var frames = dt/100,newx,newy;
		var angularspeed = Math.sqrt(self.speedx*self.speedx+self.speedy*self.speedy);
		var airresx = 0, airresy=0;
		var accx, accy;//acceleration
		accx = (scene.gravx + scene.wind + (Math.random() ) - 0.5) ;
		accy = (scene.gravy + (Math.random() * 0.2 ) - 0.1) ;

		airresx = 0.005 * (self.speedx * self.speedx); airresx = self.speedx >= 0.0?-airresx:airresx;
		airresy = 0.02 * (self.speedy * self.speedy); airresy = self.speedy >= 0.0?-airresy:airresy;

		self.speedx += (accx + airresx);
		self.speedy += (accy + airresy);

		
		newx=self.x + self.speedx * frames;
		newy=self.y + self.speedy * frames;
		
		var collisionpos = scene.collides(self, newx,newy);
		if(collisionpos){
			self.x = collisionpos.x;
			self.y = collisionpos.y;
			self.speedx = 0;
			self.speedy = 0;			
		}else{
			self.x=newx;
			self.y=newy;
		}
	};
	
	this.draw = function ( ctx ) {
		var s = (self.size*self.life), ss=2*s;
		//var a = ctx.globalAlpha;
		if(self.life!=ctx.globalAlpha)
			ctx.globalAlpha = self.life;
		ctx.drawImage(snowFlakeImg, self.x-s, self.y-s, ss, ss);
		//ctx.globalAlpha = a;
		/*var gradient = ctx.createRadialGradient(self.x, self.y, 0, self.x, self.y, 4);
		gradient.addColorStop(0, "rgba(255,255,255,255)");
		//gradient.addColorStop(0.05, "rgba("+c.r+", "+c.g+", "+c.b+", "+c.a+")");
		gradient.addColorStop(1, "rgba(255,255,255,0)");
		ctx.fillStyle = gradient;
		ctx.arc(self.x, self.y, 4, PI2, false);
		ctx.fill();		*/
		/*
		ctx.beginPath();
		ctx.arc(self.x, self.y, 2, 0, 2PI);
		ctx.stroke();*/
	};

}

