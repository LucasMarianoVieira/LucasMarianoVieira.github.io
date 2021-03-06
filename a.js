var context= new window.AudioContext();
var index=0;
var n=512;

var reader;
var input;
var buf;
var audioBuffer;
var saida=new Array();
var samples;
var lev=new Array();
var mags;

function play(buffer){
	var source =context.createBufferSource();
	source.buffer=buffer;
	source.connect(context.destination);
	source.start();
}
function readFile(file, onLoadCallback){
	reader = new FileReader();
	reader.onload = onLoadCallback;
	reader.readAsArrayBuffer(file);
}
var openFile = function(event) {
	input = event.target;

	reader = new FileReader();
	reader.onloadstart = function() {
		reader.abort();
	};

	reader.onloadend = function() {
	console.log(reader.error.message);
};

	readFile(input.files[0],function (){
		buf=reader.result;
		context.decodeAudioData(buf,function (data){ audioBuffer=data; setup()});
		console.log("loaded");
	})
};
		
var canvas= document.getElementById("canvas");
var ctx=canvas.getContext("2d");	

//ctx.translate(300,200);
//ctx.scale(1,-1);
//ctx.translate(-300,-200);

ctx.translate(300,200);
ctx.rotate(-Math.PI/2);

ctx.fillStyle="green";


function setup(){
	var up=10;
	var fps=30;
	var inc=audioBuffer.sampleRate/up;
	samples= (audioBuffer.getChannelData(0)).slice(0);
	var c;
	for(c=0;c<n;c++){
		lev[c]=0;
	}
	
	setInterval(function (){
		var toCopy= samples.slice(index,index+inc);
		
		
		
		var data=new Array();
		var c;
		for(c=0;c<n;c++){
			var ct={
				real:toCopy[c*Math.floor(inc/n)],
				imag:0				
			};
			data[c]=ct;
		}
		
		var f=FFT(data);
		
		mags=calculateMags(f);
		lev=updateLevels(mags,lev);
				
		index=index+inc;
	},1000/up);
	
	play(audioBuffer);
	
	setInterval(function(){
		clear();
		lev=animate(lev);
		drawMags(lev);
		
	},33);
	
}

function animate(levels){
	var out=new Array();
	var speed=10;
	var c;
	for(c=0;c<levels.length;c++){
		if(levels[c]>=speed){
			out[c]=levels[c]-speed;		
		}else{
			out[c]=0;
		}
	}
	return out;
}
function updateLevels(mags,levels){
	var out=new Array();
	var c;
	for(c=0;c<mags.length;c++){
		if(mags[c]>levels[c]){
			out[c]=mags[c];
		}else{
			out[c]=levels[c];
		}
	}
	return out;
}

function clear(){
	ctx.clearRect(-1000,-1000,2000,2000);
}

function calculateMags(freq){
	var groups=[6,6,6,6,8,8,12,12,16,16,16,16,64,64,128,128];
	//var groups=[2,2,2,2,6,8,8,8,8,24,24,24,28,30,36,44];
	//var groups=[32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32];
	var mags=new Array();
	
	var c,d;
	var off=0;
	for(d=0;d<groups.length;d++){
		var aux=0;
		for(c=0;c<groups[d];c++){
			aux+= Math.sqrt( Math.pow( freq[off].real,2 )+ Math.pow(freq[off].imag ,2 ));
			off++;
		}
		aux=30*aux/groups[d];
		if(aux>200){
			aux=200;			
		}		
		mags[d]=aux;
	}
	return mags;
}

function drawMags(mags){
	
	/*var d=0;
	for(var c=0;c<=16;c++){
		var magmedia=mags[c];
		ctx.fillRect(c*32+10,10,30,magmedia);
		
	}*/
	
	/*var inc=2*Math.PI/16;
	
	for(var c=0;c<=16;c++){
		var magmedia=mags[c];
		
		ctx.rotate(c*inc);
		ctx.fillRect(0,-5,100+magmedia,10);
		ctx.rotate(-c*inc);
		
	}
	
	ctx.rotate(2*Math.PI/240);*/
	
	var inc=2*Math.PI/16;
	ctx.beginPath();
	ctx.moveTo(30+mags[0],0);
	
	for(var c=0;c<=16;c++){
		var magmedia=mags[c];
		
		ctx.rotate(c*inc);
		ctx.rotate(-inc/2);
		ctx.lineTo(30,0);
		ctx.rotate(inc/2);
		ctx.lineTo(30+magmedia,0);
		ctx.rotate(inc/2);
		ctx.lineTo(30,0);
		ctx.rotate(-inc/2);
		ctx.rotate(-c*inc);
		
	}
	ctx.lineTo(30+mags[0],0);
	ctx.stroke();
	ctx.closePath();
	
	ctx.rotate(2*Math.PI/240);
	
}














