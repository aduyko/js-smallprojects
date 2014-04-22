var speeds = [];
var turnCounter = [];
var turnQueue = [];
var TURN_SPEED = 30;

//loads the speeds of our actors. this is important becaujse enemies change
function loadSpeeds(originals) {
	speeds = [];
	turnCounter = [];
	for (i=0;i<originals.length;i++) {
		if (originals[i].alive==true) {
		speeds.splice(speeds.length,0,originals[i].speed);
		}
		else {
		speeds.splice(speeds.length,0,0);
		}
	}
	for (i=0;i<originals.length;i++) {
		turnCounter.splice(turnCounter.length,0,0);
	}
}
function newSpeeds(originals) {
	speeds=[];
	for (i=0;i<originals.length;i++) {
		if (originals[i].alive==true) {
		speeds.splice(speeds.length,0,originals[i].speed);
		}
		else {
		speeds.splice(speeds.length,0,0);
		}
	}
}

//updates the speeds once, whoevre hits 100 gets pushed into the ready queue
function updateSpeeds() {
	var turnNow = []; //tracks the indexes of who is ready so we can push them into our stack
	var speedLeft = [];
///////////clone speeds into speedLeft, 
	for (i=0;i<speeds.length;i++) {
		speedLeft[i]=speeds[i];
	}
	var operationDone=false;
	//see who hits 100 this run
	do {
		operationDone = false;
		//increment turnCounter while speed > 0, if turnCounter hits 100 splice it into turnnow.
		for (i=0;i<turnCounter.length;i++) {
			if (speedLeft[i]>0) {
				turnCounter[i]++;
				speedLeft[i]--;
				operationDone = true;
			}
			if (turnCounter[i]==TURN_SPEED) {
				turnNow.splice(turnNow.length,0,i);
				turnCounter[i]=0;
			}
		}
		//everyone who hit 100 this turn has the same speed so just rnadomize it
		if (turnNow.length > 1) {
			var randomArray = [];
			while (turnNow.length>0) {
				randomArray.splice(Math.floor(Math.random()*(randomArray.length+1)),0,turnNow[0]);
				turnNow.splice(0,1);
			}
			while (randomArray.length>0) {
				turnQueue.splice(turnQueue.length,0,randomArray[0]);
				randomArray.splice(0,1);
			}
		}
		//otherwise push everything from turnNow into the Queue
		if (turnNow.length==1) {
			turnQueue.splice(turnQueue.length,0,turnNow[0]);
			turnNow.splice(0,1);
		}
	}
	while (operationDone);
}
//this is a queue push
function getActor() {
	if (emptyQueue()) {
		return -1;
	}
	var actor = turnQueue[0];
	turnQueue.splice(0,1);
	return actor;
}

//make sure we have a ready actor
function runTurns() {
	while (emptyQueue()) {
		updateSpeeds();
	}
}

//returns true if queue is empty
function emptyQueue() {
	return turnQueue.length==0;
}

function clearQueue() {
	turnQueue = [];
}

function removeDead(deadIndex) {
	for (i=turnQueue.length-1;i>=0;i--) {
		if (turnQueue[i]==deadIndex) {
			turnQueue.splice(i,1);
		}
	}
}