var mousePos;
var NODE_RADIUS = 20;
var SPINNER_RADIUS = 10;
var allWheels=[];
var selectedWheels=[];
//Wheel object
var SoundWheel = function(initPosition){
	//position of wheel node
	this.x=initPosition.x;
	this.y=initPosition.y;
	//color + sound
	this.color=getColor();
	this.sound=getSound();
	//spinners/selection
	this.selected = true;
	this.spinners = [];
	this.spinning = true;
	//reference angle stuff
	this.trueAngle = 0;
	this.angleStep= .08;
	this.reverseSpin = function() {
		this.angleStep*=-1;
	}
	//create a spinner
	this.createSpinner = function(parent,xPos,yPos){
		var newSpinner = new Spinner(parent,xPos,yPos);
		(this.spinners).push(newSpinner);
		this.spinning=true;
	}
	
	//remove last placed spinner
	this.removeSpinner = function() {
		delete (this.spinners).pop();
	}
	//sets selected
	this.setSelected = function(bool) {
		this.selected=bool;
	}
	//stops all current children of spinner from following mouse
	this.stopFollowing = function() {
		for (j=0;j<(this.spinners).length;j++) {
			targetSpinner = this.spinners[j];
			targetSpinner.setFollow(false);
		}
	}
	//updates angle and all spinners
	this.update = function() {
		this.trueAngle+=this.angleStep;
		if (this.trueAngle >= (Math.PI*2)*400) {
			this.trueAngle=0;
		}
		if (this.spinning==true){
			for (j=0;j<(this.spinners).length;j++) {
				targetSpinner = this.spinners[j];
				targetSpinner.followMouse();
				targetSpinner.updateS(this.trueAngle);
			}
		}
	}
	//renders node and all children
	this.render = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, NODE_RADIUS, 0, 2*Math.PI, false);
		if (this.selected == true) {
			ctx.fillStyle = "white";
		} else {
			ctx.fillStyle = this.color;
		}
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = this.color;
		ctx.stroke();
		ctx.closePath();
		if (this.spinning==true){
			for (j=0;j<(this.spinners).length;j++) {
				targetSpinner = this.spinners[j];
				targetSpinner.renderS();
			}
		}
	}
}
//Spinner object
var Spinner = function(parent,initX,initY) {
	//parent is used for updating relative to mouse
	this.parent = parent;
	//temporarily because we need x and y vars
	this.x = initX;
	this.y = initY;
	this.sound = new Audio();
	this.sound.src = parent.sound.src;
	this.sound.volume = 1-parent.y/canvas.height;
	
	//radius is pythagorean
	this.spinRadius = Math.sqrt((initX-parent.x)*(initX-parent.x)+(initY-parent.y)*(initY-parent.y));
	//angleOffset is ???
	this.angleOffset = parent.trueAngle;
	//idk
	this.oldAngle = 0;
	//this makes it spin differnetly depending on how far out the child is
	this.refAngle = 80/this.spinRadius;
	//following status
	this.follow=true;
	//update spinner angle + pos
	this.updateS = function(angle){
		angle-=this.angleOffset;
		angle*=this.refAngle;
		if ((angle%(2*Math.PI))>0 && (angle%(2*Math.PI))<.1) {
			this.playSound();
		}
		this.oldAngle = this.refAngle;
		this.x=parent.x+(this.spinRadius)*Math.cos(angle);
		this.y=parent.y+(this.spinRadius)*Math.sin(angle);
	}
	//render spinner
	this.renderS = function(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, SPINNER_RADIUS, 0, 2*Math.PI, false);
		ctx.fillStyle = parent.color;
		ctx.fill();
		ctx.lineWidth = 1;
		ctx.strokeStyle = parent.color;
		ctx.stroke();
	}
	//follow the mouse!
	this.followMouse = function(){
		if (this.follow==true) {
		this.spinRadius = Math.sqrt((mousePos.x-parent.x)*(mousePos.x-parent.x)+(mousePos.y-parent.y)*(mousePos.y-parent.y));
		this.refAngle = 80/this.spinRadius;
		}
	}
	//setter for following
	this.setFollow = function(initFollow){
		this.follow=initFollow;
	}
	this.playSound = function() {
		this.sound.currentTime=0;
		this.sound.play();
	}
}
//generate a random color
function getColor() {
	var red = Math.floor(Math.random()*256);
	var green = Math.floor(Math.random()*256);
	var blue = Math.floor(Math.random()*256);
	return "rgba("+red+","+green+","+blue+","+1+")";
}
function getSound(initPosition) {
	//divide canvas into seven parts
	var myPos = Math.floor(mousePos.x*7/canvas.width);
	switch (myPos){
		case 0:
			return lowC;
		case 1:
			return lowD;
		case 2:
			return lowE;
		case 3:
			return lowF;
		case 4:
			return midG;
		case 5:
			return midA;
		case 6:
			return midB;
		default:
			return lowC;
	}
}
//returns coordinates of mouse on canvas.
function getMouseCoords(event) {
	var x,y;
	x=(event.pageX);
	y=(event.pageY);
	x-=mainCanvas.offsetLeft;
	y-=mainCanvas.offsetTop;
    return {"x": x, "y": y};
}
//returns clicked on planet
function checkClickWheel() {
	var mousex = mousePos.x;
	var mousey = mousePos.y;
	for (j=0;j<allWheels.length;j++) {
		if ((Math.sqrt((mousex-allWheels[j].x)*(mousex-allWheels[j].x)+(mousey-allWheels[j].y)*(mousey-allWheels[j].y)))<NODE_RADIUS){
			allWheels[j].setSelected(true);
			return allWheels[j];
		}
	}
	return null;
}
//handler initiation
var keysDown = new Array();
function loadHandlers(){
	document.addEventListener('keydown',function (e) {
		keysDown[e.keyCode] = true;
		if (e.keyCode==90) { //Z
			createSpinnerHandler();
		}
		if (e.keyCode==88) { //X
			removeSpinnerHandler();
		}
		if (e.keyCode==67) { //C
			stopFollowingHandler();
		}
		if (e.keyCode==70) { //F
			removeWheelHandler();
		}
	},false);
	document.addEventListener('keyup',function (e) {
		delete keysDown[e.keyCode];
	},false);
	
	canvas.addEventListener('mousemove',function(event) {
		mousePos = getMouseCoords(event);
	},false);
	//on click, create a new wheel at click location
	canvas.addEventListener('click',function(event) {
		createWheelHandler();
	},false);
}
//render background
function renderBackground() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
}
//render background and then all wheels and whatever
function renderAll() {
	renderBackground();
	for (i=0;i<allWheels.length;i++){
		allWheels[i].update();
		allWheels[i].render();
	}
}
//timer + initiation
var timer = setInterval();
function main() {
	loadHandlers();
	timer = setInterval(renderAll,10);
}

//create a wheel at event position, push wheel into allWheels and selected wheels
function createWheelHandler() {
	var selection = checkClickWheel();
	if (selectedWheels.length==0) {
		if (selection!=null) {
			selectedWheels.push(selection);
		}
		else {
			var newWheel = new SoundWheel(mousePos);
			allWheels.push(newWheel);
			selectedWheels.push(newWheel);
		}
	}
	else {
		if (selection!=null) {
			selectedWheels.push(selection);
		}
		else {
			stopFollowingHandler();
			for (j=0;j<selectedWheels.length;j++) {
				selectedWheels[j].setSelected(false);
			}
			selectedWheels = [];
		}
	}
}
//remove all selected wheels
function removeWheelHandler() {
	for (i=0;i<selectedWheels.length;i++) {
		delete allWheels[allWheels.indexOf(selectedWheels[i])];
		if (allWheels.length<=0) {
			
		} else {allWheels=[];}
		selectedWheels=[];
	}
}
//create a spinner for all selected wheels
function createSpinnerHandler() {
	for (i=0;i<selectedWheels.length;i++){
		selectedWheels[i].createSpinner(selectedWheels[i],mousePos.x,mousePos.y);
	}
}

//remove a spinner from all selected wheels
function removeSpinnerHandler() {
	for (i=0;i<selectedWheels.length;i++){
		selectedWheels[i].removeSpinner();
	}
}

function stopFollowingHandler() {
	for (i=0;i<selectedWheels.length;i++){
		selectedWheels[i].stopFollowing();
	}
}