//pieces available to the user
var freePipes = [];
//selected pipe memory
var selectedPipe = null;
//size of each block
var GRID_SIZE = 80;
//grid dimensions
var GRID_X = 6;
var GRID_Y = 6;
//grid
var grid = new Array(GRID_X);
//cell info
var cell = function() {
	this.occupied =  false;
	this.pipe = null;
};

//start x coord of grid
var GRID_X_ANCHOR = 160;

//start y coord of menu
var MENU_Y_ANCHOR = 400;

//game state stuff
var gameState=0;
var STATE_MENU = 0;
var STATE_GAME_IDLE = 1;
var STATE_GAME_DRAGGING = 2;

//render availible pipe pieces
function drawFreePipes(){
	ctx.strokeStyle = "#ffffff";
	//line in the middle
	ctx.moveTo(GRID_SIZE,0);
	ctx.lineTo(GRID_SIZE,MENU_Y_ANCHOR);
	for(i=0;i<freePipes.length;i++){ //draw block images, horizontal lines
		ctx.drawImage(freePipes[i],i%2==0?0:GRID_SIZE,Math.floor(i/2)*GRID_SIZE);
		ctx.moveTo(0,GRID_SIZE*i);
		ctx.lineTo(GRID_X_ANCHOR,GRID_SIZE*i);
	}
	ctx.stroke();
}
//draws the main grid
function drawGrid(){
	ctx.strokeStyle = "#ffffff";
	for (i=1;i<GRID_X;i++){ //vertical
		ctx.moveTo(GRID_X_ANCHOR+i*GRID_SIZE,0);
		ctx.lineTo(GRID_X_ANCHOR+i*GRID_SIZE,canvas.height);
	}
	for (i=1;i<GRID_Y;i++){ //horizontal
		ctx.moveTo(GRID_X_ANCHOR,i*GRID_SIZE);
		ctx.lineTo(canvas.width,i*GRID_SIZE);
	}
	ctx.stroke();
}

//draw canvas background + division between grid and free pieces
function drawCanvasBg(){
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.strokeStyle = "#ffffff";
	ctx.moveTo(GRID_X_ANCHOR,canvas.height);
	ctx.lineTo(GRID_X_ANCHOR,0);
	ctx.moveTo(0,MENU_Y_ANCHOR);
	ctx.lineTo(GRID_X_ANCHOR,MENU_Y_ANCHOR);
	ctx.stroke();
}
//start game loop
function main(){
	initMainMenu();
}
//open main menu
function initMainMenu(){
	gameState=STATE_MENU;
	
	$(document.body).empty();
	$(document.body).append("<div id = 'gameBorder'></div>");
	$(document.body).append("<div id = 'mainMenu'></div>");
	//start button
	$("#mainMenu").append("<input type = 'image' id = 'startButton' src = "+startButtonArt.src+"></input>");
	$("#startButton").click(function(){
		$("#startButton").remove();
		initGame();
	});
}
//initialize canvas
function initCanvas(){
	$(document.body).append("<canvas id = 'canvas' width = '640' height = '480'>Canvas not supported</canvas>");
	canvas = $("#canvas")[0];
	ctx = canvas.getContext('2d');
	//EVENT LISTENERS FOR CANVAS
	canvas.addEventListener('mousedown',function(event) {
		//prevents cursor from changing to "typing" cursor
		event.preventDefault();
		mouseClicked();
	},false);
	canvas.addEventListener('mouseup',function() {
		mouseReleased();
	},false);
	canvas.addEventListener('mousemove',function(event) {
		mousePos = getMouseCoords(event);
	},false);
}
//start the main game loop
function initGame(){
	gameState = STATE_GAME_IDLE;
	$("#mainMenu").remove();
	initCanvas();
	$(document.body).append("<div id = 'gameMenu'></div>");
	initPipes();
	var countdown = 5;
	$("#gameMenu").append("<div id = 'countdown'>"+countdown+"</div>");
	var startTimer = setInterval(function() {
		countdown--;
		$("#countdown").html(countdown);
		if (countdown==0){
			$("#countdown").remove();
			startTimer = null;
			startSlime();
		}
	}, 1000);
}
//initialize pipes
function initPipes(){
	freePipes = [];
	initGrid();
	for (i=0;i<10;i++) {
		freePipes.push(possiblePipes[Math.floor(Math.random()*numPossiblePipes)]);
	}
	drawCanvasBg();
	drawGrid();
	drawFreePipes();
}
//initialize grid
function initGrid(){
	for (i=0;i<GRID_X;i++) {
		grid[i]=new Array(GRID_Y);
		for (j=0;j<GRID_Y;j++) {
			grid[i][j]=new cell();
		}
	}
}
//start slime path
function startSlime(){}
//returns mouse coordinates
function getMouseCoords(event) {
	var x,y;
	x=(event.pageX);
	y=(event.pageY);
	x-=canvas.offsetLeft;
	y-=canvas.offsetTop;
    return {"x": x, "y": y};
}
//mouse clicked
function mouseClicked() {
	gameState = STATE_GAME_DRAGGING;
	$(canvas).css('cursor', 'move');
	if (mousePos.x<GRID_X_ANCHOR) {
		selectedPipe = Math.floor(mousePos.x/GRID_SIZE)+1 + 2*(Math.floor(mousePos.y/GRID_SIZE))-1;
	}
}
//mouse released
function mouseReleased() {
	gameState = STATE_GAME_IDLE;
	$(canvas).css('cursor', 'auto');
	if (mousePos.x>GRID_X_ANCHOR) {
		//draw new pipe on grid
		var gridCol = Math.floor((mousePos.x-GRID_X_ANCHOR)/GRID_SIZE);
		var gridRow = Math.floor(mousePos.y/GRID_SIZE);
		if (grid[gridRow][gridCol].occupied!=true && selectedPipe!=null) {
			grid[gridRow][gridCol].occupied=true;
			var snapX = gridCol*GRID_SIZE+GRID_X_ANCHOR;
			var snapY = gridRow*GRID_SIZE;
			var selectedAsset;
			for (i=0;i<numPossiblePipes;i++) {
				if (freePipes[selectedPipe].src==possiblePipes[i].src) {
					selectedAsset=possiblePipesB[i];
				}
			}
			ctx.drawImage(selectedAsset,snapX,snapY);
			//clear used pipe from available pipes
			freePipes[selectedPipe] = possiblePipes[Math.floor(Math.random()*numPossiblePipes)];
			ctx.fillStyle = "black";
			ctx.fillRect(selectedPipe%2==0?0:GRID_SIZE, Math.floor(selectedPipe/2)*GRID_SIZE, GRID_SIZE, GRID_SIZE);
			ctx.drawImage(freePipes[selectedPipe],selectedPipe%2==0?0:GRID_SIZE,Math.floor(selectedPipe/2)*GRID_SIZE);
		}
		selectedPipe = null;
	}
}