var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var trexcrouch;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var checksound, diesound, jumpsound
var score;
var gameover;
var restart;
var restartimg;
var gameoverimg;
var teroimg;
var tero;
var teroGroup;
var moon, moonimg;
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trexcrouch = loadAnimation("trex_down1.png","trex_down2.png");
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

restartimg = loadImage("restart.png");
gameoverimg = loadImage("gameOver.png");
teroimg = loadAnimation("tero1.png","tero2.png");
checksound = loadSound("checkpoint.mp3");
diesound = loadSound("die.mp3");
jumpsound = loadSound("jump.mp3");
moonimg = loadImage("luna.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight );
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided);
  trex.addAnimation("down",trexcrouch);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-80,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(width/2,height-70,width,10);
  invisibleGround.visible = false;
  restart = createSprite(width/2,height/2);
  restart.addImage(restartimg)
  restart.scale = 0.5;
  gameover = createSprite(width/2,height/2-50);
  gameover.addImage(gameoverimg);

  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  teroGroup = createGroup();
  
  console.log("Hola" + 5);
  
  trex.setCollider("circle",0,0,40);
  trex.debug = false;
  
  score = 0
}

function draw() {
  background(180);
  //mostrar la puntuación
  text("Puntuación : "+ score, width/2+350,height/2+70);
  
  console.log("esto es  ",gameState)
  
  
  if(gameState === PLAY){
    gameover.visible = false;
    restart.visible = false;
    //mover el suelo
    ground.velocityX = -(4+3*score/100);
    //puntuación
    score = score + Math.round(frameCount/100);
    if(score>0 && score%100===0){
      checksound.play();
    }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //hacer que el Trex salte al presionar la barra espaciadora
    if(touches.length > 0 || keyDown("space")&& trex.y >=height-130) {
        trex.velocityY = -13;
        jumpsound.play();
        touches = [];
    }
    
    //agregar gravedad
    trex.velocityY = trex.velocityY + 0.8
    if(keyDown("down_arrow")){
      trex.changeAnimation("down",trexcrouch);
      trex.scale = 0.4
    }
    if(keyWentUp("down_arrow")){
      trex.changeAnimation("running",trex_running);
      trex.scale = 0.5
    }
    if(teroGroup.isTouching(trex)){
      gameState = END
    }
    //aparecer nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();

    spawnTero();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        //trex.velocityY = -13
        diesound.play();
        //jumpsound.play();
        
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     teroGroup.setVelocityXEach(0);
     teroGroup.setLifetimeEach(-1);
     trex.changeAnimation("collided",trex_collided);
     obstaclesGroup.setLifetimeEach(-1);
     cloudsGroup.setLifetimeEach(-1);
     if(touches.length > 0 || keyDown("space")){
      touches = [];
      reset();
     }
     trex.velocityY=0;
     gameover.visible = true;
     restart.visible = true;
     if(mousePressedOver(restart)){
      reset();
    }
   }
  
 
  //evitar que el Trex caiga
  trex.collide(invisibleGround);
  
  
  
  
  drawSprites();
}
function reset(){
restart.visible = false;
gameover.visible = false;
trex.changeAnimation("running", trex_running);
obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();
teroGroup.destroyEach();
score = 0
gameState = PLAY
trex.y = height-70
}



function spawnObstacles(){
 if (frameCount % 90 === 0){
   var obstacle = createSprite(width/2+350  ,height-95,10,40);
   obstacle.velocityX = -(4+score/100);   
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y ciclo de vida al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(width/2+350,100,40,10);
    cloud.y = Math.round(random(height/2+50,height/2-30 ));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar ciclo de vida a la variable
    cloud.lifetime = 400;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //ajustar la profundidad
   cloudsGroup.add(cloud);
    }
}

function spawnTero(){
  if (frameCount % 80 === 0){
tero = createSprite(width/2+350,100);
tero.addAnimation("terofly",teroimg);
tero.y = Math.round(random(height/2+50,height/2+400));
tero.velocityX = -3;
tero.lifetime = 400;
teroGroup.add(tero)
  }

}