var cnv;
//let desktop,mouse;

var windowStack;
var mail;
var bank;

//images
var bg;


function preload(){
  bg = loadImage("Nigerian-flag.jpg")
}


function setup(){
  cnv = createCanvas(windowWidth,windowHeight)
  desktop = new Desktop();

  //mail application (x,y,"pic file name",width,height,window_x,window_y)
  mail = new Mail(10,400,"ie-logo.png",500,500,50,50);
  
  
  bank = new Bank(10,10,"bank-logo.png",350,400,150,50);
  bank.transfer('hiimdad@hotmail.com',100);//Test out a single transfer call, will remove later
  
  windowStack = new WindowStack();//Create the windowStack

    

}

function draw(){
  noCursor()
  background(100)
  image(bg,0,0,windowWidth,windowHeight)
  
  //draw icons
  bank.drawIcon();
 
  mail.drawIcon();
  
  
  //draw windows
  windowStack.drawWindows();

  
  mail.editor.position(mail.win_x+200, mail.win_y+50); // this line is used to update the position of the editor 

  if(mail.editor_status == "off"){
    mail.editor.hide(); 
  }
  else if (mail.editor_status =="on"){
    mail.editor.show();
  }

  

    
  //misc 
  desktop.update()
  drawMouse()
}

class WindowStack{
	//Handles the ordering of windows in the desktop environment
	constructor(){
		this.stack = [];
	}
	push(app){
		//Removes other copies of an app from the stack, then pushes it to the top
		//(used when opening an app or bringing it to the front)
		this.remove(app);
		this.stack.push(app);
	}
	remove(app){
		//Removes all instances of an app from the stack (used when closing apps)
		var newstack = [];
		for (var i = 0; i < this.stack.length;i++) {
			if (this.stack[i] != app){
				newstack.push(this.stack[i])
			}
		}
		this.stack = newstack;
	}
	drawWindows(){
		//Draws windows for all apps currently in the stack
		//most-recently-pushed is drawn last, so it will be on top
		for (var i = 0; i < this.stack.length;i++) {
			this.stack[i].drawWindow()
		}
	}
	whichWindowClicked(){
		//returns the window that was just clicked
		//checks for clicks starting with top window
		//returns null if no window is clicked
		for (var i = 0; i < this.stack.length;i++) {
			var nextApp = this.stack[this.stack.length - (i+1)];
			if (nextApp.Windowclick()){
				return (nextApp)
			}
		}
		return null;
	}
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

 function drawMouse(){
	 //Handles drawing the mouse, including what it looks like
    if (mouseIsPressed == false){
	  cursor(ARROW)
    } else {
	  cursor(HAND)
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
  icon = icon picture  
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

  drawIcon() {
	image(this.icon, this.x, this.y, this.icon.width/7, this.icon.height/7 );
  }
	
  drawWindow() { //just some placeholder draws to test out blank windows
  
	//variables to change window appearance
	var font = 'arial';
	var strokecolor = 50;
	var bgcolor = 'grey';
	var apptitle = 'Mail';
		
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
		
	this.win.strokeWeight(1.2);
	this.win.fill(255);
	this.win.textSize(20);
	this.win.textAlign(LEFT);
	this.win.text(apptitle,10,29);
		
	//Minimize/Exit button
	this.win.strokeWeight(2);
	this.win.fill('lightcoral');
	this.win.rect(this.w-35,5,30,30);

    //draws the window  
	image(this.win,this.win_x,this.win_y,this.w,this.h);
  }

  Windowclick() {
    // if the corresponding app window is clicked return true
	
    if ( //checks if the windows is being pressed somewhere
     (mouseX <= this.win_x + this.w)
     && (mouseX >= this.win_x) 
     && (mouseY >= this.win_y)
     && (mouseY <= this.win_y + this.h)){
		return true;
    }
    return false;
  }
  
  Closeclick() {
	//Checks to see if it is the close button which is being pressed
	if (mouseX > (this.win_x + this.w-35) &&
		mouseX < (this.win_x + this.w - 5) &&
		mouseY > (this.win_y + 5) &&
		mouseY < (this.win_y + 35)){
        return true;
	}
	return false;
  }
  
  Iconclick() {
	////Checks to see if the desktop icon is being clicked
	if (mouseX > (this.x) &&
		mouseX < (this.x + this.icon.width/7) &&
		mouseY > (this.y) &&
		mouseY < (this.y + this.icon.height/7)){
			return true;
	}
	return false;
  }
}

class Bank extends Application{
	//Class for the Bank Account App
	constructor(x,y,pic,w,h,win_x, win_y){
		super(x,y,pic,w,h,win_x, win_y)
		
		//BANK SPECIFICS
		this.balance = 0;//Bank Balance
		this.senders = [];//Array of sender addresses
		this.transfers = []; //array of transfer amounts
	}
	
	transfer(address,amount) {
		//accepts a string for the address and a dollar amount
		this.senders.push(address)
		this.transfers.push(amount)
		this.balance = this.balance + amount
	} 
	
	drawIcon() {
		//draws the icon on the desktop]
		image(this.icon, this.x, this.y, this.icon.width/7, this.icon.height/7 );
	}
	
	drawWindow() {
		
		//variables to change window appearance
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
		
		this.win.strokeWeight(1.2);
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
		
		//Display list of recent transfers
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
	}
}
//

class Mail extends Application {
// the text editor 
    constructor(x,y,pic,w,h,win_x, win_y){
		super(x,y,pic,w,h,win_x, win_y);
        this.editor_x = this.win_x+100;
        this.editor_y = this.win_y+50;
        this.editor_w = this.w/2; 
        this.editor_h = this.h-100;
        this.editor_status = "off";
        this.editor = createElement('textarea');
        this.editor.position(this.editor_x,this.editor_y);
        this.editor.size(this.w/2, this.h-100);
        this.editor.attribute("maxlength","1400");
	}
    
    editorNotClicked(){
        if ( //checks if the editor is clicked return FALSE
             ((mouseX <= this.editor_x + this.editor_w)
             && (mouseX >= this.editor_x)) 
             && (mouseY >= this.editor_y)
             && (mouseY <= this.editor_y + this.editor_h)){

            console.log("text editor is clciked")
		        return false;
    }
    return true;
  }
    
    
}

class Note extends Application{
	constructor(x,y,pic,w,h,win_x, win_y){
		super(x,y,pic,w,h,win_x, win_y)
		
		//Note specifics
		this.message = 'Note to self: need to make lots of money today! Make sure to write good e-mails to get those gullible Americans to send you their money! Use the e-mail app to write e-mails. Use the bank app to track how much you have made!';
	}
	
	drawWindow() { //just some placeholder draws to test out blank windows
  
	//variables to change window appearance
	var font = 'arial';
	var font_notes = 'cursive';
	var strokecolor = 50;
	var bgcolor = 'khaki';
	var apptitle = 'Notes';
	var textsize_notes = 15;
		
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
	
	//text Space rect
	this.win.strokeWeight(2);
	this.win.fill(bgcolor);
	this.win.rect(5,40,(this.w - 10),(this.h-45));
	
	//Actual text
	this.win.strokeWeight(0)
	this.win.fill('black')
	this.win.textFont(font_notes)
	this.win.textAlign(LEFT);
	this.win.textSize(textsize_notes);
	this.win.text(this.message,20,50,(this.w - 20),(this.h-55));
		
	image(this.win,this.win_x,this.win_y,this.w,this.h);
	}
	
}


//P5 event function
function mousePressed (){
  //Checks to see which app is being pressed and returns that app
    
  var windowClicked = windowStack.whichWindowClicked();
  //Make sure some window is being returned

  if (windowClicked != null){
	//check to see if the close button was clicked
	console.log('Clicked:',windowClicked.constructor.name)
	  if (windowClicked.Closeclick()){
      //hide text
      if(windowClicked.constructor.name == "Mail"){
          mail.editor_status ="off";
      }
		  console.log('Closed')
		  windowStack.remove(windowClicked);

	// if any other area clicked
	  }else{
      if (mail.editorNotClicked()){
        windowStack.push(windowClicked);
        windowClicked.drag = true;
        x_offset = windowClicked.win_x - mouseX;
        y_offset = windowClicked.win_y - mouseY;
      }
      else{
        windowClicked.drag = false;
      }
	  } 

  }else{//If NO window is clicked
	//Check to see if any icons are being pressed
	if (mail.Iconclick()&&mail.editor_status=="off"){
		console.log('Clicked: Mail Icon');
		windowStack.push(mail);
    mail.editor_status="on";


	} else if (bank.Iconclick()){
		console.log('Clicked: Bank Icon')
		windowStack.push(bank)
	}
  }
}

//P5 event function
function mouseDragged() {
	// moves any windows wihch are currently being dragged
  for (var i = 0; i < windowStack.stack.length; i++){
	  if (windowStack.stack[i].drag == true){
		windowStack.stack[i].win_x = mouseX + x_offset;
		windowStack.stack[i].win_y = mouseY + y_offset;
	  }
  }
}

//P5 event function
function mouseReleased(){
  //turn drag status off for all active windows
  for (var i = 0; i < windowStack.stack.length; i++){
	windowStack.stack[i].drag = false;
	 }
}

//P5 event function
function doubleClicked(){
  //console.log("mail icon (w,h):", mail.icon.width, mail.icon.height);

  //console.log(mail.x, mail.y);


  //if mail app got double clicked 
  if ( 
     (mouseX <= (mail.x + mail.icon.width/7)
     && mouseX >= mail.x) 
     && (mouseY >= mail.y 
     && (mouseY <= mail.y +mail.icon.height/7))){

      // code here
      //console.log("Im currently clicking the interent explore icon");
      
  }
 
}