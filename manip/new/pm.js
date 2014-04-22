//load default img, after loading start canvas
function initImg() {
	myImage.onload = function() {initCanvas();}
	myImage.src = "mountains.jpg";
}
//initalize canvas
function initCanvas(){
	//calculate image dimensions
	i_width = Math.floor(myImage.width/3)+40;
	i_height = Math.floor(myImage.height/3)+20;
	
	//append canvas and initialize canvas vars
	$("#container").append("<canvas id = 'canvas' width = "+i_width+" height = "+i_height+">Canvas not supported</canvas>");
	canvas = $("#canvas")[0];
	ctx = canvas.getContext('2d');
	
	//init event listeners and manipulation controls
	initListeners();
	initControls();
	
	//draw image and save base undo case
	render();
	pixels = ctx.getImageData(0,0,i_width+40,i_height+20);
	archive.push(pixels);
}
//render???? idk if this is needed
function render() {
	ctx.drawImage(myImage,20,10,i_width-40,i_height-20);
	ctx.strokeRect(selection.startx,selection.starty,selection.width,selection.height);
}
//update render
function updateR() {
	ctx.putImageData(pixels,0,0);
}
//hardcoded manipulation func
function manip(){
	if (selection.pixels!=null){
		updateR();
		for (i=0;i<selection.pixels.data.length;i+=4){
			var moveOver = i+Math.floor(offsetX*selection.pixels.width);
			if ((moveOver)>selection.pixels.data.length) {
				moveOver=Math.floor(moveOver%selection.pixels.data.length);
			}
			if (selection.pixels.data[i]<r){
				selection.pixels.data[i]=selection.pixels.data[moveOver];
			}
			if (selection.pixels.data[i+1]<g){
				selection.pixels.data[i+1]=selection.pixels.data[moveOver+1];
			}
			if (selection.pixels.data[i+2]<b){
				selection.pixels.data[i+2]=selection.pixels.data[moveOver+2];
			}
			selection.pixels.data[i+3]=selection.pixels.data[moveOver+3];
		}
		ctx.putImageData(selection.pixels,selection.startx,selection.starty);
		pixels = ctx.getImageData(0,0,i_width,i_height);
		archive.push(pixels);
		if (selection.startx!=null) {
			ctx.strokeRect(selection.startx,selection.starty,selection.width,selection.height);
		}
	}
}
//init listeners
function initListeners(){
	canvas.addEventListener('mousedown',function(e) {
		mouseClicked(e);
	},false);
	canvas.addEventListener('mouseup',function(e) {
		mouseReleased(e);
	},false);
	canvas.addEventListener('mousemove',function(e) {
		mousePos = getMouseCoords(e);
	},false);
	//z to manip x to undo
	document.addEventListener('keydown',function(e) {
		if (e.keyCode==90) { //z
			if (state!=STATE_SELECTING) 
				manip();
		}
		if (e.keyCode==88) { //x
			undo();
		}
	},false);
}
//add controls
function initControls(){
	//buttons
	$("#container").append("<div id = 'controls'>Drag your mouse on the image, adjust the sliders below (the black one is the most important), and press 'z'.<br/></div>");
	$("#controls").append("<input type = 'button' class = 'brushButton' onclick = 'setModeSelect();'>manipulate(z)</input>");
	$("#controls").append("<input type = 'button' class = 'manipButton' onclick = 'manip();'>undo(x)</input><br />");

	//sliders
	$("#controls").append("<br /><table id = 'sliderTable'></table>");
	
	//color sliders
	$("#sliderTable").append("<tr id = 'colorRow'></tr>");
	$("#colorRow").append("<td id = 'r' class = 'slide'></td>");
	$("#colorRow").append("<td id = 'g' class = 'slide'></td>");
	$("#colorRow").append("<td id = 'b' class = 'slide'></td>");
	
	//offset sliders
	$("#sliderTable").append("<tr id = 'offsetRow'></tr>");
	$("#offsetRow").append("<td id = 'x' class = 'slide'></td>");
	//$("#offsetRow").append("<td id = 'y' class = 'slide'></td>");
	
	//add sliders to slides
	$(".slide").append(
	"<div class = 'slideNub' onmousedown = 'sliderClicked();'" +
	"onmouseup = 'sliderReleased(event);' onmousemove = 'sliderMoved(event);'"+
	"onmouseout = 'sliderReleased(event);'></div>");
}
//constants, there should be a better way to do this
var slider_clicked,r,g,b;
r=0;
g=0;
b=0;
var offsetX=0;
var offsetY=0;
//slider functinos
function sliderClicked() {  slider_clicked=true;  }
//update slider values on release
function sliderReleased(e) {  
	slider_clicked=false; 
	switch ($(e.target).parent().attr('id')) {
		case "r":
			r=getSliderValue($(e.target));
			break;
		case 'g':
			g=getSliderValue($(e.target));
			break;
		case 'b':
			b=getSliderValue($(e.target));
			break;
		case 'x':
			offsetX=getSliderValue($(e.target));
			break;
		case 'y':
			offsetY=getSliderValue($(e.target));
			break;
		default:break;
	}
}
//display slide
function sliderMoved(e) {
	if (slider_clicked){
		$(e.target).offset({left:e.pageX-15});
		if ($(e.target).offset().left<$(e.target).parent().offset().left){
			$(e.target).offset({left:$(e.target).parent().offset().left});
		}
		if ($(e.target).offset().left>$(e.target).parent().offset().left+170){
			$(e.target).offset({left:$(e.target).parent().offset().left+170});
		}
	}
}
//return slider value as a percentage(.xx = xx%)
function getSliderValue(initSlider) {
	return Math.floor((initSlider.offset().left-initSlider.parent().offset().left)*255/170);
}
//canvas mouse events
function mouseClicked(event) {
	switch (state) {
		case STATE_DEFAULT:
			startSelect(event);
			break;
		case STATE_SELECT:
			startSelect(event);
			break;
		default:
			break;
	}
}
function mouseReleased(event) {
	switch (state) {
		case STATE_DEFAULT:
			break;
		case STATE_SELECT:
			break;
		case STATE_SELECTING:
			stopSelect(event);
			break;
		default:
			break;
	}
}
//returns mouse coordinates
function getMouseCoords(event) {
	var x,y;
	x=(event.pageX);
	y=(event.pageY);
	x-=	$("#container").offset().left;
	y-= $("#container").offset().top;
    return {"x": x, "y": y};
}
//set select flags
function setModeSelect() {
	selection.clear();
	state = STATE_SELECT;
	selectType = SELECT_RECTANGLE;
	updateR();
	$(canvas).css('cursor', 'crosshair');
}
//start selection
function startSelect(event){
	state = STATE_SELECTING;
	//if youre clicking in the middle of a selection dont do anythign
	if (mousePos.x<selection.endx && mousePos.x>selection.startx &&
		mousePos.y<selection.endy && mousePos.y>selection.starty) {
		state = STATE_SELECT;
	} else { //otherwise do the selection
		selection.startx=mousePos.x;
		selection.starty=mousePos.y;
		selection.shape = selectType;
		var timer = setInterval(function(){ //render the selection
			if (state != STATE_SELECTING) { //stop timer
				clearInterval(timer);
				timer = null;
			} else {
				updateR();
				ctx.strokeStyle = "white";
				ctx.strokeRect(selection.startx,selection.starty,mousePos.x-selection.startx,mousePos.y-selection.starty);
				ctx.stroke;
			}
		},33);
	}
}
//stop selection
function stopSelect(event){
	state = STATE_SELECT;
	selection.endx=mousePos.x;
	selection.endy=mousePos.y;
	//swap start and endx to start at top left for rendering
	if (selection.endx<selection.startx){
		var temp = selection.startx;
		selection.startx=selection.endx;
		selection.endx=temp;
		delete temp;
	}
	if (selection.endy<selection.starty){
		var temp = selection.starty;
		selection.starty=selection.endy;
		selection.endy=temp;
		delete temp;
	}
	selection.height=selection.endy-selection.starty;
	selection.width=selection.endx-selection.startx;
	//store a bunch of pixels + render rectangle
	updateR();
	if (selection.startx!=selection.endx && selection.starty!=selection.endy) {
		selection.pixels = ctx.getImageData(selection.startx,selection.starty,selection.width,selection.height);
		ctx.strokeRect(selection.startx,selection.starty,selection.width,selection.height);
	} else {
		selection.pixels = null;
	}
}
//undo
function undo() {
	if (archive.length>=2) { 
		archive.pop();
		pixels = archive[archive.length-1];
		updateR();
		ctx.strokeRect(selection.startx,selection.starty,selection.width,selection.height);
	}
}