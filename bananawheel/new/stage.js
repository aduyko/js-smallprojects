var Stage = function(game) {
  this.game = game;
  this.canvas = $("#canvas")[0];
  this.ctx = this.canvas.getContext("2d");
  this.bigCanvas = $("#chunk-canvas")[0];
  this.bigCtx = this.bigCanvas.getContext("2d");
  this.offset={'top':0, 'left':0}

  this.objectList = [];
  this.chunksList = [];
  this.sceneObjectList = [];
  this.sceneList = [];

  this.time = {};

  this.render = function() {
    this.renderBackground();
    if (Object.keys(this.time).length!=0) {
      this.renderTime();
    }
    this.renderObjects();
  }

  this.renderBackground = function() {
    this.ctx.fillStyle="grey";
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.bigCtx.clearRect(0,0,this.bigCanvas.width,this.bigCanvas.height);
    for (var i=0;i<this.chunksList.length;i++) {
      var obj = this.chunksList[i];
      this.bigCtx.drawImage(obj.img,obj.x-obj.size/2 + this.offset.left,obj.y-obj.size/2+this.offset.top);
    }

    for (var i=0;i<this.sceneList.length;i++) {
      var obj = this.sceneList[i];
      if (obj.bg != null) {
        this.ctx.fillStyle = obj.bg;
        this.ctx.fillRect(obj.x-obj.size/2,obj.y-obj.size/2,obj.size,obj.size);
      }
      this.ctx.drawImage(obj.img,obj.x-obj.size/2,obj.y-obj.size/2);
    }
  }
  this.renderObjects = function() {
    for (var i=0;i<this.objectList.length;i++) {
      var obj = this.objectList[i];
      this.ctx.drawImage(obj.img,obj.x-obj.size/2,obj.y-obj.size/2);
    }
    for (var i=0;i<this.sceneObjectList.length;i++) {
      var obj = this.sceneObjectList[i];
      if (obj.bg != null) {
        this.ctx.fillStyle = obj.bg;
        this.ctx.fillRect(obj.x-obj.size/2,obj.y-obj.size/2,obj.size,obj.size);
      }
      this.ctx.drawImage(obj.img,obj.x-obj.size/2,obj.y-obj.size/2);
    }
  }
  this.renderTime = function() {
    var maxTime = this.time.max;
    var timeLeft = this.time.timeLeft;
    this.ctx.fillStyle='red';
    this.ctx.beginPath();
    this.ctx.arc(   Const.CANVAS_ROULETTE_CENTER_X,
                    Const.CANVAS_ROULETTE_CENTER_Y,
                    Const.CANVAS_ROULETTE_RADIUS-50.5,
                    1.5*Math.PI,
                    2*Math.PI*(timeLeft/maxTime) + 1.5*Math.PI);
    this.ctx.lineTo(Const.CANVAS_ROULETTE_CENTER_X, Const.CANVAS_ROULETTE_CENTER_Y)
    this.ctx.fill();
    this.ctx.closePath();
  }

  this.init = function() {
    $(this.canvas).attr("tabindex",0);
    $(this.canvas).focus();

    this.initBigCanvas();
  }

  this.initBigCanvas = function() {
    var s = this;

    this.bigCtx.canvas.width  = window.innerWidth-17;
    this.bigCtx.canvas.height = window.innerHeight-17;
    s.offset.top = $(s.canvas).offset().top - $(s.bigCanvas).offset().top;
    s.offset.left = $(s.canvas).offset().left - $(s.bigCanvas).offset().left;
    $(this.bigCanvas).click(function(e){
      e.stopPropagation();
      $(s.canvas).focus();
    });

    $(window).resize(function() {
      $(s.canvas).focus();
      s.bigCtx.canvas.width  = window.innerWidth-17;
      s.bigCtx.canvas.height = window.innerHeight-17;
      s.offset.top = $(s.canvas).offset().top - $(s.bigCanvas).offset().top;
      s.offset.left = $(s.canvas).offset().left - $(s.bigCanvas).offset().left;
    });
   
  }
  this.setup = function(state, objectList) {
    this.sceneObjectList=[];
    var sceneList = [];
    switch (state) {
      case Const.STATE_ROULETTE:
        var roulette = new SceneObject(this.game.data.images['wheel'],-50,0);
        sceneList.push(roulette);
        break;
      case Const.STATE_SMASH:
        break;
      default:
        ;
    }
    this.setObjects(objectList);
    this.setSceneObjects(sceneList);
  }
  this.setObjects = function(initList) {
    this.objectList = initList;
  }

  this.setSceneObjects = function(initList) {
    this.sceneList = initList;
  }

  this.updateSceneObjects = function(list) {
    this.sceneObjectList = list;
  }

  this.addChunks = function(newChunkList) {
    this.chunksList.push.apply(this.chunksList, newChunkList);
  }

  this.updateTime = function(time) {
    this.time = time;
  }
}

var SceneObject = function(img,x,y,size) {
  this.img = img;
  this.x = x;
  this.y = y;
  this.size = size || 0;
}