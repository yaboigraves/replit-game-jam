
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
  //mail.win.background(200);
  
  thebank = new Bank(10,10,"bank-logo.png",350,400,150,50);
  
  thebank.transfer('hiimdad@hotmail.com',100);
    
    
  textarea = new Textdata();
  // textarea.makegrid();

}

function draw(){
  noCursor()
  background(100)
  image(bg,0,0,windowWidth,windowHeight)
  
  //draw idons
  mail.drawIcon();
  thebank.drawIcon();
  
  //draw windows
  mail.drawWindow();
  textarea.display();
  
  thebank.drawWindow();
    
    
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
	this.opened = true;//open/close flag
  }

  drawIcon() {
	image(this.icon, this.x, this.y, this.icon.width/7, this.icon.height/7 );
  }
	
  drawWindow() { //just some placeholder draws to test out blank windows
	if (this.opened == true) {
		var font = 'arial';
		var strokecolor = 50;
		var bgcolor = 'grey';
		var apptitle = 'Placeholder';
		
		this.win.textFont(font)
		
		//Background and Outline Rect (DRAW FIRST)
		this.win.stroke(strokecolor);
		this.win.strokeWeight(1);
		this.win.rectMode(CORNER);
		this.win.fill(bgcolor);
		this.win.rect(0,0,this.w-1,this.h-1);
		
		//Top Bar of Program
		this.win.strokeWeight(2);
		this.win.rect(5,5,(this.w - 10),30);
		
		this.win.strokeWeight(4);
		this.win.fill(255);
		this.win.textSize(20);
		this.win.textAlign(LEFT);
		this.win.text(apptitle,10,29);
		
		//Minimize/Exit button
		this.win.strokeWeight(2);
		this.win.fill('lightcoral');
		this.win.rect(this.w-35,5,30,30);
		
		image(this.win,this.win_x,this.win_y,this.w,this.h);
	}
  }

  Windowclick() {
    // if the corresponding app window is clicked return true
	
    if (
     (mouseX <= this.win_x + this.w)
     && (mouseX >= this.win_x) 
     && (mouseY >= this.win_y)
     && (mouseY <= this.win_y + this.h)
	 && this.opened == true){
		 //Checks to see if it is close button which is being pressed
		 if (mouseX > (this.win_x + this.w-35) &&
			mouseX < (this.win_x + this.w - 5) &&
			mouseY > (this.win_y + 5) &&
			mouseY < (this.win_y + 35)){
				
				this.opened = false;
		}
		return true
    }
    return false;
  }


}

class Bank extends Application{
	constructor(x,y,pic,w,h,win_x, win_y){
		super(x,y,pic,w,h,win_x, win_y)
		
		//BANK SPECIFICS
		this.balance = 0;//Bank Balance
		this.senders = [];//Array of sender addresses
		this.transfers = []; //array of transfer amounts
	}
	
	transfer(address,amount) {
		this.senders.push(address)
		this.transfers.push(amount)
		this.balance = this.balance + amount
	} 
	
	drawIcon() {
		image(this.icon, this.x, this.y, this.icon.width/7, this.icon.height/7 );
	}
	
	drawWindow() {
		if (this.opened == true) {
		var font_word = 'arial';
		var font_num = 'monospace';
		var strokecolor = 50;
		var bgcolor = 'CornflowerBlue';
		var bgcolor_table = 200;
		var apptitle = 'United Bank Of Nigeria';
		
		this.win.textFont(font_word)
		
		//Background and Outline Rect (DRAW FIRST)
		this.win.stroke(strokecolor);
		this.win.strokeWeight(1);
		this.win.rectMode(CORNER);
		this.win.fill(bgcolor);
		this.win.rect(0,0,this.w-1,this.h-1);
		
		//Top Bar of Program
		this.win.strokeWeight(2);
		this.win.rect(5,5,(this.w - 10),30);
		
		this.win.strokeWeight(4);
		this.win.fill(255);
		this.win.textSize(20);
		this.win.textAlign(LEFT);
		this.win.text(apptitle,10,29);
		
		//Minimize/Exit button
		this.win.strokeWeight(2);
		this.win.fill('lightcoral');
		this.win.rect(this.w-35,5,30,30);
		
		//Balance tracker
		this.win.strokeWeight(2);
		this.win.fill(bgcolor);
		this.win.rect(5,40,(this.w - 10),75);
		
		this.win.strokeWeight(0);
		this.win.fill(0);
		this.win.textSize(20);
		this.win.textAlign(LEFT);
		this.win.text('Your Balance:',10,65);
		
		this.win.strokeWeight(4);
		this.win.fill('springgreen');
		this.win.textSize(30);
		this.win.textAlign(RIGHT);
		this.win.textFont(font_num);
		this.win.text(String(this.balance)+' USD',this.w-10,110);
		this.win.textFont(font_word);
		
		//Recent transfers
		this.win.strokeWeight(2);
		this.win.fill(bgcolor);
		this.win.rect(5,120,(this.w - 10),30);
		
		this.win.strokeWeight(0);
		this.win.fill(0);
		this.win.textSize(20);
		this.win.textAlign(LEFT);
		this.win.text('Recent Transfers:',10,144);
		
		this.win.strokeWeight(2);
		this.win.fill(bgcolor_table);
		this.win.rect(5,150,(this.w - 10),245);
		
		this.win.line(Math.floor(this.w/1.5),150,Math.floor(this.w/1.5),395);
		this.win.line(5,200,this.w - 5,200);
		this.win.line(5,250,this.w - 5,250);
		this.win.line(5,300,this.w - 5,300);
		this.win.line(5,350,this.w - 5,350);
		
		this.win.fill(0);
		this.win.textSize(15);
		this.win.strokeWeight(0);
		
		
		for (var i=0; i < 4;i++){
			if (this.senders.length > i) {
				this.win.fill(0);
				this.win.textAlign(LEFT);
				this.win.text(this.senders[this.senders.length-(1+i)],10,190 + 50*i);
				this.win.textAlign(RIGHT);
				let amt = this.transfers[this.transfers.length-(1+i)];
				if (amt>0) {
					this.win.fill('DarkGreen');
					var amtStr = '+' + String(amt)+'.00';
				} else {
					this.win.fill('FireBrick');
					var amtStr = String(amt)+'.00';
				}
				this.win.textFont(font_num);
				this.win.text(amtStr,this.w-10,190 + 50*i);
				this.win.textFont(font_word);
			}
		}
		
		image(this.win,this.win_x,this.win_y,this.w,this.h);
		//this.balance = this.balance +1;
		//console.log(mouseX)
		}
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
    x_offset_m = mail.win_x - mouseX;
    y_offset_m = mail.win_y - mouseY;
  }
  
  if (thebank.Windowclick()) {
	thebank.drag = true; 
    
    //offsets are global vars ( make it a application attribute?)
    x_offset_b = thebank.win_x - mouseX;
    y_offset_b = thebank.win_y - mouseY;
  }
}

//P5 event function
function mouseDragged() {
    
  //while dragging mail app_window
  if (mail.drag == true){
  console.log(x_offset_m)
  mail.win_x = mouseX + x_offset_m;
  mail.win_y = mouseY +y_offset_m;
  }
  if (thebank.drag == true){
  console.log(x_offset_b)
  thebank.win_x = mouseX + x_offset_b;
  thebank.win_y = mouseY +y_offset_b;
  }
}

//P5 event function
function mouseReleased(){
  //turn drag status off    
  mail.drag = false;
  thebank.drag = false;
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