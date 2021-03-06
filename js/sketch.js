var song;
var volhistory = [];
var amp;
var fft;
var fft2;
var w;

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

// gui2 params
var pause = false;
var amplitude = false;
var FFTBars = false;
var radialBars = false;
var visuals = ['radialBars', 'FFTBars', 'amplitude'];
var music = ['rock', 'techno', 'hurricane', 'israel'];

// gui
var visible = true;
var gui, gui2;

// song manager
var previous;
var current;

function preload() {
    song1 = loadSound('files/ambient_rock.mp3');
    song2 = loadSound('files/techno.mp3');
    song3 = loadSound('files/hurricane.mp3');
    song4 = loadSound('files/israel.mp3');
    img = loadImage('files/logo.png');

    song = song1;
}

function toggleSong() {
    if(pause) {
        song.pause()
    }
    else if (!song.isPlaying()) {
        song.play();
        // amplitudeDisplay();
    }
}

function setup() {

    createCanvas(windowWidth, windowHeight);
    colorMode(HSB);
    getAudioContext().resume();

    // Calculate big radius
    bigRadius = height / 2.0;

    // Create Layout GUI
    gui = createGui('Background');
    gui.addGlobals('numShapes', 'bigRadius', 'shape', 'radius',
        'drawFill', 'fillColor', 'drawStroke', 'strokeColor', 'strokeWidth', 'backgroundColor');

    gui2 = createGui('Main display').setPosition(230, 20);
    gui2.addGlobals('music', 'visuals', 'pause');

    song.setVolume(0.1);
    song.playMode('untilDone');
    song.play();
    amp = new p5.Amplitude();
    fft = new p5.FFT(0.9, 64);
    fft2 = new p5.FFT(0.9, 256);

    w = width / 64;

    counter = 0;
    invert = false;

    previous = music;
}
  
function draw() {
    clear();
    current = music;

    if(current != previous) {
        switchSong();
    }

    toggleSong();
    handleCounter();

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

    let vol = amp.getLevel() * 100;
    let radiusMultiplier = map(vol, 0, 10, 1, 1.2);
    let angleAdder = map(counter % 500, 0, 500, 0, TWO_PI);

    for (var i = 0; i < numShapes; i++) {

        var angle = TWO_PI / numShapes * i + angleAdder;
        var x = width / 2 + cos(angle) * bigRadius * radiusMultiplier;
        var y = height / 2 + sin(angle) * bigRadius * radiusMultiplier;
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

    switch(visuals) {
        case 'amplitude':
            amplitudeDisplay();
            break;
        case 'FFTBars':
            fftLinearDisplay();
            break;
        case 'radialBars':
            fftRadialDisplay();
            break;
    }
    image(img, windowWidth - 250, 20);
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

function amplitudeDisplay() {
    var vol = amp.getLevel();
    volhistory.push(vol * 15);
    stroke(255);
    strokeWeight(1);
    noFill();
    beginShape();
    
    for(var i=0; i < volhistory.length; i++) {
        var y = map(volhistory[i], 0, 1, height, 0);
        vertex(i, y - windowHeight/2 + 250);
    }
    endShape();

    if(volhistory.length > width) {
        volhistory.splice(0,1);
    }
}

function fftLinearDisplay() {
    var spectrum = fft.analyze();
    noStroke();

    for (var i = 0; i < spectrum.length; i++) {
        var amp2 = spectrum[i];
        var y = map(amp2, 0, 256, height, 0);
        fill(i, 255, 255);
        rect(width / 2 + i * w, y, w - 2, height - y);
        rect(width / 2 - i * w, y, w - 2, height - y);
    }
}

function fftRadialDisplay() {
    var spectrum2 = fft2.analyze();
    noFill();
    noStroke();
    translate(width/2, height/2);
    for(var i=0; i < (spectrum2.length-70)/2; i++) {
        var angle = map(i, 0, (spectrum2.length-70)/2, 0, TWO_PI);
        var amp2 = spectrum2[i];
        var r = map(amp2, 0, 128, 250, 325);
        var x = r * cos(angle);
        var y = r * sin(angle);
    
        stroke(i, 255, 255);
        line(0, 0, x, y);
    }
    for(var i=(spectrum2.length-70)/2; i < (spectrum2.length-70); i++) {
        var angle = map(i, 0, (spectrum2.length-70)/2, 0, TWO_PI);
        var amp2 = spectrum2[i];
        var r = map(amp2, 0, 128, 150, 250);
        var x = r * cos(angle);
        var y = r * sin(angle);
    
        stroke(i, 255, 255);
        line(0, 0, x, y);
    }
    translate(-width / 2, -height / 2);
}

function handleCounter() {
    if (!invert) {
        counter++;
    }
    else {
        counter--;
    }

    if (counter > 500) {
        invert = true
    }
    else if (counter < 0) {
        invert = false;
    }
}

function switchSong() {
    song.pause();
    switch(current) {
        case 'rock':
            song = song1;
            break;
        case 'techno':
            song = song2;
            break;
        case 'hurricane':
            song = song3;
            break;
        case 'israel':
            song = song4;
            break;
    }
    song.setVolume(0.1);
    previous = music;
}

// function mousePressed() { getAudioContext().resume(); }