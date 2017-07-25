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
		console.log("loaded");
		context.decodeAudioData(buf,function (data){ audioBuffer=data});
	})
};
		
var canvas= document.getElementById("canvas");
var ctx=canvas.getContext("2d");	

ctx.translate(300,200);
ctx.scale(1,-1);
ctx.translate(-300,-200);
ctx.fillStyle="green";

var bstart= document.getElementById("start");
bstart.onclick=function (e){
	setup();
}

function setup(){
	samples= (audioBuffer.getChannelData(0)).slice(0);
	var c;
	for(c=0;c<n;c++){
		lev[c]=0;
	}
	
	setInterval(function (){
		var toCopy= samples.slice(index,index+4800);
		
		
		
		var data=new Array();
		var c;
		for(c=0;c<n;c++){
			var ct={
				real:toCopy[c*8],
				imag:0				
			};
			data[c]=ct;
		}
		
		var f=FFT(data);
		
		mags=calcularMags(f);
		lev=updateLevels(mags,lev);
				
		index=index+4800;
	},50);
	
	play(audioBuffer);
	
	setInterval(function(){
		limpar();
		lev=animate(lev);
		desenharMags(lev);
		
	},30);
	
}

function animate(levels){
	var out=new Array();
	var speed=1;
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

function limpar(){
	ctx.clearRect(0,0,600,400);
}

function calcularMags(freq){
	var groups=[6,6,6,6,8,8,12,12,16,16,16,16,64,64,128,128];
	var mags=new Array();
	
	var c,d;
	var off=0;
	for(d=0;d<groups.length;d++){
		var aux=0;
		for(c=0;c<groups[d];c++){
			aux+= Math.sqrt( Math.pow( freq[off].real,2 )+ Math.pow(freq[off].imag ,2 ));
			off++;
		}
		aux=aux/groups[d];
		mags[d]=aux;
	}
	return mags;
}

function desenharMags(mags){
	
	var d=0;
	for(var c=0;c<=16;c++){
		var magmedia=mags[c];
		ctx.fillRect(c*32+10,10,30,20*magmedia);
		
	}
	
}














