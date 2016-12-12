var Text = function(text,  x, y ){
	var self = this;
	this.text = text;
	this.x=x;
	this.y=y;


	this.move = function ( dt ){
		return;

	};
	
	this.collides =  function(obj, x,y){

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
		ctx.fillStyle = 'rgba(0,0,255,0.5)';
		ctx.shadowColor="red";
		ctx.shadowOffsetX=2;
		ctx.shadowOffsetY=2;
		ctx.font = 'italic bold 30px sans-serif';
		ctx.textBaseline = 'bottom';
		ctx.fillText(self.text[0],self.x,self.y);
		ctx.shadowOffsetX=0;
		ctx.shadowOffsetY=0;
	};
	
}

