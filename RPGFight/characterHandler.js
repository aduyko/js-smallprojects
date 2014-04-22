var CLASS_WARRIOR = 0;
var CLASS_WITCH = 1;
var CLASS_PRIEST = 2;
var CLASS_ROGUE = 3;

var MAX_PLAYABLE_CHARS = 3;
var classList = new Array(art_class_warrior,art_class_witch,art_class_cleric,art_class_rogue); //keeps track of possible classes

var NUM_ENEMIES = 1;

var characters=[]; //stores our selected character information

var Character = function(origType) { //create a character of the selected type
	this.inventory=[];
	this.exp=0;
	this.level=1;
	this.skills=[];
	this.alive = true;
	
	this.type = origType;
	this.art = origType;
	switch (origType) {
		case CLASS_WARRIOR:
			this.maxHP = 40;
			this.HP = 40;
			this.maxMP = 5;
			this.MP = 5;
			this.attack = 5;
			this.defense = 5;
			this.magic = 1;
			this.resistance = 3;
			this.speed = 3;
			this.skills.splice(0,0,warrior_powerattack);
			break;
		case CLASS_WITCH:
			this.maxHP = 40;
			this.HP = 40;
			this.maxMP = 5;
			this.MP = 5;
			this.attack = 5;
			this.defense = 5;
			this.magic = 1;
			this.resistance = 3;
			this.speed = 2;
			this.skills.splice(0,0,warrior_powerattack);
			break;
		case CLASS_PRIEST:
			this.maxHP = 40;
			this.HP = 40;
			this.maxMP = 5;
			this.MP = 5;
			this.attack = 5;
			this.defense = 5;
			this.magic = 1;
			this.resistance = 3;
			this.speed = 2;
			this.skills.splice(0,0,warrior_powerattack);
			break;
		case CLASS_ROGUE:
			this.maxHP = 40;
			this.HP = 40;
			this.maxMP = 5;
			this.MP = 5;
			this.attack = 5;
			this.defense = 5;
			this.magic = 1;
			this.resistance = 3;
			this.speed = 4;
			this.skills.splice(0,0,warrior_powerattack);
			break;
		default:
			break;
	}
}
var Enemy = function(origType) { //create a character of the selected type
	this.level=1;
	this.skills=[];
	this.alive = true;
	
	this.type = origType;
	this.art = origType;
	switch (origType) {
		case CLASS_WARRIOR:
			this.maxHP = 40;
			this.HP = 40;
			this.maxMP = 5;
			this.MP = 5;
			this.attack = 5;
			this.defense = 5;
			this.magic = 1;
			this.resistance = 3;
			this.speed = 3;
			this.skills.splice(0,0,warrior_powerattack);
			break;
		default:
	}
}
//who is always the target ORIGINATING the attack. this is important for knowing how much damage to do etc.
function universal_attack() {
	var who = characters[currentActor];
	var target = characters[selectedTargets[0]];
	var damage = (3+(who.attack-target.defense)/2);
	if (Math.random() <.1) {
		damage*=2;
		playSound(crit_sound);
	}
	doDamage(target, damage);
	selectedTargets.splice(0,1);
}

function warrior_powerattack() { 
	var target = selectTarget();
	var damage = ((who.attack-target.defense)*3);
	target.HP-= damage;
	who.MP-= 1;
	displayDamage(damage,target);
}

function doDamage(initTarget, initDamage) {
	initTarget.HP -= initDamage;
	if (initTarget.HP<=0) {
		initTarget.alive = false;
		initTarget.HP = 0;
		resetSpeeds = true;
		removeDead(selectedTargets[0]);
	}
}
function addEnemy() {
	var newEnemy = new Enemy(Math.floor(Math.random()*NUM_ENEMIES));
	characters.splice(characters[characters.length],0,newEnemy);
	characters[characters.length-1].x = 0;
}
function teamDead() {
	for (i=0;i<MAX_PLAYABLE_CHARS;i++) {
		if (characters[i].alive==true) {
			return false;
		}
	}
	return true;
}