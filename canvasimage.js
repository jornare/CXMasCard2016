var CanvasImage = function( x, y, width, height, src, collisionMap ){
	var self = this;
	this.x=x;
	this.y=y;
	this.width=width || 0.0;
	this.height=height || 0.0;
	this.img = new Image();
	this.img.src = src;
	this.canvas = document.createElement('canvas');
	this.collisionMap = collisionMap?[]:false;

	this.img.onload = function(){
		if(self.collisionMap===false){
			return;
		}
		self.createCollisionMap();
	};

	this.move = function ( dt ){
		return;
		/*
		var frames = 1/dt;
		var angularspeed = Math.sqrt(self.speedx*self.speedx+self.speedy*self.speedy);
		var airresx = 0, airresy=0;
		var accx, accy;//acceleration
		accx = (scene.gravx + scene.wind + (Math.random() * 0.2) - 0.1) ;
		accy = (scene.gravy + (Math.random() * 0.2 ) - 0.1) ;

		airresx = 0.01*(self.speedx * self.speedx);
		airresx = 0.01*(self.speedy * self.speedy);

		self.speedx += (accx - airresx) * frames;
		self.speedy += (accy - airresy) * frames;
		self.x += self.speedx;
		self.y += self.speedy;
*/
	};
	
	this.collides =  function(obj, x,y){
		var xx = Math.round(x-self.x),
			yy = Math.round(y-self.y),
			l = xx + yy*self.width;
		if(xx<0 || xx>self.width || yy<0 || yy>self.height || l<0 || l>self.collisionMap.length){
			return false;
		}
		if(self.collisionMap[l]>0){
			return {x:obj.x,y:obj.y};
		}
		
		return false;
	}
	
	this.createCollisionMap = function(){
		self.collisionMap=[];
		var canvas = document.createElement('canvas'), i,t=0;
		canvas.width=self.width;
		canvas.height=self.height;
		var ctx = canvas.getContext('2d');

		ctx.drawImage(self.img,0,0,self.width,self.height);
		var imageData = ctx.getImageData(0,0,self.width,self.height).data;
		for (var i=3; i<imageData.length; i+=4) {
			self.collisionMap[t] = imageData[i];
			t++;
		}
	};
	
	this.draw = function ( ctx ) {
		ctx.drawImage(self.img, self.x, self.y, self.width, self.height);
	};
	
}

