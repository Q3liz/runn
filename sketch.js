var PLAY = 1;
var END = 0;
var gameState = PLAY;

var girl
var ground, invisibleGround, groundImage;

var coinGroup, coinImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3;
var score=0;
var life=3;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  girl_running = loadAnimation("tanjiro.png");
  girl_collided = loadAnimation("tombstone.png");
  groundImage = loadImage("forest.png");
  
  coinImage = loadImage("food.png");
  obstacle2 = loadImage("rock.png");
  obstacle1 = loadImage("snake.png");
  obstacle3 = loadImage("spirit.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth,displayHeight);
  girl = createSprite(50,height-200,1,2);
  girl.addAnimation("running", girl_running);
  girl.scale = 0.5;
  
  ground = createSprite(0,height-150,width*2,10);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/3);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  obstaclesGroup = new Group();
  
  girl.debug=true
  girl.setCollider("circle",0,0,40)
  score = 0;
}

function draw() {
  background(groundImage);
  textSize(25);
  fill(255);
  text("Score: "+ score, 500,40);
  text("life: "+ life , 500,80);
  drawSprites();
  if (gameState===PLAY){
    ground.velocityX = -(6 + 3*score/100);
    count = Math.round(World.frameCount/4);
   if(girl.isTouching(coinGroup)){
     score=score+1
     coinGroup[0].destroy()
   }
    if(score >= 0){
      ground.velocityX = -30;
    }
   
    
  
    if(keyDown("space") && girl.y >= 139) {
      girl.velocityY = -12;
    }
  
    girl.velocityY = girl.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    girl.collide(ground);
    
    spawnCoin();
    spawnObstacles();
  
   if(obstaclesGroup.isTouching(girl)){
        gameState = END;
    } 
    
    if(girl.isTouching(obstaclesGroup)){
      life=life-1
    }
    
      
    
  }
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    girl.addAnimation("collided", girl_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    girl.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    //change the trex animation
    girl.changeAnimation("collided",girl_collided);
    girl.scale =0.35;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      
      
    if(life>0){
      reset()
      }
    }
  }
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 200 === 0) {
    var coin = createSprite(width,height-200,40,10);
    coin.y = Math.round(random(height-200,height-300));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 500;
    
    //adjust the depth
    coin.depth = girl.depth;
    girl.depth = girl.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(width,height-180,10,40);
    obstacle.velocityX= -(6+3*count/100);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  velocityX= -(6+3*count/100);
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  girl.changeAnimation("running",girl_running);
  girl.scale =0.5;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
  
}