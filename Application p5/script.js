let noteC;
let noteA;
let noteB;


function preload() {
   noteC = loadSound("sonC.mp3");
   noteA = loadSound("sonA.mp3");
   noteB = loadSound("sonB.mp3");

}

function setup() {
  createCanvas(windowWidth,380);

  background(0);
 //cadre du canevas
  stroke(255);
  fill(0);
  rect(5,5,width-10,height-10);
 //cadre de la bobine
  stroke(0);
  fill(255);

  push();
  translate(10, height/4)
  rect(0,0,width-20,height/2);
  pop();
  // text d'information
  textSize(15);
  text('Master Media Design',10,20);
  text('Gabriel Abergel',width/2,20);
  text('2019',width-40,20);
  text('Fragment Sonore',10,height -10);
 
 
  noteA.setVolume(0.3);
  noteB.setVolume(0.1);
  noteC.setVolume(0.5);

}

function draw() {

 
// les lignes la partition
  stroke(30);
  line(10, height / 2 - 60, width - 10, height / 2 - 60 );
  line(10, height / 2 - 40, width - 10, height / 2 - 40 );
  line(10, height / 2 - 20, width- 10, height / 2 - 20);
  line(10, height / 2, width- 10, height / 2);
  line(10, height / 2 + 20, width- 10, height / 2 + 20);
  line(10, height / 2 + 40, width- 10, height / 2 + 40);
  line(10, height / 2 + 60, width- 10, height / 2 + 60);
}

function keyPressed() {

  // les notes de musique
  if (key == "q") {
    noteA.play();
	fill(0);
    ellipse((width / 2)/2, (height / 2) + 20, 20, 20);
  }

  if (key == "w") {
    noteB.play();
    fill(0);
    ellipse(width / 2, (height / 2) -20 , 20, 20);
  }

  if (key == "e") {
    noteC.play();
		fill(0);
    ellipse((width/2) + (width/4), height / 2, 20, 20);
  }

  if (key == "r") {
    noteC.play();
		fill(0);
    ellipse((width/2) + (width/3), height / 2, 20, 20);
  }
}