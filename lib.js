//Fast Fourier Transform
function FFT(x1){
	var n=x1.length;
	
	var x=s1(x1); //Swapp Numbers
	
	for(var l=2;l<=x.length;l=l*2){
		for(var i=0;i<x.length;i=i+l){
			for(var k=0;k<l/2;k++){
				var w= cExp(-2*Math.PI*k/(l));
		
				var ct=cMul(w,x[i+k+(l/2)]);
				var ct2=cSum( x[i+k],ct);
				var ct3=cSub( x[i+k],ct);
				
				x[i+k]=ct2;
				x[i+k+(l/2)]=ct3;
			}
		}
	}
	
	return x;
}
//Inverse Fourier Transform
function iFFT(x){
	for(var c=0;c<x.length;c++){
		x[c].imag=-1*x[c].imag;
	}
	var values=intFFT(x);
	for(var c=0;c<values.length;c++){
		values[c].imag=-1*values[c].imag/values.length;
		values[c].real=values[c].real/values.length;
	}
	return values;
}

//Hanning Window
//Apply Hanning Window
function HanningWindow(sam){
	var win=makeHann(sam.length);
	var wd=[];
	for(var i=0;i<sam.length;i++){
		wd[i]=win[i]*sam[i];
	}
	return wd;
}

//Extra Functions
//Calculate values for Hanning Window
function makeHann(n){
	var win=[];
	var arg=2*Math.PI/(n-1);
	for(var i=0;i<n;i++){
		win[i]=0.5-0.5*Math.cos(arg*i);
	}
	return win;
}

//Swap numbers for FFT
function s1(x){
	var N = x.length;
	var out=x.slice(0);
    for (var i = 0; i < N; i++) {
		var rer=revertBit(i,N);
       
        if (rer > i) {
			var aux=out[rer];
			out[rer]=out[i];
			out[i]=aux;
        }
    }
	return out;
}
//Reverse Bits
function revertBit(num,N){
	var bits= Math.floor(Math.log2(N));
	var b=0;
	
	for(var c=0;c<bits;c++){
		b=b<<1;
		var t= num & 1;
		b=b|t;
		num=num>>1;
	}
	
	return b;
}




