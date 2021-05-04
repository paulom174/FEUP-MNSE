// var mic;
var song;
var volhistory = [];

// gui params
var numShapes = 20;
var strokeWidth = 4;
var strokeColor = '#00ddff';
var backgroundColor = '#000000'
var fillColor = [180, 255, 255];
var drawStroke = true;
var drawFill = true;
var radius = 20;
var shape = ['circle', 'triangle', 'square', 'pentagon', 'star'];
var label = 'label';

// gui2 params
var lips = false;
var playSong = false;
var amplitudeBars = false;
var radialBars = false;

// gui
var visible = true;
var gui, gui2;

function preload() {
    song = loadSound('files/ambient_rock.mp3');
}

function toggleSong() {
    if(playSong) {

        song.play();
    }
    else {
        song.pause();
    }
}

function setup() {

    createCanvas(windowWidth, windowHeight);
    getAudioContext().resume();

    // Calculate big radius
    bigRadius = height / 2.0;

    // Create Layout GUI
    gui = createGui('Background');
    gui.addGlobals('numShapes', 'bigRadius', 'shape', 'label', 'radius',
        'drawFill', 'fillColor', 'drawStroke', 'backgroundColor', 'strokeColor', 'strokeWidth');

    gui2 = createGui('Main display').setPosition(230, 20);
    gui2.addGlobals('playSong', 'lips', 'amplitudeBars', 'radialBars');

    // // MIC INPUT
    // mic = new p5.AudioIn();
    // mic.start();

    song.setVolume(0.01);
    song.playMode('untilDone');
    // song.play();
    amp = new p5.Amplitude();



    // noLoop();
}
  
function draw() {
    clear();

    toggleSong();

    background(backgroundColor);

    // set fill style
    if (drawFill) {
        fill(fillColor);
    } else {
        noFill();
    }

    // set stroke style
    if (drawStroke) {
        stroke(strokeColor);
        strokeWeight(strokeWidth);
    } else {
        noStroke();
    }

    for (var i = 0; i < numShapes; i++) {

        var angle = TWO_PI / numShapes * i;
        var x = width / 2 + cos(angle) * bigRadius;
        var y = height / 2 + sin(angle) * bigRadius;
        var d = 2 * radius;

        // pick a shape
        switch (shape) {

            case 'circle':
                ellipse(x, y, d, d);
                break;

            case 'square':
                rectMode(CENTER);
                rect(x, y, d, d);
                break;

            case 'triangle':
                ngon(3, x, y, d);
                break;

            case 'pentagon':
                ngon(5, x, y, d);
                break;

            case 'star':
                star(6, x, y, d / sqrt(3), d);
                break;

        }
    }

    // user experience?
    // fill(255, 10);
    // circle(mouseX, mouseY, 50);

    // // MIC ELLIPSE
    // if(lips) {
    //     vol = mic.getLevel();
    //     ellipse(900,400, 200, vol*800);
    // }

    // AUDIO 
    // vol = amp.getLevel();
    // volhistory.push(vol*50);
    // stroke(255);
    // noFill();
    // beginShape();
    // for(let i=0; i < volhistory.length; i++) {
    //     var y = map(volhistory[i], 0, 1, height-100, 0);
    //     vertex(i, y);
    // }
    // endShape();

    // stroke(255, 0, 0);
    // line(volhistory.length, 0, volhistory.length, height);

    if(amplitudeBars) {
        var vol = amp.getLevel();
        volhistory.push(vol * 50);
        console.log(vol);
        stroke(255);
        noFill();
        beginShape();
        
        for(var i=0; i < volhistory.length; i++) {
            var y = map(volhistory[i], 0, 1, height, 0);
            vertex(i, y);
        }
        endShape();

        if(volhistory.length > width) {
            volhistory.splice(0,1);
        }
    }

}

// check for keyboard events
function keyPressed() {
    switch (key) {
        // type [F1] to hide / show the GUI
        case 'p':
            visible = !visible;
            if (visible) {
                gui.show();
                gui2.show();
            } else {
                gui.hide();
                gui2.hide();
            } 
            break;
    }
}

// draw a regular n-gon with n sides
function ngon(n, x, y, d) {
    beginShape();
    for (var i = 0; i < n; i++) {
        var angle = TWO_PI / n * i;
        var px = x + sin(angle) * d / 2;
        var py = y - cos(angle) * d / 2;
        vertex(px, py);
    }
    endShape(CLOSE);
}


// draw a regular n-pointed star
function star(n, x, y, d1, d2) {
    beginShape();
    for (var i = 0; i < 2 * n; i++) {
        var d = (i % 2 === 1) ? d1 : d2;
        var angle = PI / n * i;
        var px = x + sin(angle) * d / 2;
        var py = y - cos(angle) * d / 2;
        vertex(px, py);
    }
    endShape(CLOSE);
}

// function mousePressed() { getAudioContext().resume(); }