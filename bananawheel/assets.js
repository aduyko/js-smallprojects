var art_banana = new Image();
var art_watermelon = new Image();
var art_pineapple = new Image();
var art_cherries = new Image();
var totalArt = 4;
var fruitArt = [art_banana,art_watermelon,art_pineapple,art_cherries];
var fruitChunks = [];
var smashingObjects = [];
function populateChunks() {
	fruitChunks.push([fruitArt[0],fruitArt[0],fruitArt[0]]);
	smashingObjects.push([fruitArt[2]]);
}

function loadAssets(){
	art_banana.onload = function(){checkArt();}
	art_banana.src = "Art/Fruit_Banana.png";
	art_watermelon.onload = function(){checkArt();}
	art_watermelon.src = "Art/Fruit_Watermelon.png";
	art_pineapple.onload = function(){checkArt();}
	art_pineapple.src = "Art/Fruit_Pineapple.png";
	art_cherries.onload = function(){checkArt();}
	art_cherries.src = "Art/Fruit_Cherries.png";
	populateChunks();
};
var artLoaded = 0;
function checkArt() {
	artLoaded++;
	if (artLoaded==totalArt){loadFruitSpinner()};
}
function initGame() {
	loadFruitSpinner();
}

var playSounds = true;
var bgm = [];
var sound_bangarang = new Audio();
sound_bangarang.src = "Sound/Bangarang.mp3";
var sound_vancouver = new Audio();
sound_vancouver.src = "Sound/VancouverBeatdown.mp3";

bgm.push(sound_bangarang);
bgm.push(sound_vancouver);
for (i=0;i<bgm.length;i++) {
	var curSound = bgm[i];
	curSound.addEventListener('ended', function() {
		this.currentTime = 0;
		playMusic();
	}, false);
}

var sound_fruitGet = new Audio();
sound_fruitGet.src = "Sound/FruitGet.wav";

playMusic();

function playMusic() {
	playSound(bgm[Math.floor(Math.random()*bgm.length)]);
}
function playSound(sound) {
	if (playSounds) {sound.play();}
}
function playUnconditional(sound) {
	if (playSounds) {
		var newSound = new Audio();
		newSound.src = sound.src;
		newSound.play();
	}
}