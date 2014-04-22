var Game = {
	state : 0,
	data : {},
	stage : {},
	timers : {},
	keys : {},

	init : function(){
		this.data = new DataModel(this);
		this.data.init();
		this.stage = new Stage(this);
		this.stage.init();
		this.keys = new KeyHandler(this);
		this.keys.init();
		this.timers = new TimerHandler(this);
	},

	setup : function(state){
		this.timers.stopTimer(Const.TIMER_GAME);
		this.state = state;
		switch (this.state) {
			case Const.STATE_ROULETTE:
				break;
			case Const.STATE_SMASH:
				break;
			default:
				;
		}
		this.data.setup(this.state);
		this.stage.setup(this.state, this.data.getObjectList(this.state), this.data.getSceneObjects(this.state));
		this.stage.render();
		this.timers.startTimer(Const.TIMER_GAME);
	},

	step : function(delta){
		this.data.splatter(delta);
		switch (this.state) {
			case Const.STATE_ROULETTE:
				this.data.spin(delta);
				this.data.updateTime(delta);
				this.stage.updateTime(this.data.getTime());
				this.stage.render();
				break;
			case Const.STATE_SMASH:
				this.data.updateTime(delta);
				this.stage.updateTime(this.data.getTime());
				this.stage.render();
				break;
			case Const.STATE_OVER:
				break;
			default:
				;
		}
	},

	action : function() {
		switch (this.state) {
			case Const.STATE_ROULETTE:
				this.data.checkFruit();
				this.data.newTarget();
				this.data.resetTime();
				this.stage.setObjects(this.data.getObjectList(this.state));
				this.stage.updateSceneObjects(this.data.getSceneObjects(this.state));
				break;
			case Const.STATE_SMASH:
				this.data.smash();
				this.data.resetTime();
				this.stage.addChunks(this.data.getObjectList(this.state));
				this.stage.updateSceneObjects(this.data.getSceneObjects(this.state));
				break;
			case Const.STATE_OVER:
				this.setup(Const.STATE_ROULETTE);
			default:
				;
		}
	},


}