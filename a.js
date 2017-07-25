var context= new window.AudioContext();
var index=0;
var n=4096;

var reader;
var input;
var buf;
var audioBuffer;
var saida=new Array();
var samples;

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
//ctx.translate(600, 250);
//ctx.rotate(Math.PI);
//ctx.translate(-600, -250);

var bstart= document.getElementById("start");
bstart.onclick=function (e){
	setup();
}

function setup(){
	samples= (audioBuffer.getChannelData(0)).slice(0);
	
	setInterval(function (){
		var toCopy= samples.slice(index,index+4800);
		
		
		
		var data=new Array();
		var c;
		for(c=0;c<n;c++){
			var ct={
				real:toCopy[c],
				imag:0				
			};
			data[c]=ct;
		}
		
		var f=FFT(data);
		
		var mags=calcularMags(f);
		
		limpar();
		
		desenharMags(mags);
		
		index=index+4800;
	},50);
	ctx.fillRect(10,10,10,10);
	play(audioBuffer);
	
}

function limpar(){
	ctx.clearRect(0,0,600,400);
}

function calcularMags(freq){
	var mags=new Array();
	var c;
	for(c=0;c<freq.length;c++){
		mags[c]= Math.sqrt( Math.pow( freq[c].real,2 )+ Math.pow(freq[c].imag ,2 ));
	}
	return mags;
}

function desenharMags(mags){
	
	var d=0;
	for(var c=0;c<=600;c++){
		var magmedia=mags[c];
		ctx.fillRect(c,100,1,magmedia);
		
	}
	
}














