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
	this.color=getColor(initPosition);
	this.sound="none"
	//spinners
	this.spinners = [];
	this.activeSpinners = [];
	this.spinning = true;
	//reference angle stuff
	this.trueAngle = 0;
	this.angleTimer = setInterval();
	//constructor
	this.htmlCode;
	this.createWheel = function(){
		var newWheel = "<div id = 'newWheel' class = 'Wheel' x="+(this.x)+" y="+(this.y)+" color="+(this.color)+"></div>"
		$(newWheel).appendTo(document.body);
		this.htmlCode = $("#newWheel");
		$("#newWheel").css({top:this.y-NODE_RADIUS,left:this.x-NODE_RADIUS,position:'absolute',background:this.color});
		$("#newWheel").removeAttr("id");
		this.startTimer();
	}
	this.removeWheel = function(){
		for (i=0;i<this.spinners.length;i++) {
			this.spinners[i].removeSpinner();
		}
		var myIndex = jQuery.inArray(this,allWheels);
		this.htmlCode.remove();
		allWheels.splice(myIndex,1);
	}
	this.startTimer = function(){
		var myWheel = this;
		this.angleTimer = setInterval(function(){
			myWheel.trueAngle+=.1
			if (myWheel.trueAngle>=Math.PI*400){
				myWheel.trueAngle=0;
			}
			myWheel.updateSpinners();
		},1);
	}
	this.stopTimer = function(){
		clearInterval(this.angleTimer);
	}
	this.getAngle = function(){
		return this.trueAngle;
	}
	//select wheel
	this.selectWheel = function(){
		selectedWheels.push(this);
	}
	//create a spinner
	this.createSpinner = function(parent,xPos,yPos){
		var newSpinner = new Spinner(parent,xPos,yPos);
		newSpinner.createSpinner();
		this.spinners.push(newSpinner);
		this.activeSpinners.push(this.spinners.length-1);
	}
	this.updateSpinners = function() {
		for (i=0;i<this.activeSpinners.length;i++) {
			targetSpinner = this.spinners[this.activeSpinners[i]];
			targetSpinner.updateSpinner(this.trueAngle);
		}
	}
}
//Spinner object
var Spinner = function(parent,initX,initY) {
	this.parent = parent;
	this.x = initX-SPINNER_RADIUS;
	this.y = initY-SPINNER_RADIUS;
	this.spinRadius = Math.sqrt((initX-parent.x)*(initX-parent.x)+(initY-parent.y)*(initY-parent.y));
	this.angleOffset = parent.trueAngle-Math.random()*Math.PI*2;
	this.oldAngle = parent.trueAngle;
	this.refAngle = 72/this.spinRadius;
	this.spinning=true;
	this.htmlCode;
	this.createSpinner = function(){
		var newSpinner = "<div id = 'newSpinner' class = 'Spinner' x="+this.x+" y="+this.y+"></div>"
		$(newSpinner).appendTo(document.body);
		this.htmlCode = $("#newSpinner");
		$("#newSpinner").css({top:this.y,left:this.x,position:'absolute',background:this.parent.color});
		$("#newSpinner").removeAttr("id");
	}
	this.startSpinning = function(){
	}
	this.stopSpinning = function() {
	}
	this.updateSpinner = function(angle){
		angle-=this.angleOffset;
		angle*=this.refAngle;
		this.x=parent.x-SPINNER_RADIUS+(this.spinRadius)*Math.cos(angle);
		this.y=parent.y-SPINNER_RADIUS+(this.spinRadius)*Math.sin(angle);
		if (this.x>=$(document.body).width-20) {
			this.x=-200;
		}
		if (this.y>=Math.max($(document.body).height()-25,/* For opera: */document.documentElement.clientHeight-25)) {
			this.y=-200;
		}
		this.htmlCode.css({top:this.y,left:this.x});
	}
	return this;
}
function getColor(initPosition) {
	var red = Math.floor(Math.random()*256);
	var green = Math.floor(Math.random()*256);
	var blue = Math.floor(Math.random()*256);
	return "rgb("+red+","+green+","+blue+")";
}
function getNote(initPosition) {
}
//returns coordinates of mouse on canvas.
function getMouseCoords(event) {
	var x,y;
	x=(event.pageX);
	y=(event.pageY);
    return {"x": x, "y": y};
}
//handler initiation
var keysDown = new Array();
function loadHandlers(){
	body = $(document.body);
	mainPanel = $("#mainPanel");
	body.bind('keydown',function (e) {
		keysDown[e.keyCode] = true;
	});
	body.bind('keyup',function (e) {
		delete keysDown[e.keyCode];
	});
	
	body.mousemove(function(event) {
		mousePos = getMouseCoords(event);
	});
	//on click, create a new wheel at click location
	mainPanel.click(function(event) {
		if (90 in keysDown) {
			createSpinnerHandler();
		} else {
			createWheelHandler();
		}
	});
}
//initiator function
function main() {
	$("#Loading").remove();
	$("<div id = 'mainPanel'></div>").appendTo(document.body);
	loadHandlers();
}

//create a wheel at event position, push wheel into allWheels
function createWheelHandler() {
	var newWheel = new SoundWheel(mousePos);
	allWheels.push(newWheel);
	newWheel.createWheel();
	newWheel.selectWheel();
}
function createSpinnerHandler() {
	for (i=0;i<selectedWheels.length;i++){
		selectedWheels[i].createSpinner(selectedWheels[i],mousePos.x,mousePos.y);
	}
}