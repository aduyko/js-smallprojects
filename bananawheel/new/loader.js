var Loader = function(game, data) {
  this.game = game;
  this.data = data;
  this.queue = [];
  this.count = 0;

  this.loadData = function() {
    var loader = this;
    $.each(Const.FRUIT_DATA, function(key,val){
      loader.queueFile(key, val.image);
      for (var i=0;i<val.chunks.length;i++) {
        loader.queueFile(key+Const.CHUNK_IDENTIFIER+i, val.chunks[i]);
      }
    });
    $.each(Const.SCENE_DATA, function(key,val){
      loader.queueFile(key,val.image);
    });
    loader.load();
  }

  this.queueFile = function(key, src) {
    this.count+=1;
    this.queue.push({'key':key, 'src':src});
  }

  this.load = function() {
    var loader = this;
    $.each(this.queue, function(key,val){
      loader.loadFile(val.key, val.src);
    });
  }

  this.loadFile = function(key,src) {
    var img = new Image();
    var loader = this;
    img.onload = function(){loader.handleLoaded(key,img);}
    img.src = Const.IMAGES_PATH + src;
  }

  this.handleLoaded = function(key,val) {
    this.data.images[key] = val;
    this.count-=1;
    if (this.count==0) {
      this.handleComplete();
    }
  }
  this.handleComplete = function() {
    this.game.setup(Const.STATE_ROULETTE);
  }
}