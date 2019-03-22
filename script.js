
var cnv;
let desktop,mouse;

//images
var bg,pointer,pointer_black;

function preload(){
  bg = loadImage("Nigerian-flag.jpg")
  pointer = loadImage("mousepointer.png")
  pointer_black = loadImage("mousepointer_black.png")
}


function setup(){
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
	let tb_height = 50
	let tb_color = color('#25A976')//Choose color for toolbar
	fill(tb_color)
    rect(0,windowHeight-tb_height,windowWidth-1,tb_height-1);
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
    if (mouseIsPressed == false){
      image(pointer,mouseX,mouseY,24,25)
    } else {
      image(pointer_black,mouseX,mouseY,24,25)
    }
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