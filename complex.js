//Complex numbers manipulation functions

//Sum
function cSum(c1,c2){
	var ct={
		real: c1.real+c2.real,
		imag: c1.imag+c2.imag
	};
	return ct;
}
//Subtration
function cSub(c1,c2){
	var ct={
		real: c1.real-c2.real,
		imag: c1.imag-c2.imag
	};
	return ct;
}
//Multiplication
function cMul(c1,c2){
	var ct={
		real: c1.real*c2.real-c1.imag*c2.imag,
		imag: c1.real*c2.imag+c1.imag*c2.real
	};
	return ct;
}
//Division
function cDiv(c1,a){
	var ct={
		real: c1.real/a,
		imag: c1.imag/a
	};
	return ct;
}
//Convert complex number from exponential form to a+bi form
function cExp(theta){
	var ct={
		real: Math.cos(theta),
		imag: Math.sin(theta)
	};
	return ct;
}

