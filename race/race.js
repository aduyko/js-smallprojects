var CANVAS_WIDTH = 400;
var CANVAS_HEIGHT = 600;

var KEYS_DOWN = {};

var COLLIDABLE_OBJECTS = [];
var THROWN_OBJECTS = [];
var DRAGGED_OBJECT = null;
var DRAGGED_OBJECT_COLOR = null;

var TIMERS = {};
var TIMER_GAME = 0;

var gameState;
var STATE_MENU = 0;
var STATE_GAME = 1;
var STATE_DRAGGING = 2;

var hero = {
	//physical properties
	size:10,
	color:"orange",
	x:0,
	y:0,
	//physics properties
	speed:0,
	acceleration:50,
	maxSpeed:100,
}
var finish = {
	x:0,
	width:40,
	y:0,
	height:20,
	color:"skyblue",
}
var collidableRect = function(){
	//physical properties
	this.x=0;
	this.width=40;
	this.y=0;
	this.height=40;
	this.color="#0033aa";
	//physics properties
	this.deceleration=20;
	this.xSpeed=0;
	this.ySpeed=0;
}
function render() {
	//render everything that needs rendering
	renderBackground();
	renderHero();
	renderObjects();
	if (DRAGGED_OBJECT != null) {
		renderDragVector();
	}
}
function renderBackground() {
	//clear everything
	ctx.fillStyle="black";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	//draw the finish and race strip
	ctx.fillStyle=finish.color;
	ctx.fillRect(finish.x,finish.y,finish.width,finish.height);
	
	ctx.fillStyle = "rgba(135, 206, 250, 0.5)";
	ctx.fillRect(finish.x,finish.y,finish.width,canvas.height);
}
function renderHero() {
	//draw an arc for hero
	ctx.beginPath();
	ctx.fillStyle=hero.color;
	ctx.arc(hero.x, hero.y, hero.size, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.closePath();
}
function renderObjects() {
	//render all objects
	for (i=0;i<COLLIDABLE_OBJECTS.length;i++){
		var currentObj = COLLIDABLE_OBJECTS[i];
		ctx.fillStyle=currentObj.color;
		ctx.fillRect(currentObj.x,currentObj.y,currentObj.width,currentObj.height);
	}
}
function renderDragVector() {
	//render a vector if currently dragging
	ctx.beginPath();
	ctx.strokeStyle = "#ffffff";
	
	var objCenterX = DRAGGED_OBJECT.x+DRAGGED_OBJECT.width/2;
	var objCenterY = DRAGGED_OBJECT.y+DRAGGED_OBJECT.height/2;
	var distX = objCenterX-mousePos.x;
	var distY = objCenterY-mousePos.y;
	ctx.lineWidth = Math.sqrt(distX*distX+distY*distY)/8;
	
	ctx.moveTo(objCenterX,objCenterY);
	ctx.lineTo( mousePos.x, mousePos.y);
	ctx.stroke();
	ctx.closePath();
}
function update(delta) {
	//movement
	if (/*37 in KEYS_DOWN || 38 in KEYS_DOWN || 39 in KEYS_DOWN || 40 in KEYS_DOWN ||*/
		87 in KEYS_DOWN || 83 in KEYS_DOWN || 65 in KEYS_DOWN || 68 in KEYS_DOWN) {
		if (hero.speed<hero.maxSpeed){hero.speed+=hero.acceleration;}
	} else {
		hero.speed=0;
	}
	if (/*37 in KEYS_DOWN || */65 in KEYS_DOWN) { //left
		hero.x-=hero.speed*delta;
	}
	if (/*38 in KEYS_DOWN ||*/ 87 in KEYS_DOWN) { //up
		hero.y-=hero.speed*delta;
	}
	if (/*39 in KEYS_DOWN ||*/ 68 in KEYS_DOWN) { //right
		hero.x+=hero.speed*delta;
	}
	if (/*40 in KEYS_DOWN ||*/ 83 in KEYS_DOWN) { //down
		hero.y+=hero.speed*delta;
	}
	// move thrown object
	for (i=0;i<THROWN_OBJECTS.length;i++) {
		var currentObj = THROWN_OBJECTS[i];
		var decel = currentObj.deceleration*delta;
		currentObj.x+=currentObj.xSpeed*delta;
		currentObj.y+=currentObj.ySpeed*delta;
		currentObj.xSpeed=currentObj.xSpeed>0?currentObj.xSpeed-decel:currentObj.xSpeed+decel;
		currentObj.ySpeed=currentObj.ySpeed>0?currentObj.ySpeed-decel:currentObj.ySpeed+decel;
		if (Math.abs(currentObj.xSpeed)-decel<0){
			currentObj.xSpeed=0;
		}
		if (Math.abs(currentObj.ySpeed)-decel<0){
			currentObj.ySpeed=0;
		}
		if (currentObj.xSpeed===0 && currentObj.ySpeed===0) {
			THROWN_OBJECTS.splice(0,i);
		}
	}
	
	//edge bounds
	if (hero.x-hero.size < 0) {hero.x = hero.size;}
	if (hero.y-hero.size < 0) {hero.y = hero.size;}
	if (hero.x+hero.size > canvas.width) {hero.x = canvas.width-hero.size;}
	if (hero.y+hero.size > canvas.height) {hero.y = canvas.height-hero.size;}
	for (i=0;i<THROWN_OBJECTS.length;i++) {
		var obj = THROWN_OBJECTS[i];
		//check game bounds
		if (obj.x<0) {
			obj.x=0;
			obj.xSpeed=0;
		}
		if (obj.y<0) {
			obj.y=0;
			obj.ySpeed=0;
		}
		if (obj.x+obj.width > canvas.width) {
			obj.x = canvas.width-obj.width;
			obj.xSpeed=0;
		}
		if (obj.y+obj.height > canvas.height) {
			obj.y = canvas.height-obj.height;
			obj.ySpeed=0;
		}
		//check that finish isnt covered up
	}
	
	//hero collision
	var collided = checkCollisions();
	if (collided.length!=0){
	for (i=0;i<collided.length;i++){
		//colliding from left
		if ((/*39 in KEYS_DOWN || */68 in KEYS_DOWN) && hero.x<collided[i].x) {
			hero.x=collided[i].x-hero.size;
		}
		//colliding from right
		if ((/*37 in KEYS_DOWN || */65 in KEYS_DOWN) && hero.x>collided[i].x+collided[i].width) {
			hero.x=collided[i].x+collided[i].width+hero.size;
		}
		//colliding from below
		if ((/*40 in KEYS_DOWN || */83 in KEYS_DOWN) && hero.y<collided[i].y) {
			hero.y=collided[i].y-hero.size;
		}
		//colliding from above
		if ((/*38 in KEYS_DOWN || */87 in KEYS_DOWN) && hero.y>collided[i].y+collided[i].height) {
			hero.y=collided[i].y+collided[i].height+hero.size;
		}
	}
	}
	//finish line
	if (		hero.x-hero.size>=finish.x &&
				hero.x+hero.size<=finish.x+finish.width &&
				hero.y-hero.size<=0) {
		stopTimer(TIMER_GAME);
	}
}
//returns all objects colliding with hero
function checkCollisions() {
	var returner = [];
	var counter=0;
	for (i=0;i<COLLIDABLE_OBJECTS.length;i++) {
		var currentObj = COLLIDABLE_OBJECTS[i];
		if (		hero.x+hero.size>currentObj.x && 
					hero.x-hero.size<currentObj.x+currentObj.width &&
					hero.y+hero.size>currentObj.y &&
					hero.y-hero.size<currentObj.y+currentObj.height){
			returner[counter]=COLLIDABLE_OBJECTS[i];
			counter++;
		}
	}
	return returner;
}
//intialization
function initCanvas() {
	$("#container").append("<canvas id = 'canvas'>Canvas not supported</canvas>");
	$("#canvas").attr("width",CANVAS_WIDTH);
	$("#canvas").attr("height",CANVAS_HEIGHT);
	//set focus to canvas
	$("#canvas").attr("tabindex",0);
	$("#canvas").focus();
	
	//this deletes loading message
	$("#container").contents().filter(function(){
		return this.nodeType === 3;
	}).remove();
	
	$("#canvas").css({"margin-left":""+(-CANVAS_WIDTH/2)+"px"});
	
	canvas = $("#canvas")[0];
	ctx = canvas.getContext('2d');
	
	initListeners();
	
	startGame();
}
function initGame() {
	//init hero
	hero.x=CANVAS_WIDTH/2;
	hero.y=CANVAS_HEIGHT-hero.size;
	
	//init exit
	finish.x=(CANVAS_WIDTH-finish.width)/2;
	
	//init objects
	createRandomObjects(8);
	
	gameState = STATE_GAME;
}
//spawns objects whatver
function createRandomObjects(numObjects) {
	for (i=0;i<numObjects;i++) {
		COLLIDABLE_OBJECTS.push(new collidableRect());
		var currentObj = COLLIDABLE_OBJECTS[COLLIDABLE_OBJECTS.length-1];
		currentObj.x=Math.random()*canvas.width/2+canvas.width/4;
		currentObj.y=Math.random()*canvas.height/1.5+canvas.height/4;
	}
}
function initListeners() {
	$("#canvas").keydown(function(event) {
		KEYS_DOWN[event.keyCode]=true;
	});
	$("#canvas").keyup(function(event) {
		delete KEYS_DOWN[event.keyCode];
	});
	$("#canvas").mousedown(function(event) {
		mouseClicked(event);
	});
	$("#canvas").mouseup(function(event) {
		mouseReleased(event);
	});
	//if you drag mouse offscreen, same as releasing it?
	$("#canvas").mouseout(function(event) {
		mouseReleased(event);
	});
}
function mouseClicked(event) {
	switch (gameState) {
		case STATE_MENU:
			startSelect(event);
			break;
		case STATE_GAME:
			startDragging(event);
			break;
		case STATE_DRAGGING:
			break;
		default:
			break;
	}
}
function mouseReleased(event) {
	switch (gameState) {
		case STATE_MENU:
			break;
		case STATE_GAME:
			break;
		case STATE_DRAGGING:
			stopDragging();
			break;
		default:
			break;
	}
}
//Start dragging a collidable object
function startDragging(e) {
	mousePos = getMousePos(e);
	//check first object under mouse
	for (i=0;i<COLLIDABLE_OBJECTS.length;i++) {
		var currentObj = COLLIDABLE_OBJECTS[i];
		if (		mousePos.x>currentObj.x && 
					mousePos.x<currentObj.x+currentObj.width &&
					mousePos.y>currentObj.y &&
					mousePos.y<currentObj.y+currentObj.height){
			DRAGGED_OBJECT = currentObj;
			continue;
		}
	}
	//if we find an object, save its color and set it as dragged
	if (DRAGGED_OBJECT!=null){
		DRAGGED_OBJECT_COLOR = DRAGGED_OBJECT.color;
		DRAGGED_OBJECT.color="#ffffff";
		gameState = STATE_DRAGGING;
		$("#canvas").mousemove(function(event) {
			mousePos = getMousePos(event);
		});
	}
}
//throw the object when you stop dragging it!
function stopDragging() {
	gameState = STATE_GAME;
	THROWN_OBJECTS.push(DRAGGED_OBJECT);
	THROWN_OBJECTS[THROWN_OBJECTS.length-1].xSpeed=mousePos.x-(DRAGGED_OBJECT.x+DRAGGED_OBJECT.width/2);
	THROWN_OBJECTS[THROWN_OBJECTS.length-1].ySpeed=mousePos.y-(DRAGGED_OBJECT.y+DRAGGED_OBJECT.height/2);
	DRAGGED_OBJECT.color=DRAGGED_OBJECT_COLOR;
	DRAGGED_OBJECT = null;
	$("#canvas").unbind("mousemove");
}
//return mousePos
function getMousePos(e) {
	var x,y;
	x=(e.pageX);
	y=(e.pageY);
	x-=$("#canvas").offset().left;
	y-=$("#canvas").offset().top;
    return {"x": x, "y": y};
}
//start the game timer
function startGame() {
	//initialize all game stuff
	initGame();
	//timer stuff
	var timeNow;
	var timeThen = Date.now();
	var delta;
	var timer = setInterval(function(){
		timeNow = Date.now();
		delta = timeNow-timeThen;
		update(delta/1000);
		render();
		timeThen = timeNow;
		if (90 in KEYS_DOWN) {stopTimer(TIMER_GAME);}
	},1);
	TIMERS[TIMER_GAME]=timer;
}

function stopTimer(timer) {
	clearInterval(TIMERS[timer]);
	delete TIMERS[timer];
}