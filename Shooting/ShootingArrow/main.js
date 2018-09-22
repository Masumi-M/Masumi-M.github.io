window.focus();
enchant();

window.onload = function() {
  //initializing the game
  var game = new Core(320, 320);
  var teki2 = 0;
  var teki3 = 0;
  game.fps = 15;
  game.preload('effect0.png', 'start.png', 'end.png', 'clear.png', 'pad.png', 'apad.png', 'font2.png', 'Maru.png', 'Arrow.png', 'Apple.png', 'Leaf.png', 'Water.png');
  game.rootScene.backgroundColor = "#8CA";

  game.onload = function() {
    //---codes for "touchend"
    var isTouch = false;
    game.rootScene.addEventListener("touchend", function(){
      isTouch = true;
    });

    //---codes for "player"
    var player = new Sprite(32, 32);
    player.image = game.assets['Maru.png'];
    game.rootScene.addChild(player);
    player.x = Math.random()*200 + 60;
    player.vx = 5;
    player.y = 280;
    player.tamaCounter = 0;

    player.addEventListener('enterframe', function() {
      player.x += player.vx;
      if(player.x < 10 || player.x > 280){
        player.vx *= -1;
      }
      if(isTouch === true){
        if (player.tamaCounter === 0) {
          tamaP = new TamaP();
          player.tamaCounter = 1;
        }
        isTouch = false;
      }
      if(this.within(enemy1, 16) || this.within(enemy2, 16) || this.within(enemy3, 16)){
        game.end(null,null,game.assets['end.png']);
      }
    });

    //---codes for "TamaP"
    var TamaP = Class.create(Sprite, {
      initialize: function() {
        Sprite.call(this, 32, 32);
        this.image = game.assets['Arrow.png'];
        this.x = player.x + 8;
        this.y = player.y;
        game.rootScene.addChild(this);
      },
      onenterframe: function() {
        this.y -= 20;
        if (this.y < 0) {
          game.rootScene.removeChild(this);
          player.tamaCounter = 0;
        }
        if (this.within(enemy1, 20)) {
          scoreLabel.score += 1;
          game.rootScene.removeChild(this);
          var burst = new Burst(enemy1.x, enemy1.y, 1);
          player.tamaCounter = 0;
        }
        if (this.within(enemy2, 20) && teki2 === 1) {
          scoreLabel.score += 3;
          game.rootScene.removeChild(this);
          var burst2 = new Burst(enemy2.x, enemy2.y, 2);
          player.tamaCounter = 0;
        }
        if (this.within(enemy3, 20) && teki3 === 1) {
          scoreLabel.score += 5;
          game.rootScene.removeChild(this);
          var burst3 = new Burst(enemy3.x, enemy3.y, 3);
          player.tamaCounter = 0;
        }
      }
    });

    var Burst = Class.create(Sprite, {
      initialize: function(x, y, z){
        Sprite.call(this, 32, 32);
        this.image = game.assets['effect0.png'];
        this.x = x;
        this.y = y;
        this.count = 0;
        this.frame = this.count;
        game.rootScene.addChild(this);
        if(z === 1){
          game.rootScene.removeChild(enemy1);
          enemy1.x = 0;
          enemy1.y = 20;
          enemy1.vx = 5;
          game.rootScene.addChild(enemy1);
        }
        if(z === 2){
          game.rootScene.removeChild(enemy2);
          enemy2.x = 288;
          enemy2.y = 40;
          enemy2.vx = -10;
          game.rootScene.addChild(enemy2);
        }
        if(z === 3){
          game.rootScene.removeChild(enemy3);
          enemy3.x = Math.random()*250 + 20;
          enemy3.y = 20;
          enemy3.vx = 12;
          game.rootScene.addChild(enemy3);
        }
      },
      onenterframe: function(){
        this.count++;
        this.frame = this.count;
        if(this.count===4){
          game.rootScene.removeChild(this);
          scoreLabel.score +=1;
        }
      }
    });

    //---codes for "enemy1"
    var enemy1 = new Sprite(32, 32);
    enemy1.image = game.assets['Apple.png'];
    enemy1.x = 0;
    enemy1.y = 20;
    enemy1.vx = 5;
    setTimeout(function(){
      game.rootScene.addChild(enemy1);
      enemy1.addEventListener('enterframe', function() {
        this.x += this.vx;
        if (this.x > 288 || this.x < 0) {
            this.vx = this.vx * -1;
            this.y = this.y + 20;
        }
      });
    }, 0);

    //---codes for "enemy2"
    var enemy2 = new Sprite(32, 32);
    enemy2.image = game.assets['Leaf.png'];
    enemy2.x = 288;
    enemy2.y = 40;
    enemy2.vx = -10;
    if(teki2===1){
        game.rootScene.addChild(enemy2);
    }
    setTimeout(function(){
        teki2 = 1;
        game.rootScene.addChild(enemy2);
        enemy2.addEventListener('enterframe', function() {
        this.x += this.vx;
        if (this.x > 288 || this.x < 0) {
            this.vx = this.vx * -1;
            this.y = this.y + 20;
        }
      });
    }, 5000);

    //---codes for "enemy3"
    var enemy3 = new Sprite(32, 32);
    enemy3.image = game.assets['Water.png'];
    enemy3.x = Math.random()*250 + 20;
    enemy3.y = 20;
    enemy3.vx = -12;
    setTimeout(function(){
        teki3 = 1;
        game.rootScene.addChild(enemy3);
        enemy3.addEventListener('enterframe', function() {
        this.x += this.vx;
        this.y += 1;
        if (this.x > 288 || this.x < 0) {
          this.vx = this.vx * -1;
          if(this.vx === 12){
            this.scaleX = -1;
          }else{
            this.scaleX = 1;
          }
        }
        if(this.y > 300){
          this.y = 20;
        }
      });
    }, 10000);

    //---codes for "scoreLabel"
    var scoreLabel = new ScoreLabel(180, 10);
    scoreLabel.score = 0;
    game.rootScene.addChild(scoreLabel);

    //---codes for "timeLabel"
    var timeLabel = new MutableText(30, 10);
    timeLabel.limitTime = 30;
    timeLabel.text = 'TIME:' + timeLabel.limitTime;
    game.rootScene.addChild(timeLabel);

    timeLabel.addEventListener('enterframe', function(){
      if(game.frame % game.fps === 0){
        timeLabel.limitTime--;
        timeLabel.text = 'TIME:' + timeLabel.limitTime;
      }
      if(timeLabel.limitTime === 0){
        game.end(null, null, game.assets['clear.png']);
      }
    });
  };

  game.start(null, null, game.assets['start.png']);
};
