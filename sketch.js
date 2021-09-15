var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var PLAY=1
var END =9
var gameState=PLAY

var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png")
  obstacle1= loadImage("obstacle1.png")
  obstacle2= loadImage("obstacle2.png")
  obstacle3= loadImage("obstacle3.png")
  obstacle4= loadImage("obstacle4.png")
  obstacle5= loadImage("obstacle5.png")
  obstacle6= loadImage("obstacle6.png")
  GameOverImg = loadImage("gameOver.png")
  RestartImg = loadImage("restart.png")
  jumpSound = loadSound("jump.mp3")
  deadSound = loadSound("die.mp3")
  checkpointSound = loadSound("checkpoint.mp3")
}

function setup() {

  createCanvas(windowWidth,windowHeight)
  
  //create a trex sprite
  trex = createSprite(50,height-100,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided)
  trex.scale = 0.5;
  trex.debug=false
  trex.setCollider("circle",0,0,40)

  gameOver = createSprite(width/2,height/2-50,10,10)
  gameOver.addImage("GAMEOVER",GameOverImg)
  gameOver.scale=2
  restart = createSprite(width/2,height/2,10,10)
  restart.addImage(RestartImg)
  restart.scale=0.5
  //create a ground sprite
  ground = createSprite(width/2,height-60,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
 
  
  //creating invisible ground
  invisibleGround = createSprite(width/2,height-50,width,10);
  invisibleGround.visible = false;
  cloudsGroup=createGroup()
  obstaclesGroup=new Group()
  //generate random numbers
  
score = 0
}

function draw() {
  //set background color
  background(180);
  text("SCORE="+score,50,50)
 
  
  console.log(trex.y)
  
  if(gameState===PLAY){
    score=score+Math.round(getFrameRate()/60)
    gameOver.visible=false
    restart.visible=false
    if(keyDown("space")&& trex.y >= 100) {
      trex.velocityY = -10;
      jumpSound.play()
    }
    
    trex.velocityY = trex.velocityY + 0.9
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    if(score%100===0 &&score>0){
       checkpointSound.play()
    }
    spawnClouds()
    spawnObstacles()
    ground.velocityX = -(5+score/100);
   if(obstaclesGroup.isTouching(trex)){
     gameState=9
     deadSound.play()
    //trex.velocityY=-13
   // jumpSound.play()
   }

  }
  else if(gameState===9){
    gameOver.visible = true
    restart.visible=true
    ground.velocityX=0
    cloudsGroup.setVelocityXEach(0)
    obstaclesGroup.setVelocityXEach(0)
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)
    trex.changeAnimation("collided")
    trex.velocityY=0
    if(mousePressedOver(restart)){
       reset()
    }
  }

  // jump when the space key is pressed
 
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  //Spawn Clouds
  
  drawSprites();
}

//function to spawn the clouds
function spawnClouds(){
 if(frameCount%60===0){
  cloud=createSprite(width+20,100,40,10);
  cloud.velocityX=-3;
  cloud.addImage(cloudImg)
  cloud.scale = 0.7;
  cloud.y= Math.round(random(20,150))
  trex.depth=cloud.depth
  trex.depth+=1
  cloud.lifetime=200
  cloudsGroup.add(cloud)
 }

 
}

function spawnObstacles(){
  if(frameCount%80===0){
    obstacle = createSprite(width+20,height-70,10,40)
    obstacle.velocityX=-(5+score/100)
    rand = Math.round(random(1,6))
    switch(rand){
    case 1 : obstacle.addImage(obstacle1)
    break
    case 2: obstacle.addImage(obstacle2)
    break
    case 3: obstacle.addImage(obstacle3)
    break
    case 4: obstacle.addImage(obstacle4)
    break
    case 5: obstacle.addImage(obstacle5)
    break
    case 6: obstacle.addImage(obstacle6)
    break
    default:break
  }
  obstacle.scale = 0.5;
  obstacle.lifetime =width/4
  obstaclesGroup.add(obstacle)
  }
}
function reset(){
  gameState=PLAY
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  trex.changeAnimation("running")
  score=0
}