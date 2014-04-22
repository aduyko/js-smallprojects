var DataModel = function(game) {
  this.game = game;
  this.fruits = [];
  this.speedScale = Const.INIT_SPEED_SCALE;
  this.target;
  this.combo = 0;
  this.fruitTarget = Const.INIT_FRUITS_TARGET;
  this.selectedFruits = [];

  this.maxTime = 0;
  this.timeLeft = 0;

  this.images = {};
  this.chunks = [];
  this.newChunks = [];
  this.objectList = [];

  this.init = function() {
    var loader = new Loader(game,this);
    loader.loadData();
  }

  this.spin = function(delta) {
    for (i=0;i<this.fruits.length;i++) {
      var f = this.fruits[i];
      f.angle+=delta*this.speedScale;
      if (f.angle>=2*Math.PI)
        f.angle-=2*Math.PI;
      f.x = Const.CANVAS_ROULETTE_CENTER_X+(Const.CANVAS_ROULETTE_RADIUS)*Math.cos(f.angle);
      f.y = Const.CANVAS_ROULETTE_CENTER_Y+(Const.CANVAS_ROULETTE_RADIUS)*Math.sin(f.angle);
    }
  }

  this.setup = function(state) {
    switch(state) {
      case Const.STATE_ROULETTE:
        this.fruits=[];
        this.selectedFruits=[];
        this.fruitTarget = Const.INIT_FRUITS_TARGET;
        this.speedScale = Const.INIT_SPEED_SCALE;
        this.initFruits();
        this.newTarget();
        this.maxTime = Const.INIT_ROULETTE_TIME;
        this.timeLeft = this.maxTime/this.speedScale;
        break;
      case Const.STATE_SMASH:
        this.fruitTarget = Const.INIT_FRUITS_TARGET;
        this.speedScale = Const.INIT_SPEED_SCALE;
        this.initSmash();
        this.maxTime = Const.INIT_ROULETTE_TIME;
        this.timeLeft = this.maxTime/this.speedScale;
      default:
        ;
    }
  }
  this.initFruits = function() {
    for (j=0;j<Const.INIT_NUM_FRUITS;j++) {
      var f = new Fruit(Const.FRUIT_TYPES[(j%Const.FRUIT_TYPES.length)]);
      f.angle= j*2*Math.PI/Const.INIT_NUM_FRUITS;
      f.x = Const.CANVAS_ROULETTE_CENTER_X+(Const.CANVAS_ROULETTE_RADIUS)*Math.cos(f.angle);
      f.y = Const.CANVAS_ROULETTE_CENTER_Y+(Const.CANVAS_ROULETTE_RADIUS)*Math.sin(f.angle);
      f.img = this.images[f.type];
      this.fruits.push(f);
    }
  }
  this.initSmash = function() {
    for (j=0;j<this.selectedFruits.length;j++) {
      var f = this.selectedFruits[j];
      f.x = 150;
      f.y = 200;
      f.bg = null;
    }
  }
  this.newTarget = function() {
    var t = new Fruit(Const.FRUIT_TYPES[Math.floor(Math.random()*Const.FRUIT_TYPES.length)]);
    t.img = this.images[t.type];
    t.x = 150;
    t.y = 200;
    this.target = t;
  }
  this.checkFruit = function() {
    var best = 10000;
    var bestIdx = 0;
    var goal = Const.INIT_TARGET_ANGLE;
    for (i=0;i<this.fruits.length;i++){
      var angle = this.fruits[i].angle - Math.PI;
      var diff = Math.abs(angle-goal);
      if (diff<best) {
        best = diff;
        bestIdx = i;
      }
    }
    this.speedScale += .7;
    this.fruitTarget -= 1;
    var bestFruit = $.extend({}, this.fruits[bestIdx]);
    bestFruit.x = 400;
    bestFruit.y = 40 + this.selectedFruits.length*60;

    if (bestFruit.type==this.target.type) { this.combo += 1; bestFruit.bg='green'; }
    else { this.speedScale -= 1.4; this.combo=0; bestFruit.bg='red';}

    this.selectedFruits.push(bestFruit);
    if (this.fruitTarget==0) { 
      this.speedScale = 0;
    }
    if (this.fruitTarget==-1) {  
      this.game.setup(Const.STATE_SMASH);
    }
  }
  this.smash = function() {
    var smashed = this.selectedFruits[0];
    var newChunks = [];
    for (var i=0;i<Const.FRUIT_DATA[smashed.type].numChunks;i++) {
      var nc = new Chunk();
      nc.img = smashed.img;
      nc.x = smashed.x;
      nc.y = smashed.y;
      nc.size = smashed.size;
      nc.speed = Const.FRUIT_DATA[smashed.type].speed * Math.random() * 10;
      nc.angle = Math.random()*2*Math.PI;
      newChunks.push(nc);
    }
    this.newChunks = newChunks;
    this.chunks.push.apply(this.chunks, this.newChunks);
    this.selectedFruits.splice(0,1);
    if (this.selectedFruits.length==0){
      this.game.setup(Const.STATE_OVER);
    }
  }
  this.splatter = function(delta) {
    if (this.chunks.length>0) {
      var stopped = [];
      for (var i=0;i<this.chunks.length;i++) {
        var c = this.chunks[i];
        c.x = c.x-c.speed*Math.cos(c.angle)*delta;
        c.y = c.y-c.speed*Math.sin(c.angle)*delta;
        c.speed -= 1;
        if (c.speed<=0) {
          stopped.push(c);
        }
      }
      for (var i=0;i<stopped.length;i++) {
        this.chunks.splice(stopped[i],1);
      }
    }
  }
  this.getObjectList = function(state) {
    var list = [];
    switch (state) {
      case Const.STATE_ROULETTE:
        list = this.fruits.slice(0);
        list.push(this.target);
        break;
      case Const.STATE_SMASH:
        list = this.newChunks;
        break;
      default:
        ;
    }
    return list;
  }
  this.getSceneObjects = function(state) {
    var list = [];
    switch (state) {
      case Const.STATE_ROULETTE:
        list = this.selectedFruits;
        break;
      case Const.STATE_SMASH:
        list = [];
        list.push(this.selectedFruits[0]);
        break;
      default:
        ;
    }
    return list;
  }


  this.updateTime = function(delta) {
    if (this.timeLeft > 0) {
      this.timeLeft -= delta;
    } 
    if (this.timeLeft < 0) {
      this.timeLeft = 0;
    }
  }
  this.resetTime = function() {
    if (this.speedScale==0) {
      this.timeLeft = this.maxTime;
    } else {
      this.timeLeft = this.maxTime/this.speedScale;
    }
  }

  this.getTime = function() {
    return {'max' : this.maxTime, 'timeLeft' : this.timeLeft*this.speedScale};
  }
}

var Fruit = function(type) {
  this.type = type;
  this.img;
  this.size = Const.INIT_FRUIT_SIZE;
  this.x;
  this.y;
  this.angle;
}

var Chunk = function() {
  this.img;
  this.size;
  this.x;
  this.y;
  this.speed;
  this.angle;
}