var startButtonArt = new Image();
var tempBlockArt = new Image();
//-1
var northEastPipe = new Image();
var northWestPipe = new Image();
var southEastPipe = new Image();
var southWestPipe = new Image();
var eastWestPipe = new Image();
var northSouthPipe = new Image();
var everyStraightPipe = new Image();
//-2
var northEastPipeB = new Image();
var northWestPipeB = new Image();
var southEastPipeB = new Image();
var southWestPipeB = new Image();
var eastWestPipeB = new Image();
var northSouthPipeB = new Image();
var everyStraightPipeB = new Image();

var totalImages = 16;
var currentImages = 0;

var possiblePipes = [northEastPipe, northWestPipe, southEastPipe, southWestPipe,
					 eastWestPipe, northSouthPipe, everyStraightPipe];
var possiblePipesB = [northEastPipeB, northWestPipeB, southEastPipeB, southWestPipeB,
					 eastWestPipeB, northSouthPipeB, everyStraightPipeB];
					 
var numPossiblePipes = 7;

//wait for all assets to load
function loadingScreen() {
	$(document.body).append("<div id = 'loading'>LOADING</div>");
}
function loadAssets() {
	startButtonArt.onload = function(){checkLoaded();}
	startButtonArt.src = "art/buttons/startgame.png";
	
	tempBlockArt.onload = function(){checkLoaded();}
	tempBlockArt.src = "art/buttons/swirl.png";
	
	northEastPipe.onload = function(){checkLoaded();}
	northEastPipe.src = "art/pipes/NorthEast.png";
	northWestPipe.onload = function(){checkLoaded();}
	northWestPipe.src = "art/pipes/NorthWest.png";
	southEastPipe.onload = function(){checkLoaded();}
	southEastPipe.src = "art/pipes/SouthEast.png";
	southWestPipe.onload = function(){checkLoaded();}
	southWestPipe.src = "art/pipes/SouthWest.png";
	eastWestPipe.onload = function(){checkLoaded();}
	eastWestPipe.src = "art/pipes/EastWest.png";
	northSouthPipe.onload = function(){checkLoaded();}
	northSouthPipe.src = "art/pipes/NorthSouth.png";
	everyStraightPipe.onload = function(){checkLoaded();}
	everyStraightPipe.src = "art/pipes/EveryStraight.png";
	
	northEastPipeB.onload = function(){checkLoaded();}
	northEastPipeB.src = "art/pipes/NorthEastB.png";
	northWestPipeB.onload = function(){checkLoaded();}
	northWestPipeB.src = "art/pipes/NorthWestB.png";
	southEastPipeB.onload = function(){checkLoaded();}
	southEastPipeB.src = "art/pipes/SouthEastB.png";
	southWestPipeB.onload = function(){checkLoaded();}
	southWestPipeB.src = "art/pipes/SouthWestB.png";
	eastWestPipeB.onload = function(){checkLoaded();}
	eastWestPipeB.src = "art/pipes/EastWestB.png";
	northSouthPipeB.onload = function(){checkLoaded();}
	northSouthPipeB.src = "art/pipes/NorthSouthB.png";
	everyStraightPipeB.onload = function(){checkLoaded();}
	everyStraightPipeB.src = "art/pipes/EveryStraightB.png";
}
//check how many assets are loaded, then run main loop
function checkLoaded(){
	currentImages++;
	if (currentImages==totalImages){
		$("#loading").remove();
		main();
	}
}