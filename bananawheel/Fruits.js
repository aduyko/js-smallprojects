var fruits = [];
var fruitComparator = [];
var NUM_FRUITS = 8;
var NUM_SMASH = 10;
var NUM_CHUNKS = 20;
var NUM_CHUNKS_MIN = 5;
var fruitSize = 50;
var fruitRadius = fruitSize/2;
var fruitToSmash = [];
var pointMultiplier = [];

function addFruit(initType, arrayPos) {
	angleOffset = -(arrayPos)*(2*Math.PI/NUM_FRUITS);
	fruits.push(angleOffset);
	fruitComparator.push(fruitArt[arrayPos%fruitArt.length].src);
	$("<div id = 'Fruit"+arrayPos+"' class = 'Fruit'></div>").appendTo("#MainPanel");
	$('#Fruit'+arrayPos).css("background-image","url("+fruitArt[arrayPos%fruitArt.length].src+")");
	$('#Fruit'+arrayPos).css("background-size", "100% 100%");
}
function initFruits() {
	for (j=0;j<NUM_FRUITS;j++) {
		var fruit = $("div[id='Fruit"+j+"']");
		var x = (radius-fruitRadius)*Math.cos(angle+fruits[j]);
		var y = (radius-fruitRadius)*Math.sin(angle+fruits[j]);
		x+=center.x-fruitRadius;
		y+=center.y-fruitRadius;
		fruit.css({top:y,left:x,position:'absolute'});
	}
}

var mainPanel;
var panelWidth;
var panelHeight;
var radius;
var center;

var angle = Math.PI*3/2;
var angleStep = .1/NUM_FRUITS;
var spinning = 0;

var myTimer=setInterval();
var elapsedTime = 0;
var startTime = 5;

var requestNum;

function loadFruitSpinner() {
	$("#Loading").remove();
	$("#SmasherPanel").remove();
	$(document.body).unbind();
	$(document.body).append("<div id = 'SpinnerPanel'></div>");
	$("#SpinnerPanel").append("<div id = 'MainPanel'></div>");
	$("#SpinnerPanel").append("<div id = 'Arrow'><--</div>");
	$("#SpinnerPanel").append("<div id = 'Request'></div>");
	for (i=0;i<NUM_FRUITS;i++) {
		addFruit(1,i);
	}
	mainPanel = $("#MainPanel");
	panelWidth = mainPanel.width();
	panelHeight = mainPanel.height();
	radius = panelWidth/2;
	center = {x: panelWidth/2, y: panelHeight/2};
	initFruits();
	newRequest();
	$("body").keydown(function(e){
		if (e.keyCode==90) {
			startSpinning();
		}
		if (e.keyCode==32) {
			getContents();
		}
	});
}
function spinLeft(){
	for (j=0;j<NUM_FRUITS;j++) {
		var fruit = $("div[id='Fruit"+j+"']");
		var x = (radius-fruitRadius)*Math.cos(angle+fruits[j]);
		var y = (radius-fruitRadius)*Math.sin(angle+fruits[j]);
		x+=center.x-fruitRadius;
		y+=center.y-fruitRadius;
		fruit.css({top:y,left:x,position:'absolute'});
	}
	angle-=angleStep;
	if (angle >= 2*Math.PI) {angle = 0.0;}
}
function spinRight(){
	for (j=0;j<NUM_FRUITS;j++) {
		var fruit = $("div[id='Fruit"+j+"']");
		var x = (radius-fruitRadius)*Math.cos(angle+fruits[j]);
		var y = (radius-fruitRadius)*Math.sin(angle+fruits[j]);
		x+=center.x-fruitRadius;
		y+=center.y-fruitRadius;
		fruit.css({top:y,left:x,position:'absolute'});
	}
	angle+=angleStep;
	if (angle >= 2*Math.PI) {angle = 0.0;}
	if (elapsedTime<startTime) {
		elapsedTime+=.005;
	}
}
function startSpinning() {
	if (spinning==0) {
		myTimer=setInterval(spinRight,1);
		spinning = 1;
	}
	else {
		clearInterval(myTimer);
		spinning = 0;
	}
}
function getContents() {
	clearInterval(myTimer);
	spinning=1-spinning;
	var selectedFruit;
	var halfDivision = Math.PI/NUM_FRUITS;
	for (i=0;i<NUM_FRUITS;i++){
		if (i==0){
			if (angle<=halfDivision || angle>=(2*Math.PI-halfDivision)) {selectedFruit=i;}
		}
		else {
			if (angle<=halfDivision*(2*i+1) && angle >=halfDivision*(2*i-1)) {selectedFruit=i;}
		}
	}
	selectedFruit = fruitComparator[selectedFruit];
	for (j=0;j<fruitArt.length;j++) {
		if(selectedFruit==fruitArt[j].src) {
			fruitToSmash.push(j);
			pointMultiplier.push(1);
		}
	}
	if (selectedFruit==($("#Request").attr("source"))) {
		$("#Request").css("background","green");
		$("#Request").css("background-repeat","no-repeat");
		$("#Request").css("background-position","center 0%");
		for (j=0;j<fruitArt.length;j++) {
			if(selectedFruit==fruitArt[j].src) {
				pointMultiplier[pointMultiplier.length-1]*=2;
			}
		}
		angleStep+=.007;
		playUnconditional(sound_fruitGet);
	}
	else {
		$("#Request").css("background","red");
		$("#Request").css("background-repeat","no-repeat");
		$("#Request").css("background-position","center 0%");
	}
	if (elapsedTime<startTime) {
		$("#Request").css("background","yellow");
		$("#Request").css("background-repeat","no-repeat");
		$("#Request").css("background-position","center 0%");
	}
	elapsedTime=0;
	startTime*=.7;
	if (fruitToSmash.length==NUM_SMASH) {
		loadFruitSmasher();
	}
	else {
		newRequest();
		startSpinning();
	}
}
function newRequest() {
	var requestDiv = $("#Request");
	var randInt = Math.floor(Math.random()*NUM_FRUITS);
	requestDiv.attr('source',fruitComparator[randInt]);
	requestDiv.css("background-image","url("+fruitComparator[randInt]+")");
}


function loadFruitSmasher() {
	$("#SpinnerPanel").remove();
	$(document.body).unbind();
	$(document.body).append("<div id = 'SmasherPanel'></div>");
	$("#SmasherPanel").append("<div id = 'SmasherDiv'></div>");
	$("#SmasherPanel").append("<div id = 'SmashPower'></div>");
	
	$("body").keydown(function(e){
		if (e.keyCode==32) {
			smash();
		}
	});
	nextSmash();
}
var smashTimer = setInterval();
var scatterTimer = setInterval();
var movingChunks=0;
var totChunks=0;
var buh = true;
function nextSmash() {
	var panel = $("#SmasherDiv");
	var curFruit = fruitToSmash[0];
	fruitToSmash.splice(0,1);
	var curSmasher = smashingObjects[Math.floor(Math.random()*smashingObjects.length)];
	panel.append("<div class = 'Smasher'></div>");
	panel.append("<div class = 'PrepFruit'></div>");
	pointMultiplier.splice(0,1);
}
function smash() {
	if (buh){
	$(".PrepFruit").remove();
	$(".Smasher").remove();
	var numChunks = Math.floor(Math.random()*NUM_CHUNKS);
	numChunks+=NUM_CHUNKS_MIN;
	movingChunks = numChunks;
	for (i=0;i<numChunks;i++) {
		var xSpeed = Math.random()*100-50;
		//if (xSpeed<=0) {xSpeed-=20;}
		//else {xSpeed+=10;}
		var ySpeed = Math.random()*100-50;
		//if (ySpeed<=0) {ySpeed-=20;}
		//else {ySpeed+=10;}
		$(document.body).append("<div id = 'Moving"+i+"' class = 'FruitChunk' xSpeed = "+xSpeed+" ySpeed = "+ySpeed+"></div>");
		$("#Moving"+i).css({background:'green',left:$(document.body).width()/2,top:350,position:'absolute'});
	}
	//smashTimer = setInterval(smashDown, 20);
	scatterTimer=setInterval(scatterChunks,5);
	}
	buh=false;
}

function scatterChunks() {
	for (i=movingChunks-1;i>=0;i--) {
		var myChunk = $("#Moving"+i);
		var modX = parseFloat(myChunk.attr("xSpeed"));
		var modY = parseFloat(myChunk.attr("ySpeed"));
		var curX = parseInt(myChunk.css("left"));
		var curY = parseInt(myChunk.css("top"));
		if (modX+curX>=$(document.body).width()-5) {
			modX=0;
			curX=-200;
		}
		if (modY+curY>= Math.max($(document.body).height()-25,/* For opera: */document.documentElement.clientHeight-25)) {
			modY=0;
			curY=-200;
		}
		myChunk.css({top:(curY+modY)});
		myChunk.css({left:(curX+modX)});
		if (modX>0) {
			modX-=1;
			if (modX<=0) {modX=0;}
		}
		else if (modX<0) {
			modX+=1;
			if (modX>=0) {modX=0;}
		}
		if (modY>0) {
			modY-=1;
			if (modY<=0) {modY=0;}
		}
		else if (modY<0) {
			modY+=1;
			if (modY>=0) {modY=0;}
		}
		myChunk.attr("xSpeed",modX);
		myChunk.attr("ySpeed",modY);
		if (modX==0 && modY==0) {totChunks++;}
	}
	if (totChunks>=movingChunks) {
		for (i=totChunks-1;i>=0;i--) {
			myChunk = $("#Moving"+i);
			myChunk.attr("id","asfasf");
		}
		movingChunks=0;
		totChunks=0;
		clearInterval(scatterTimer);
		buh=true;
		if (fruitToSmash.length==0) {
		loadFruitSpinner();
		}
		else {
		nextSmash();
		}
	}
}