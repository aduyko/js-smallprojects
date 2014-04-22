function initImg() {
	myImage.onload = function() {initCanvas();}
	myImage.src = "mountains.jpg";
}
function initCanvas(){
	i_width = Math.floor(myImage.width/3);
	i_height = Math.floor(myImage.height/3);
	$("#container").append("<canvas id = 'canvas' width = "+i_width+" height = "+i_height+">Canvas not supported</canvas>");
	canvas = $("#canvas")[0];
	ctx = canvas.getContext('2d');
	
	initListeners();
	
	ctx.drawImage(myImage,0,0,i_width,i_height);
	pixels = ctx.getImageData(0,0,i_width,i_height);
	archive.push(pixels);
	
	$("#container").append("<div id = 'controls'><br /></div>");
	$("#controls").append("<input type = 'button' class = 'brushButton' onclick = 'setModeSelect();'>rectangle</input>");
	$("#controls").append("<input type = 'button' class = 'manipButton' onclick = 'manip();'>manip</input>");
	
	/*var timer = setTimeout(function(){
		ctx.putImageData(pixels,0,0);
	},1000);
	*/
}
function manip(){
	ctx.putImageData(pixels,0,0);
	for (i=0;i<selection.pixels.data.length;i+=4){
		selection.pixels.data[i]=selection.pixels.data[i+selection.pixels.height*4+selection.pixels.width];
		selection.pixels.data[i+3]=200;
		selection.pixels.data[i+selection.pixels.height*2+1]=selection.pixels.data[i+selection.pixels.height*4];
	}
	ctx.putImageData(selection.pixels,selection.startx,selection.starty);
	pixels = ctx.getImageData(0,0,i_width,i_height);
	archive.push(pixels);
	if (selection.startx!=null) {
		ctx.strokeRect(selection.startx,selection.starty,selection.width,selection.height);
	}
}

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
}
function mouseClicked(event) {
	switch (state) {
		case STATE_DEFAULT:
			alert(mousePos.x+" "+mousePos.y);
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
			stopSelect(event);
			break;
		default:
			break;
	}
}
function getMouseCoords(event) {
	var x,y;
	x=(event.pageX);
	y=(event.pageY);
	x-=367;
	y-=48;
    return {"x": x, "y": y};
}

function setModeSelect() {
	selection.clear();
	state = STATE_SELECT;
	selectType = SELECT_RECTANGLE;
	ctx.putImageData(pixels,0,0);
	$(canvas).css('cursor', 'crosshair');
}

function startSelect(event){
	if (selection.startx==null) {
		selection.startx=mousePos.x;
		selection.starty=mousePos.y;
		selection.shape = selectType;
		var timer = setInterval(function(){
			if (state == STATE_DEFAULT) {
				clearInterval(timer);
				timer = null;
			} else {
				ctx.putImageData(pixels,0,0);
				ctx.strokeStyle = "white";
				ctx.strokeRect(selection.startx,selection.starty,mousePos.x-selection.startx,mousePos.y-selection.starty);
				ctx.stroke;
			}
		},20);
	} else if (mousePos.x<selection.endx && mousePos.x>selection.startx &&
				mousePos.y<selection.endy && mousePos.y>selection.starty) {
		selection.startx=mousePos.x;
		selection.starty=mousePos.y;
		selection.shape = selectType;
		var timer = setInterval(function(){
			if (state == STATE_DEFAULT) {
				clearInterval(timer);
				timer = null;
			} else {
				ctx.putImageData(pixels,0,0);
				ctx.strokeStyle = "white";
				ctx.strokeRect(selection.startx,selection.starty,mousePos.x-selection.startx,mousePos.y-selection.starty);
				ctx.stroke;
			}
		},20);
	}
}

function stopSelect(event){
	state = STATE_DEFAULT;
	selection.endx=mousePos.x;
	selection.endy=mousePos.y;
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
	ctx.putImageData(pixels,0,0);
	selection.pixels = ctx.getImageData(selection.startx,selection.starty,selection.width,selection.height);
	ctx.strokeRect(selection.startx,selection.starty,selection.width,selection.height);
}