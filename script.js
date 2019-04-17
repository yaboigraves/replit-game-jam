var cnv;

var windowStack;
var mail;
var bank;
var note;

//images
var bg;


function preload(){
  bg = loadImage("Nigerian-flag.jpg")
}


function setup(){
  cnv = createCanvas(windowWidth,windowHeight)
  desktop = new Desktop();

  //mail application (x,y,"pic file name",width,height,window_x,window_y)
  mail = new Mail(windowWidth/2,windowHeight-40,"email.png",1100,500,0,0);
  bank = new Bank(windowWidth/4,windowHeight-40,"bank.png",350,400,0,0);
  mail.createButtons();
  bank.transfer('hiimdad@hotmail.com',100);//Test out a single transfer call, will remove later
  
  note = new Note(windowWidth/(4/3),windowHeight-40,"notes.png",400,500,0,0);
  
  windowStack = new WindowStack();//Create the windowStack
  
  //start game with note app open
  windowStack.push(note);
}

function draw(){
  noCursor()
  background(100)
  image(bg,0,0,windowWidth,windowHeight)
  
  //draw toolbar
  desktop.update()
  //draw icons
  bank.drawIcon();
  mail.drawIcon();
  note.drawIcon();
  
  //draw windows
  windowStack.drawWindows();

  // this line is used to update the position of the editor by redrawing it according to mail's app window x & y position
  mail.editor.position(mail.win_x+350, mail.win_y+50); 

  //only show text box if mail app is on top. 
  //Switch method to appInstack(mail) to show text box when mail app is opened at all.
  if (windowStack.getTopApp() == mail){
	  mail.editor.show();
  } else {
	  mail.editor.hide();
  }

  //draw mouse
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
				newstack.push(this.stack[i]);
			}
		}
		this.stack = newstack;
	}
	drawWindows(){
		//Draws windows for all apps currently in the stack
		//most-recently-pushed is drawn last, so it will be on top
		for (var i = 0; i < this.stack.length;i++) {
			this.stack[i].drawWindow();
		}
	}
	whichWindowClicked(){
		//returns the window that was just clicked
		//checks for clicks starting with top window
		//returns null if no window is clicked
		for (var i = 0; i < this.stack.length;i++) {
			var nextApp = this.stack[this.stack.length - (i+1)];
			if (nextApp.Windowclick()){
				return (nextApp);
			}
		}
		return null;
	}
	getTopApp () {
		return this.stack[this.stack.length -1];
	}
	appInStack(app){
		for (var i = 0; i < this.stack.length;i++) {
			if (this.stack[i] == app){
				return (true);
			}
		}
		return(false);
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
	let tb_height = 80
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
	this.iconsize = 70;
  }

  drawIcon() {
	image(this.icon, this.x-(this.iconsize/2), this.y-(this.iconsize/2), this.iconsize, this.iconsize );
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
		
	this.win.strokeWeight(0);
	this.win.fill(0);
	this.win.textSize(25);
	this.win.textAlign(LEFT);
	this.win.text(apptitle,10,29);
		
	//Minimize/Exit button
	this.win.strokeWeight(2);
	this.win.fill('lightcoral');
	this.win.rect(this.w-35,5,30,30);

    //draws the window 
	image(this.win,this.win_x,this.win_y,this.w,this.h);
  
    //draws email button area in mail application
    fill(255);
    rect(this.win_x+25,this.win_y+50,this.button_area["w"], this.button_area["h"], 20);

    //draws email buttons in mail application
    var button_position = {"x":this.win_x+35 , "y":this.win_y+60}; // this line is used to reset position var
    
    //loop thru all element in buttons array. The amount of button will depend of the emails we give it 
    this.buttons.forEach(element=>{
      
    if (element["status"] == "on" ){
        
        //button rect
        fill(200);
        strokeWeight(3);
        stroke('#7395AE'); 
        rect(button_position["x"], button_position["y"], this.button_area["w"]-20, this.button_area["h"]/5, 20);

        
        //button text
        fill(0);    
        strokeWeight(1);
        textSize(14);    
        text(element["email"], button_position["x"]+40, button_position["y"]+40, this.button_area["w"]-10, 30);
        
    }  
    else{
         
        fill(200);
        strokeWeight(2);
        stroke(0); 
        rect(button_position["x"], button_position["y"], this.button_area["w"]-20, this.button_area["h"]/5, 20);


        fill(0);    
        stroke(15);        
        strokeWeight(1);
        textSize(14);    
        text(element["email"], button_position["x"]+40, button_position["y"]+40, this.button_area["w"]-10, 30);
    }
      
      
    // update next button's position  
    button_position["y"] += this.button_area["h"]/5+10;
      
    });

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
	if (mouseX > (this.x-(this.iconsize/2)) &&
		mouseX < (this.x-(this.iconsize/2) + this.iconsize) &&
		mouseY > (this.y-(this.iconsize/2)) &&
		mouseY < (this.y-(this.iconsize/2) + this.iconsize)){
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
		
		this.win.strokeWeight(0);
		this.win.fill(0);
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

class Mail extends Application {
// the text editor 
    constructor(x,y,pic,w,h,win_x, win_y){
		super(x,y,pic,w,h,win_x, win_y);
        this.editor_x = this.win_x+350;
        this.editor_y = this.win_y+50;
        this.editor_w = 700; 
        this.editor_h = 400;
        this.editor = createElement('textarea');
        this.editor.position(this.editor_x,this.editor_y); //init. position
        this.editor.size(this.editor_w, this.editor_h); 
        this.editor.attribute("maxlength","1400");

        /* the buttons attribute will be a list of dicitionaries. 
          Each button will have the following attributes:
          - clicked states
          - email name
          - actual text associated to that email 
         */
        
        this.buttons = [];  
        this.button_area = {
          "w":300,
          "h":400
        };

        //a list to store all victim emails for the day
        this.contacts=["swagmaster212@hotmales.com","totallyyourgrandma@gmail.com"] ;

        
	}
    
    editorNotClicked(){
		if (windowStack.getTopApp() != mail){
			return true;
		}
		//fixed
        if ( //checks if the editor is clicked return FALSE ()
             ((mouseX <= (this.win_x+350) + this.editor_w)
             && (mouseX >= this.win_x+350))
             && ((mouseY >= this.win_y+50)
             && (mouseY <= (this.win_y+50) + this.editor_h))){
            console.log("text editor is clicked")
		        return false;
    }
    return true;
  }
    createButtons(){
      for (var i =0; i<this.contacts.length; i++){
        this.buttons.push({"state":"off", "email":this.contacts[i]}); 
      }
    console.log(this.buttons);
    }

    buttonclick(){
        
        
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
		
	this.win.strokeWeight(0);
	this.win.fill(0);
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
    console.log(windowClicked);

  if (windowClicked != null){
	//check to see if the close button was clicked
	console.log('Clicked:',windowClicked.constructor.name)
      
      if((windowClicked == Mail) && mail.buttonClicked()){
          
             
        }
      
      
	  if (windowClicked.Closeclick()){
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
	if (mail.Iconclick()){
		console.log('Clicked: Mail Icon');
		windowStack.push(mail);
	} else if (bank.Iconclick()){
		console.log('Clicked: Bank Icon')
		windowStack.push(bank)
	} else if (note.Iconclick()){
		console.log('Clicked: Note Icon')
		windowStack.push(note)
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