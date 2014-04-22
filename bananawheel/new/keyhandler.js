var KeyHandler = function(game) {
  this.game = game;

  this.init = function() {
    var k = this;
    $("#canvas").keydown(function(event) {
      k.keyDown(event.keyCode);
    });
    $("#canvas").keyup(function(event) {
      k.keyUp(event.keyCode);
    });
  }

  this.keyDown = function(key) {
    if (key==32) {
      this.game.action();
    }
  }
  this.keyUp = function(key) {

  }
}