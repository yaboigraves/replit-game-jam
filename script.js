
var cnv;
let desktop,mouse;

//images
var bg,pointer;

function preload(){
  bg = loadImage("Nigerian-flag.jpg")
  pointer = loadImage("mousepointer.png")

}


function setup(){
  //try and find a way to remove scrollbars
  cnv = createCanvas(windowWidth,windowHeight)

  desktop = new Desktop();
  mouse = new Mouse(200,200);



}

function draw(){
  noCursor()
  background(100)
  image(bg,0,0,windowWidth,windowHeight)
  
  //update loops
  desktop.update()
  mouse.update()
}

class Desktop{
  //object for the entire virtual desktop, contains a mouse and applications, handles game logic
  constructor(){
    this.balance = -100000
    //count down or up from 8 minutes
    this.timer = 0;
  }

  drawToolbar(){
    rect(0,windowHeight-50,windowWidth,50);
  }
  update(){

    this.drawToolbar()
  }


}

class Mouse{
  //mouse object, moves around and clicks on stuff
  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  drawMouse(){
    //triangle(this.x-25,this.y-25,this.x,this.y+25,this.x +25,this.y +25)
    image(pointer,mouseX,mouseY,25,25)
  }
  update(){
    this.drawMouse()
    this.x = mouseX;
    this.y = mouseY;

  }
}

class Application{
  //object for applications, including their runtime logic and their file icons that reside on the desktop
  constructor(){

  }
}