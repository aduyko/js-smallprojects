var art_pointer = new Image();
var art_button_easy = new Image();
var art_button_medium = new Image();
var art_button_hard = new Image();
//-1
var art_classlist = new Image();
var art_class_warrior = new Image();
var art_class_witch = new Image();
var art_class_cleric = new Image();
var art_class_rogue = new Image();
var art_splash_warrior = new Image();
var art_splash_witch = new Image();
var art_splash_cleric = new Image();
var art_splash_rogue = new Image();
//-2
var art_combat_general = new Image();
var art_combat_actor_display = new Image();
//-3
var art_yesno = new Image();

var splashArt = [art_splash_warrior,art_splash_witch,art_splash_cleric,art_splash_rogue];
//total images = line number of last art + last inline negative nums
var totalImages = 16;
var currentImages = 0;

function initImages() { //loads initial images: waits to see if every image is loaded before ENTIRE file begins.
	art_pointer.onload = function() {checkLoaded();}
	art_pointer.src = "Art/UI/Pointer.png";
	art_button_easy.onload = function() {checkLoaded();}
	art_button_easy.src = "Art/UI/EasyButton.png";
	art_button_medium.onload = function() {checkLoaded();}
	art_button_medium.src = "Art/UI/MediumButton.png";
	art_button_hard.onload = function() {checkLoaded();}
	art_button_hard.src = "Art/UI/HardButton.png";
	
	art_classlist.onload = function() {checkLoaded();}
	art_classlist.src = "Art/UI/ClassList.png";
	art_class_warrior.onload = function() {checkLoaded();}
	art_class_warrior.src = "Art/Classes/KnightStand.png";
	art_class_witch.onload = function() {checkLoaded();}
	art_class_witch.src = "Art/Classes/HexerStand.png";
	art_class_cleric.onload = function() {checkLoaded();}
	art_class_cleric.src = "Art/Classes/ClericStand.png";
	art_class_rogue.onload = function() {checkLoaded();}
	art_class_rogue.src = "Art/Classes/AssassinStand.png";
	
	art_splash_warrior.onload = function() {checkLoaded();}
	art_splash_warrior.src = "Art/Classes/KnightSplash.png";
	art_splash_witch.onload = function() {checkLoaded();}
	art_splash_witch.src = "Art/Classes/HexerSplash.png";
	art_splash_cleric.onload = function() {checkLoaded();}
	art_splash_cleric.src = "Art/Classes/ClericSplash.png";
	art_splash_rogue.onload = function() {checkLoaded();}
	art_splash_rogue.src = "Art/Classes/AssassinSplash.png";
	
	art_combat_general.onload = function() {checkLoaded();}
	art_combat_general.src = "Art/UI/GeneralOptionsList.png";
	art_combat_actor_display.onload = function() {checkLoaded();}
	art_combat_actor_display.src = "Art/UI/ActorDisplay.png";
	
	art_yesno.onload = function() {checkLoaded();}
	art_yesno.src = "Art/UI/YesNo.png";
}
function checkLoaded() {
	currentImages++;
	if (currentImages==totalImages) {
		initGame();
	}
}

var soundEnabled = true;
var crit_sound = "Audio/CritSound.mp3";

function playSound(initSound) {
	if (soundEnabled) {
		new Audio(initSound).play();
	}
}