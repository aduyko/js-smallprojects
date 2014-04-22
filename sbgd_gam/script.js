var STATE_MENU = 0;
var STATE_PREP = 1;
var STATE_GO = 2;

var START_TIME = 3;
var END_TIME = 1;

var Game = {
  canvas : {},
  ctx : {},
  width : 0,
  height : 0,
  timer : 0,
  state : 0,
  time : 0,
  startTime : START_TIME,
  endTime : END_TIME,
  enemy : 0,
  button : 0,
  kills : 0,
  win : 0,
  lose : 0,

  init : function() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.button = document.getElementById('button');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.state = STATE_MENU;
    var g = this;
    this.enemy = new Image();
    this.enemy.onload = function() {g.start();}
    this.enemy.src = "quickdraw.png";
    this.win = new Audio();
    this.win.src = 'gun-gunshot-01.wav';
    this.lose = new Audio();
    this.lose.src = 'fail-trombone-01.wav';
    this.start();
  },

  start : function() {
    var g = this;
    var timeNow = Date.now();
    var timeThen = Date.now();
    this.timer = setInterval(function() {
      timeThen = timeNow;
      timeNow = Date.now();

      var delta = (timeNow-timeThen) / 1000;
      g.step(delta);
    },16.67);
  },

  renderBackground : function() {
    this.ctx.fillStyle = '#E33D75';
    this.ctx.fillRect(0,0,this.width,120);
    this.ctx.fillStyle = '#FFBC40';
    this.ctx.fillRect(0,120,this.width,this.height);
    this.ctx.drawImage(this.enemy,150,80);
  },

  renderMenu : function() {
    this.renderBackground();
    this.ctx.fillStyle= 'black';
  },

  render : function() {
    this.renderBackground();
  },

  renderDraw : function() {
    this.renderBackground();
    this.ctx.font = '40px bold arial'
    this.ctx.fillText("SHOOT",130,60);
  },

  step : function(delta) {
    switch (this.state) {
      case STATE_MENU:
        this.renderMenu();
        break;
      case STATE_PREP:
        this.time-=delta;
        this.render();
        if (this.time <= 0) {
          this.state = STATE_GO;
          this.button.innerHTML = 'SHOOT';
          this.renderDraw();
        };
        break;
      case STATE_GO:
        this.time+=delta;
        if (this.time > this.endTime) {
          this.win.play();
          this.lose.play();
          alert('YOU GOT SHOT');
          this.state = STATE_MENU;
          this.button.innerHTML = 'READY';
        }
        break;
    }
  },

  click : function() {
    switch (this.state) {
      case STATE_MENU:
        this.state = STATE_PREP;
        this.initGame();
        this.button.innerHTML = 'SET';
        break;
      case STATE_PREP:
        this.lose.play();
        alert("MISFIRE!!!! YOU SHOT TOO SOON!");
        this.state = STATE_MENU;
        this.button.innerHTML = 'READY';
        break;
      case STATE_GO:
        this.win.play();
        alert("YOU SHOT HIM! NOW THERES A TOUGHER ENEMY!");
        this.kills++;
        document.getElementById('kills').innerHTML = this.kills;
        this.endTime -= .1;
        if (this.endTime==0) {
          alert("YOU KILLED 9 DUDES!!! THE LAST GUY IS IMPOSSIBLE");
        }
        this.state = STATE_MENU;
        this.button.innerHTML = 'READY';
        break;
    }
  },

  initGame : function() {
    this.time = this.startTime + (Math.random()*2 - 1);
  }
}