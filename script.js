
var cnv;
let desktop,mouse;
let textarea; // uded to holds the textarea object

//images
var bg;
let start;


function preload(){
  bg = loadImage("Nigerian-flag.jpg")
}


function setup(){
  cnv = createCanvas(windowWidth,windowHeight)
  desktop = new Desktop();
  mouse = new Mouse(200,200);

  //mail application (x,y,"pic file name",width,height,window_x,window_y)
  mail = new Application(10,400,"ie-logo.png",500,500,50,50);
  mail.win.background(200);
    
    
  textarea = new Textdata();
  // textarea.makegrid();

}

function draw(){
  noCursor()
  background(100)
  image(bg,0,0,windowWidth,windowHeight)
  
  mail.update();
  textarea.display();
    
    
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
      //image(pointer,mouseX,mouseY,24,25)
	  cursor(ARROW)
    } else {
      //(pointer_black,mouseX,mouseY,24,25)
	  cursor(HAND)
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

    
  /* [ all common attributes of a application object]
  x = x position of application icon 
  y = y position of application icon
  w = width of application window 
  h = height of application window
  win_x = x position of application window 
  win_y = y position of application window
  pic = icon picture  
  */
    
  constructor(x,y,pic,w,h,win_x, win_y){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.icon = loadImage(pic);
    this.win = createGraphics(w, h); // the window is made by using p5 createGraphics(); needs image() to display it 
    this.win_x = win_x;
    this.win_y = win_y;
    this.drag = false; //dragging flag
  }

  update(){ 
  
    // render icon and window of the application   
    image(this.icon, this.x, this.y, this.icon.width/7, this.icon.height/7 );
    image(this.win,this.win_x,this.win_y,this.w,this.h);
  }

  Windowclick() {
    // if the corresponding app window is clicked return true
    if ( 
     (mouseX <= (this.win_x + this.w)
     && mouseX >= this.win_x) 
     && (mouseY >= this.win_y)
     && (mouseY <= this.win_y + this.h)){
       return true
    }
    return false;
  }


}

// INCOMPLETE====
class Textdata {
// the text editor 
  constructor(){
    this.x = mail.win_x;
    this.y = mail.win_y; 
    this.width = mail.w; 
    this.height = mail.h; 
    this.data = [];

    this.pointer = {
                    "x":mail.win_x + 7, 
                    "y":mail.win_y + 13,
                    "w":2,
                    "h":13
                    }; 
    
    this.state = "on";
    this.counter = 0;
    this.blink = "on";
    console.log(this.pointer["x"])
    console.log(mail.win_x)
  }

  makegrid(){
    for ( var i = 0; i <100; i++ ){
      this.data.push('');   
    }
    console.log(this.data); 
   }

  pointer_update(){
    this.pointer["x"] = mail.win_x;
    this.pointer["y"] = mail.win_y;
  }

  display(){
    
    // fill black for the text
    fill(0);
    text(this.data.join(""), mail.win_x + 10, mail.win_y + 10, mail.w, mail.y);


    // turn on blinking pointer
    if (this.blink ==="on"){
      fill(0,0,0,255)
      rect(this.pointer["x"], this.pointer["y"], this.pointer["w"], this.pointer["h"]);
      this.counter += 1;
      if(this.counter>= 50){
        this.blink = "off";
      }
    }

    //turn off blinking pointer
    else if (this.blink === "off" ){
      noStroke();
      fill(200);
      rect(this.pointer["x"], this.pointer["y"], this.pointer["w"], this.pointer["h"]);
      this.counter -=1;
      if (this.counter <= 0){
        this.blink = "on";
      }

    }
    //remove all fill effect 
    fill(255,255,255);
  }

}
// textarea class incomplete====

//P5 event function
function keyPressed(){
  /*used to handle special keypresses like backspace */
    
  //[BackSpace] keycode is 8
  if (keyCode === 8 && textarea.state ==="on"){
      textarea.data.pop();
      textarea.pointer["x"] -= textWidth(textarea.data[textarea.data.length -1]);

  }
}

//P5 event function
function keyTyped(){
  /*used to handle regular ascii keypress. 
    - it ignores backspace,shifts,CRTL,ALT
  */

  
  //incomplete=========================
  switch(textarea.state){
    case "off":
      break;
      
    case "on":
      textarea.data.push(key);
      if (textarea.pointer["x"] > 500){
        textarea.pointer["x"] = mail.win_x + 7;
        textarea.pointer["y"] += 13;
      }
      textarea.pointer["x"] += textWidth(key)
      
      break;
  }
//incomplete===========================
    
}

//P5 event function
function mousePressed (){
  
  //when the mail app_window is clicked 
  if(mail.Windowclick()) {
    mail.drag = true; 
    
    //offsets are global vars ( make it a application attribute?)
    x_offset = mail.win_x - mouseX;
    y_offset = mail.win_y - mouseY;
  }
}

//P5 event function
function mouseDragged() {
    
  //while dragging mail app_window
  if (mail.drag == true){
  console.log(x_offset)
  mail.win_x = mouseX + x_offset;
  mail.win_y = mouseY +y_offset;
  }
}

//P5 event function
function mouseReleased(){
  //turn drag status off    
  mail.drag = false;
}

//P5 event function
function doubleClicked(){
  console.log("mail icon (w,h):", mail.icon.width, mail.icon.height);

  console.log(mail.x, mail.y);


  //if mail app got double clicked 
  if ( 
     (mouseX <= (mail.x + mail.icon.width/7)
     && mouseX >= mail.x) 
     && (mouseY >= mail.y 
     && (mouseY <= mail.y +mail.icon.height/7))){

      // code here
      console.log("Im currently clicking the interent explore icon");
      
  }
}