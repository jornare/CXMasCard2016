var Flame = function( x, y ){
	var self = this;
	this.x =x;
	this.y =y;
	this.particles = [];
	this.colors =[];
	this.flare = new Image();
	this.flare.src = 'img/flare.png';
	this.flare.setAttribute('crossOrigin', '');
	this.flareWidth=1;
	this.flareHeight=1;
	this.heatCenterY = 1;
	this.flare.onload = function(){
		self.flareWidth = self.flare.width * scene.scale.x;
		self.flareHeight = self.flare.height * scene.scale.y;
		self.heatCenterY = self.y - self.flareHeight * 0.2;
	};
	// prepare palette function
	this.preparePalette = function() {
	    for (var i = 0; i < 64; ++i) {
//	    	self.colors[i] = {r: 255, g: 255, b: 63-i << 1, a: 255-i};
//	    	self.colors[i+64] = {r: 0, g: 0, b: 0, a: 192-i};

	    	//fin gul flamme
	    	self.colors[i] = {r: 255, g: 255, b: (63-i) << 2, a: 255-i};
	    	self.colors[i+64] = {r: 255, g: 255-i, b: 0, a: 192-i};
	       
	    	
	    	/* self.colors[i + 0] = {r: 0, g: 0, b: i << 1, a: i};
	        self.colors[i + 64] = {r: i << 3, g: 0, b: 128 - (i << 2), a: i+64};
	        self.colors[i + 128] = {r: 255, g: i << 1, b: 0, a: i+128};
	        self.colors[i + 192] = {r: 255, g: 255, b: i << 2, a: i+192};*/
	    }
	}
	
	this.create = function(){
		self.preparePalette();
		for(var i=0; i<30;i++){
			this.particles.push(new Particle( self.x, self.y));
		}
	};

	this.move = function ( dt, ccol ){

	};
	
	this.melts = function( x, y ) {
		var xx = x - self.x,
			yy = (y - self.heatCenterY)*0.5;
		var r = Math.sqrt(xx*xx+yy*yy);
		if(r<100.0*scene.scale.x){
			r=1.0-r/100.0;
			return r*r*0.01*scene.elapsedTime;
		}
		return 0.0;
	}
	
	this.draw = function ( ctx ) {
		var numParticles = self.particles.length,
			xavg=0.0,
			colors=self.colors,
			numcolors = colors.length,
			i;
		
		ctx.fillStyle = "black";
		ctx.globalCompositeOperation = "lighter";

		for(i = 0; i < numParticles; i++)
		{
			xavg+= self.x -self.particles[i].location.x;
		}
		xavg /=numParticles;
		
		ctx.drawImage(self.flare, self.x-self.flareWidth/2 - xavg , self.y-self.flareHeight/2, self.flareWidth, self.flareHeight);
		ctx.globalCompositeOperation = "source-over";
		for(i = 0; i < numParticles; i++)
		{
			var p = self.particles[i],
				index = Math.min((10+self.y-p.location.y)<<0,numcolors-1);
			if(index<0){
				index=0;
			}else if(index>40){
				index=40;
			}
			var c = colors[index];
			ctx.beginPath();
			//changing opacity according to the life.
			//opacity goes to 0 at the end of life of a particle
			p.opacity = Math.round(p.remaining_life/p.life*100)/100
			//a gradient instead of white fill
			var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
			gradient.addColorStop(0, "rgba("+c.r+", "+c.g+", "+c.b+", "+c.a+")");
			gradient.addColorStop(1, "rgba("+c.r+", "+c.g+", "+c.b+", 0)");
			ctx.fillStyle = gradient;
			ctx.arc(p.location.x, p.location.y, p.radius, TwoPI, false);
			ctx.fill();
			
			//lets move the particles
			p.remaining_life-=scene.elapsedTime;
			p.radius-=scene.elapsedTimeSeconds*20;
			
			
			p.location.x += p.speed.x*scene.elapsedTime;////p.speed.x*(scene.gravx+1.0)*5;
			p.location.y += p.speed.y*scene.elapsedTime;//p.speed.y*(scene.gravy+1.0)*5;
			
			//regenerate particles
			if(p.remaining_life < 0 || p.radius < 0)
			{
				//a brand new particle replacing the dead one
				self.particles[i] = new Particle(self.x, self.y);
			}
		}
	
	};
	this.create();
}


var Particle = function(x, y){
	this.speed = {x: -(scene.gravx*4+Math.random())*0.02, y: -(scene.gravy*4+Math.random())*0.02};
	this.location = {x: x, y: y};
	var size = scene.height/60;
	//radius range = 10-30
	this.radius = size*1.5+Math.random()*size*1;
	//life range = 20-30
	this.life = (size+Math.random()*size)*25;
	this.remaining_life = this.life;


};




