// var mic;
var song;
var button;
var volhistory = [];

function preload() {
    song = loadSound('files/ambient_rock.mp3');
}

function toggleSong() {
    if(song.isPlaying())
        song.pause();
    else
        song.play();
}

function setup() {

    createCanvas(1800, 850);
    button = createButton('toggle');
    button.mousePressed(toggleSong);

    // // MIC INPUT
    mic = new p5.AudioIn();
    mic.start();

    song.setVolume(0.01);
    song.play();
    amp = new p5.Amplitude();
}
  
function draw() {
    background(0);
    noStroke();
    fill(255, 100);


    // BACKGROUND
    for(let i=0; i < 1800; i=i+200) {
        for(let j=900; j > 0; j=j-150) {
            // // TRIANGLES
            triangle(i+50, j-50, i+30, j-20, i+70, j-20);
            triangle(i+20, j-40, i, j-20, i+40, j-20);

            // SQUARES
            // rect(i+70, j, 40);
            // rect(i+110, j+40, 20);

            // // ELLIPSES
            // ellipse(i+20, j-20, 45, 25);
            // ellipse(i+60, j-20, 45, 25);

        }
    }

    // user experience?
    // fill(255, 10);
    // circle(mouseX, mouseY, 50);

    var vol;

    fill(255);
    // MIC ELLIPSE
    vol = mic.getLevel();
    ellipse(900,400, 200, vol*800);

    // AUDIO 
    vol = amp.getLevel();
    volhistory.push(vol*50);
    stroke(255);
    noFill();
    beginShape();
    for(let i=0; i < volhistory.length; i++) {
        var y = map(volhistory[i], 0, 1, height-100, 0);
        vertex(i, y);
    }
    endShape();

    stroke(255, 0, 0);
    line(volhistory.length, 0, volhistory.length, height);
}

function mousePressed() { getAudioContext().resume(); }