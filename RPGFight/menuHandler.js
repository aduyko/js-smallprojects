//track pointer and options
var pointerLoc = 0;
var options = [];
var option = function(art,x,y) {
	this.image = art;
	this.x = x;
	this.y = y;
}
//which menu am i tracking
var menuState = 0;
var previousState = 0;
var continueFunction = function(){};
var STATE_DIFFICULTY = 0;
var STATE_CHARACTER_SELECT = 1;
var STATE_BATTLE_OPTION = 2;
var STATE_CONFIRM = 3;
var STATE_TARGET = 4;
var STATE_GAME_OVER = 5;

//add listeners for menus

/*
	37 = left
	38 = up
	39 = right
	40 = down
	
	90 = z
	88 = x
*/
var keysDown = [];
addEventListener("keydown", function (e) {
	keysDown=[];
	keysDown[e.keyCode] = true;
	if (e.keyCode == 38) { //up pressed, scroll up
		if (pointerLoc==0) {
			pointerLoc=options.length-1;
		}
		else {pointerLoc--};
	}
	if (e.keyCode == 40) { //down pressed, scroll down
		if (pointerLoc==options.length-1) {
			pointerLoc=0;
		}
		else {pointerLoc++};
	}
	renderMenu(); //always render after a keypress? idk if this is smart
}, false);

addEventListener("keyup", function (e) {
	if (keysDown[e.keyCode]) {
	if (e.keyCode == 90) { //z released, decision has been made
		switch (menuState) {
			case STATE_DIFFICULTY:
				setDifficulty(pointerLoc);
				loadCharacterSelectMenu();
				break;
			case STATE_CHARACTER_SELECT: //user selects a character
				characters.splice(characters.length,0,new Character(pointerLoc));
				renderMenu();
				if (characters.length==MAX_PLAYABLE_CHARS) { //if we have three, confirm whether we want to continue or not.
					for (i=0;i<MAX_PLAYABLE_CHARS;i++) {
						characters[i].x = 24;
						characters[i].y = 24+104*i;
					}
					confirm(loadBattleMenu);
				}
				break;
			case STATE_BATTLE_OPTION:
				clearBattleMenu();
				battleOption();
				break;
			case STATE_CONFIRM: //go to next state if the user continues.
				continueFunction();
				break;
			case STATE_TARGET:
				selectTarget();
				break;
			default:
		}
	}
	if (e.keyCode == 88) { //x released
		switch (menuState) {
			case STATE_CHARACTER_SELECT: //remove last added actor from characters.
				characters.splice(characters.length-1,1);
				renderMenu();
				break;
			case STATE_CONFIRM: //return to previous state if the user cancels.
				menuState = previousState;
				resetState();
				renderMenu();
				break;
			default:
		}
	}
	delete keysDown[e.keyCode];
	}
}, false);

//draw the menu: draw the background, then depending on our state update the respective menu.
function renderMenu() {
	drawMenuBackground();
	switch (menuState) {
		case STATE_DIFFICULTY: 
			for (i = 0; i < options.length; i++) { //draw difficulties, this would probably be better as an image than as 3
				gameCtx.drawImage(options[i].image,options[i].x,options[i].y);
			}
			gameCtx.drawImage(art_pointer,options[pointerLoc].x,options[pointerLoc].y+options[pointerLoc].image.height/4);
			break;
		//draws all character names on the left of the big panel.
		//draws all selected characters in button panel.
		//draws selected characters splash art to the right of the big panel.
		case STATE_CHARACTER_SELECT:
			gameCtx.drawImage(art_classlist,0,0); //draws class list
			gameCtx.drawImage(art_pointer,0,(85+pointerLoc*40)); //draws pointer
			gameCtx.drawImage(splashArt[pointerLoc],200, 0); //draws our selected character
			for (i=0;i<characters.length;i++) { //draw all currently selected actors in the button menu
				buttonCtx.drawImage(classList[characters[i].art],184+100*i,48);
			}
			break;
		//sets up the action selector menu
		case STATE_BATTLE_OPTION:
			buttonCtx.drawImage(art_combat_general,0,0); //draws general options
			buttonCtx.drawImage(art_pointer,0,8+pointerLoc*40); //draws pointer
			break;
		//draws are you ready + z/x prompt
		case STATE_CONFIRM:
			gameCtx.drawImage(art_yesno,gameCanvas.width/2-art_yesno.width/2,gameCanvas.height/2-art_yesno.height/2);
			break;
		case STATE_TARGET:
			renderScene();
			break;
		default:
	}
}

//draws the background. we do a switch so that we only update one screen at a time, this is so that say if
//the user chooses a battle option, we dont draw the background of our animation screen.
function drawMenuBackground() {
	switch (menuState) {
		case STATE_CHARACTER_SELECT:
			buttonCtx.fillStyle = "skyblue";
			buttonCtx.fillRect(0,0,buttonCanvas.width,buttonCanvas.height);
		case STATE_CONFIRM:
		case STATE_TARGET:
		case STATE_DIFFICULTY:
			gameCtx.fillStyle = "lightgreen";
			gameCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
			break;
		case STATE_BATTLE_OPTION:
			buttonCtx.fillStyle = "skyblue";
			buttonCtx.fillRect(0,0,buttonCanvas.width,buttonCanvas.height);
			renderCharacterStats();
			break;
		default:
	}
}
//set up the appropriate menus and then render them.

//loads difficulty selection. Should probably be splash art in the future with this 
//renamed to loadDifficultySelection or something
function loadStartMenu() {
	resetPointer();
	menuState = STATE_DIFFICULTY;
	options = new Array(art_button_easy,art_button_medium,art_button_hard);
	for (i = 0; i < options.length; i++) {
		var newOption = new option(options[i],gameCanvas.width/2 - options[i].width/2,((i+1))*gameCanvas.height/(options.length+1))
		options[i]=newOption;
	}
	renderMenu();
}

//eponymous
function loadCharacterSelectMenu() {
	resetPointer();
	characters = [];
	menuState = STATE_CHARACTER_SELECT;
	options = new Array(0,1,2,3);
	renderMenu();
}

//sets up initial menus for battle screen then runs battleLoop from combatHandler
function loadBattleMenu() {
	menuState = STATE_BATTLE_OPTION;
	options = new Array(0,1,2,3);
	resetPointer();
	renderScene();
	renderMenu();
	takeTurn();
}

function loadGameOverMenu() {
	gameCtx.fillStyle = "rgba(0, 0, 0, 1)";
	gameCtx.fillRect(0,0,gameCanvas.width,gameCanvas.height);
	buttonCtx.fillStyle = "rgba(0, 0, 0, 1)";
	buttonCtx.fillRect(0,0,buttonCanvas.width,buttonCanvas.height);
}
//Pops up the ocnfirm dialog. Arg is the function to do if the user presses accept, cancelling is handled using 
//previousState and resetState();
function confirm(whatFunc) { 
	previousState = menuState;
	menuState = STATE_CONFIRM;
	continueFunction = whatFunc;
	renderMenu();
}
function resetPointer() {
	pointerLoc = 0;
	if (menuState==STATE_TARGET) {
	while (characters[pointerLoc].alive == false) {
		pointerLoc++;
	}
	}
}
//resets the current menus.
function resetState() {
	switch (menuState) {
		case STATE_DIFFICULTY:
			loadStartMenu();
			break;
		case STATE_CHARACTER_SELECT:
			loadCharacterSelectMenu();
			break;
		case STATE_BATTLE_OPTION:
			break;
		default:
	}
}