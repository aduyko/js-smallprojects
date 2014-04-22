var TimerHandler = function(game) {
  this.game = game;
  this.timers = {};

  this.startTimer = function(type) {
    var t;
    switch (type) {
      case Const.TIMER_GAME:
        t = new Timer(this.game);
        t.start();
        break;
      default:
        break;
    }
    this.timers[type] = t;
  }

  this.stopTimer = function(timer) {
    if (this.timers[timer]!=null) {
      this.timers[timer].stop();
      delete(this.timers[timer]);
    }
  }
}

var Timer = function(game) {
  this.game = game;
  this.timer = 0;

  this.delta = 0;
  this.timeNow = 0;
  this.timeThen = 0;

  this.start = function() {
    this.timeThen = Date.now();

    var then = this.timeThen;
    var now = this.timeNow;
    var d = this.delta;
    this.timer = setInterval(function() {
      now = Date.now();
      d = (now-then)/1000;
      game.step(d);
      then = now;
    }, Const.DEFAULT_TIMER_INTERVAL);
  }

  this.pause = function() {
    clearInterval(this.timer);
  }
  this.stop = function() {
    clearInterval(this.timer);
    delete (this.timer);
  }
}