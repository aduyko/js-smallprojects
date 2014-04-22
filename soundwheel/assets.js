var lowC = new Audio();
lowC.src="Sounds/lowC_bell.wav";
var lowD = new Audio();
lowD.src="Sounds/lowD_bell.wav";
var lowE = new Audio();
lowE.src="Sounds/lowE_bell.wav";
var lowF = new Audio();
lowF.src="Sounds/lowF_bell.wav";
var midG = new Audio();
midG.src="Sounds/midG_bell.wav";
var midA = new Audio();
midA.src="Sounds/midA_bell.wav";
var midB = new Audio();
midB.src="Sounds/midB_bell.wav";
/*
function initAudio() {
	soundManager.setup({
		url: 'SoundManager2/',
		flashVersion: 8, // optional: shiny features (default = 8)
		useFlashBlock: false, // optionally, enable when you're ready to dive in
		onready: function() {
			soundManager.createSound({
				id: 'lowC',
				url: lowC.src,
				autoLoad: true,
				autoPlay: false,
				onload: soundCounter(),
				volume: 50
			});
			soundManager.createSound({
				id: 'lowD',
				url: lowD.src,
				autoLoad: true,
				autoPlay: false,
				onload: soundCounter(),
				volume: 50
			});
			soundManager.createSound({
				id: 'lowE',
				url: lowE.src,
				autoLoad: true,
				autoPlay: false,
				onload: soundCounter(),
				volume: 50
			});
			soundManager.createSound({
				id: 'lowF',
				url: lowF.src,
				autoLoad: true,
				autoPlay: false,
				onload: soundCounter(),
				volume: 50
			});
			soundManager.createSound({
				id: 'midG',
				url: midG.src,
				autoLoad: true,
				autoPlay: false,
				onload: soundCounter(),
				volume: 50
			});
			soundManager.createSound({
				id: 'midA',
				url: midA.src,
				autoLoad: true,
				autoPlay: false,
				onload: soundCounter(),
				volume: 50
			});
			soundManager.createSound({
				id: 'midB',
				url: midB.src,
				autoLoad: true,
				autoPlay: false,
				onload: soundCounter(),
				volume: 50
			});
		}
	});
}

function soundCounter(){
	curSounds++;
	if (curSounds==allSounds){
		main();
	}
}
*/