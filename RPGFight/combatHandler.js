var difficulty=1;
var EASY_MODIFIER = .6;
var HARD_MODIFIER = 1.5;

var currentActor;
var numTargets;
var selectedTargets = [];
var combatFunction = function(){};
var battleOver = true;
var resetSpeeds = false;
//eponymous
function setDifficulty(howDifficult) {
	if (howDifficult==0) {
		difficulty*=EASY_MODIFIER;
	}
	if (howDifficult==2) {
		difficulty*=HARD_MODIFIER;
	}
}

//adds a target to "selectedTargets" based on pointerLoc. If numTargets is reached,
//activates combatFunction.
function selectTarget() {
	if (characters[pointerLoc].alive==false) {
		return;
	}
	selectedTargets.splice(selectedTargets.length,0,pointerLoc);
	if (selectedTargets.length==numTargets) {
		combatFunction();
		endTurn();
		if (!teamDead()) {
			loadBattleMenu();
		}
	}
}
function endTurn() {
	if (teamDead()) {
		menuState = STATE_GAME_OVER;
		loadGameOverMenu();
	}
	if (resetSpeeds==true) {
		newSpeeds(characters);
		resetSpeeds = false;
	}
};
//function endTurn();
//renders battle scene in top canvas
function renderScene() {
	gameCtx.fillStyle = "lightgreen";
	gameCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
	for (i=0;i<MAX_PLAYABLE_CHARS;i++) {
		var myChar = characters[i];
		gameCtx.drawImage(classList[myChar.art], myChar.x, myChar.y);
	}
	
	//draw stuff depending on the state
	switch (menuState) {
		case STATE_TARGET:
			gameCtx.drawImage(art_pointer,characters[pointerLoc].x,characters[pointerLoc].y+classList[characters[pointerLoc].art].height/2);
			/*
			if (pointerLoc<3) {
				gameCtx.drawImage(art_pointer,16,48+pointerLoc*104);
			}
			if (pointerLoc>3) {
				gameCtx.drawImage(art_pointer,characters[pointerLoc].x,characters[pointerLoc].y);
			}
			*/
			break;
		default:
	}
}

function battleOption() {
	switch(pointerLoc) {
		case 0:
			combatFunction = universal_attack;
			loadTargetMenu(1);
			break;
		default:
			loadBattleMenu();
			
	}
}
//runs the battle loop, getting turns + taking names
function loadActors() {
	if (battleOver) {
		clearQueue();
		loadSpeeds(characters);
		battleOver = false;
	}
	runTurns();
}

function takeTurn() {
	currentActor = getActor();
	var myActor = characters[currentActor];
	if (currentActor==-1) {
		loadActors();
		currentActor=getActor();
		myActor = characters[currentActor];
	}
	showActor(myActor);
	if (currentActor>2) {
		//AI
	}
}
function showActor(initActor) {
	gameCtx.drawImage(art_combat_actor_display,initActor.x,initActor.y);
}
function renderCharacterStats() {
	buttonCtx.font="23pt Berlin Sans FB";
	buttonCtx.fillStyle = "#000000";
	buttonCtx.mozImageSmoothingEnabled=false;
	buttonCtx.ImageSmoothingEnabled=false;
	for (i=0;i<MAX_PLAYABLE_CHARS;i++) {
		buttonCtx.fillText("HP: " + characters[i].HP + "/" + characters[i].maxHP,128+20,36+56*i);
	}
}
function loadTargetMenu(initTargets) {
	numTargets = initTargets;
	menuState = STATE_TARGET;
	resetPointer();
	options = characters;
	renderScene();
	clearBattleMenu();
}
function clearBattleMenu() {
	buttonCtx.fillStyle = "skyblue";
	buttonCtx.fillRect(0,0,buttonCanvas.width,buttonCanvas.height);
	buttonCtx.drawImage(art_combat_general,0,0);
	renderCharacterStats();
}