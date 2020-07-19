let database;
let scene = 'toilet';
let DBLUE = '#a5c7da';
let LBLUE = '#f0fafc';
let LPINK = '#fb9c96';
let DPINK = '#f1635a';
let PURPLE = '#b25dff';
let LYELLOW = '#ffd183';
let DYELLOW = '#ffa304';
let LPEACH = '#fedfcd';
let DPEACH = '#ffbe99';
let turnaround;
let currentDrawPath = [];
let tileId = 1;
let isDrawing = false;
let graffitiCanvasOpen = false;
let canvasToolsVisible = false;
let toolWidth;
let toolSpacer;
let graffitiCanvasW;
let graffitiCanvasH;
let graffitiCanvasX;
let graffitiCanvasY;
let largeImgHeight;
let smallImgHeight;
let SCALEFACTOR;
let currentTile;
let toiletImg1;
let toiletImg2;
let toiletPaperImg1;
let toiletPaperImg2;
let mirrorImg1;
let mirrorImg2;
let sinkImg1;
let sinkImg2;
let firaFont;
let tiles;

let toolButtons = {
  // write: {
  //   'x': graffitiCanvasX + graffitiCanvasW + toolSpacer,
  //   'y': graffitiCanvasY + (toolWidth * 2) + (toolSpacer * 2),
  //   'width': toolWidth,
  //   'height': toolWidth,
  //   'text': 'write',
  //   'select': false
  // },
  // draw: {
  //   'x': graffitiCanvasX + graffitiCanvasW + toolSpacer,
  //   'y': graffitiCanvasY + toolWidth + toolSpacer,
  //   'width': toolWidth,
  //   'height': toolWidth,
  //   'text': 'draw',
  //   'select': false
  // },
  // save: {
  //   'x': graffitiCanvasX + graffitiCanvasW + toolSpacer,
  //   'y': graffitiCanvasY + (toolWidth * 3) + (toolSpacer * 3),
  //   'width': toolWidth,
  //   'height': toolWidth,
  //   'text': 'save',
  //   'select': false
  // },
  clear: {
    'x': graffitiCanvasX + graffitiCanvasW + toolSpacer,
    'y': graffitiCanvasH + toolSpacer,
    'width': toolWidth,
    'height': toolWidth,
    'text': 'CLEAR',
    'select': false
  }
};

function dataSent(data, err) {}

function preload() {
  toiletImg1 = loadImage('img/toiletImgThin1.png');
  toiletImg2 = loadImage('img/toiletImgThin2.png');
  toiletPaperImg1 = loadImage('img/tpImg1.png');
  toiletPaperImg2 = loadImage('img/tpImg2.png');
  firaFont = loadFont('fonts/FiraSans-Book.otf');

  openTileSound = document.createElement('audio');
  if (openTileSound.canPlayType('audio/mpeg')) {
    openTileSound.setAttribute('src', 'audio/tileopen.mp3');
  }
}

function calculateCanvasWidth(userWindowWidth, userWindowHeight) { // for now does nothing
  return userWindowWidth;
}

function calculateCanvasHeight(userWindowWidth, userWindowHeight) { // for now does nothing
  return userWindowHeight;
}

function calculateGraffitiCanvasWidth(canvasWidth, canvasHeight) {
  return 0.8 * canvasWidth;
}

function calculateGraffitiCanvasHeight(canvasWidth, canvasHeight) {
  return 0.5 * canvasWidth;
}

function calculateGraffitiCanvasPositionX(canvasWidth, canvasHeight) {
  return canvasWidth / 8;
}

function calculateGraffitiCanvasPositionY(canvasWidth, canvasHeight) {
  return canvasHeight / 20;
}

function calculateScaleFactor(tileArea) {
  // equation of a line is: y = slope * x + intercept
  // for us, y = canvas height and x is scalefactor.
  // 38288.931216931225
  let slope = 50000;
  let intercept = -909.0822433862436;

  return (tileArea - intercept) / slope;
}

function scaleAllTheThings(userWindowWidth, userWindowHeight) {
  let canvasWidth = calculateCanvasWidth(userWindowWidth, userWindowHeight);
  let canvasHeight = calculateCanvasHeight(userWindowWidth, userWindowHeight);

  graffitiCanvasW = calculateGraffitiCanvasWidth(canvasWidth, canvasHeight);
  graffitiCanvasH = calculateGraffitiCanvasHeight(canvasWidth, canvasHeight);
  graffitiCanvasX = calculateGraffitiCanvasPositionX(canvasWidth, canvasHeight);
  graffitiCanvasY = calculateGraffitiCanvasPositionY(canvasWidth, canvasHeight);

  toiletImg1.resize(0, canvasHeight);
  toiletImg2.resize(0, canvasHeight);
  toiletPaperImg1.resize(0, canvasHeight/4.4);
  toiletPaperImg2.resize(0, canvasHeight/4.4);


  toolWidth = 50;
  toolSpacer = 5;
  //SCALEFACTOR = 0.085 //0.145;

  // wxh = 1108 x 454, scalefactor = 0.075
  // wxh =  565 x 351, scalefactor = 0.036

  // tile area = 1320.2311111111112, scale = 0.053
  // tile area =  458.7301587301587, scale = 0.0305

  // console.log(`canvasWidth = ${canvasWidth}\ncanvasHeight = ${canvasHeight}`);
  // console.log(`tileArea = ${tiles[0].width * tiles[0].height}`);
  //SCALEFACTOR = 0.0305;
  SCALEFACTOR = calculateScaleFactor(currentTile.width * currentTile.height);
}

function setup() {
  let canvasWidth = calculateCanvasWidth(window.innerWidth, window.innerHeight);
  let canvasHeight = calculateCanvasHeight(window.innerWidth, window.innerHeight);
  canvas = createCanvas(canvasWidth, canvasHeight);

  tiles = tileFactory(canvasWidth, canvasHeight);
  currentTile = tiles[0];

  scaleAllTheThings(canvasWidth, canvasHeight);

  canvas.mouseOver(hoverOnImg);
  textFont(firaFont, 40);

  function mouseClickFunctions() {
    detectMouseOnTool(); // detect mouse on graf canvas tool
    toggleGraffitiCanvas(); // open or close graf canvas
    startDrawPath(); // collect x and y points
  }

  canvas.mousePressed(mouseClickFunctions); // run the mouse functions
  canvas.touchStarted(startDrawPath); //
  canvas.parent('canvascontainer'); // parent the canvas to the canvas container
  canvas.mouseReleased(endDrawPath); // when mouse is releaed, stop collecting x and y points
  canvas.touchEnded(endDrawPath); // attach listener for

  // FIREBASE AUTH TODO: change
  var config = {
    apiKey: 'AIzaSyAkqkz-UZyRSv_1QgfMjUeqX8mjZfg0MJE',
    authDomain: 'throne-room-club.firebaseapp.com',
    databaseURL: 'https://throne-room-club.firebaseio.com',
    storageBucket: 'throne-room-club.appspot.com',
    messagingSenderId: '889776405480'
  };
  firebase.initializeApp(config);
  database = firebase.database();
  // var params = getURLParams(); // get URL params for permalink
  // if (params.id) {
  // showDrawing(params.id);
  // }
  var ref = database.ref('graffitiWall'); // get the graffitiWall
  ref.on('value', gotData, printErrors); // trigger this anytime anything is changed in the database (err is in case of error)
  ref.once('value', buildMap, printErrors); // buildMap at the start

  function handleKeyDown(event) {
    const key = event.key; // grab the key
    if (graffitiCanvasOpen) { // if graffiti draw canvas is open
      switch (key) {
        case 'Backspace': // IE/Edge specific value
          currentTile.writing = currentTile.writing.slice(0, -1);
          break;
        case 'Down': // IE/Edge specific value
        case 'ArrowDown':
          break;
        case 'Up': // IE/Edge specific value
        case 'ArrowUp':
          break;
        case 'Meta':
        case 'Alt':
        case 'Control':
        case 'CapsLock':
          break;
        case 'Tab':
          break;
        case 'Left': // IE/Edge specific value
        case 'ArrowLeft':
          break;
        case 'Right': // IE/Edge specific value
        case 'ArrowRight':
          break;
        case 'Enter':
          break;
        case 'Shift':
          break;
        case 'Esc': // IE/Edge specific value
        case 'Escape':
          break;

        default:
          currentTile.writing += event.key; // add to the text
          return; // quit when this doesn't handle the key event
      }
    }
  }
  document.addEventListener('keydown', handleKeyDown); // listen for keys being pressed

  noLoop();
}

function windowResized() {
  let canvasWidth = calculateCanvasWidth(window.innerWidth, window.innerHeight);
  let canvasHeight = calculateCanvasHeight(window.innerWidth, window.innerHeight);
  resizeCanvas(canvasWidth, canvasHeight);
  scaleAllTheThings();
}

function startDrawPath() {
  if (graffitiCanvasOpen) {
    // if (graffitiCanvasOpen && inGraffitiCanvasCheck()) -> inGraffitiCanvasCheck here breaks drawing on mobile - why?
    isDrawing = true; // set isdrawing to true
    currentDrawPath = []; // reset current path to an empty object
    currentTile['drawing'].push(currentDrawPath); // push the current path to the drawing object
    return false;

  }
}

function hoverOnImg() {
    // console.log("in fun");
    let imgX = window.innerWidth / 3.5;
    let imgY = 0;
    let imgW = 200;
    let imgH = 600;
    // if (mouseX < 200) {
    if (mouseX > imgX && mouseX < imgX + imgW && mouseY > imgY && mouseY < imgY + imgH) {
    image(toiletImg2, window.innerWidth/2 - toiletImg1.width/2, 0);
    } else {
    }
}



function endDrawPath() {
  isDrawing = false; // set isdrawing to false
}

function captureDrawing() {
  if (isDrawing) { // if person isdrawing
    if (inGraffitiCanvasCheck()) { // and person isdrawing in the canvas
      let point = { // grab the x and y of each point
        x: mouseX,
        y: mouseY
      };
      currentDrawPath.push(point); // push that x and y into the currentDrawPath array
    }
  }
}

function drawTile(tile) {
  push();
  strokeWeight(0);
  if (tile.taken) {
    fill(DPINK);
  } else if (tile.writing != '' || tile.drawing.length > 0) {
    fill(DPEACH);
  } else {
    fill(LPEACH);
  }
  rect(tile.position.x, tile.position.y, tile.width, tile.height);
  pop();
}

function drawTileDrawing(tile, scaleFactor, translateX, translateY) {
  push();
  scale(scaleFactor, scaleFactor);
  translate(translateX, translateY);
  stroke('black');
  noFill();
  strokeWeight(5);

  let drawing = tile['drawing'];
  for (let i = 0; i < drawing.length; i++) { // foreach path in the drawing
    let path = drawing[i]; // grab the next path
    if (typeof(path) !== 'undefined') {
      beginShape(); // draw
      for (let j = 0; j < path.length; j++) { // for each coordinate in the path
        vertex(path[j].x, path[j].y); // mark each vertex and draw a line between
      }
      endShape();
    }
  }
  pop();
}

function drawTileWriting(tile, scaleFactor, x, y, w, h) {
  push();
  noStroke();
  fill('black');
  textSize(43);
  scale(scaleFactor, scaleFactor);

  //experimenting with textToPoints to see if it's faster - it is!

  //if(tile.writingPoints) {
  //beginShape();
  //for(var i = 0 ; i < tile.writingPoints.length ; i++) {
  //let p = tile.writingPoints[i];
  //vertex(p.x, p.y);
  //}
  //endShape();
  //}

  text(tile['writing'], x, y, w, h);
  pop();
}

function highlightOpenTile(x, y, w, h) {
  noStroke();
  noFill();
  rect(x, y, w, h);
}

function graffitiTools() {
  let toolSpacer = 10;
  for (const tool in toolButtons) {
    let btn = toolButtons[tool]
    fill(LYELLOW);
    rect(btn.x, btn.y, btn.width, btn.height);
    fill('black');
    textAlign(CENTER, CENTER);
    textSize(12);
    // let earlyTime = (new Date()).getTime();
    text(btn.text, btn.x, btn.y, btn.width, btn.height);
    // let lateTime = (new Date()).getTime();
    // let diffTime = earlyTime - lateTime;
    // console.log(diffTime);
  }
}

function displayLargeTileGraffiti() {
  if (graffitiCanvasOpen) {
    let tile = tiles[currentTile.tile];
    drawTileDrawing(tile, 1.0, 0, 0); // draw it BIG
    drawTileWriting(tile, 1.0, graffitiCanvasX, graffitiCanvasY, graffitiCanvasW, graffitiCanvasH);
  }
}

function displaySmallTileGraffiti() {
  for (const tileId in tiles) {
    let tile = tiles[tileId];
    // why does this translate work?
    let drawtranslateX = tile.position.x / SCALEFACTOR - graffitiCanvasX;
    let drawtranslateY = tile.position.y / SCALEFACTOR - graffitiCanvasY;
    let writetranslateX = tile.position.x / SCALEFACTOR;
    let writetranslateY = tile.position.y / SCALEFACTOR;
    let translateWidth = tile.width / SCALEFACTOR;
    let translateHeight = tile.height / SCALEFACTOR;
    drawTile(tile); // draw the actual tile rect
    if (tile['writing'] !== []) { // if not empty
      drawTileDrawing(tile, SCALEFACTOR, drawtranslateX, drawtranslateY);
      drawTileWriting(tile, SCALEFACTOR, writetranslateX, writetranslateY, translateWidth, translateHeight);
    }
  }
}

function detectMouseOnTile() { // returns undefined when not clicking on a tile
  for (const tileId in tiles) { // for each tile
    let tile = tiles[tileId] // grab the ID
    if (mouseX > tile['position']['x'] && mouseX < tile['position']['x'] + tile['width'] && mouseY > tile['position']['y'] && mouseY < tile['position']['y'] + tile['height']) {
      return tiles[tileId]; // check if mouse is over it -> if yes, return that tile (can i just return tile?)
    }
  }
}

function saveTile(tile) {
  let id = tile['tile']; // grab the tile id
  if (tile['firebaseKey'] === null) { // CREATE a new entry in the database
    let ref = database.ref('graffitiWall'); // make a new reference to the graffitiWall database
    let result = ref.push(tile, dataSent); // push the data to the ref created above
    tiles[id]['firebaseKey'] = result.key;
  } else { // already exists in the database, so UPDATE the entry in the database
    let ref = database.ref('graffitiWall/' + tile['firebaseKey']);
    ref.update(tile);
  }
  redraw();
}

function openMobileKeyboard() {

}

function clearTile() {
  currentTile.drawing = [];
  currentTile.writing = '';
  // openMobileKeyboard();
}

function detectMouseOnTool() {
  for (const tool in toolButtons) {
    let btn = toolButtons[tool]
    if (mouseX > btn.x && mouseX < btn.x + btn.width && mouseY > btn.y && mouseY < btn.y + btn.height) {
      btn.select = true;
    } else {
      btn.select = false;
    }
  }
  if (toolButtons.clear.select) {
    clearTile();
    // return true;
  }
}

function toggleGraffitiCanvas() { // open and close canvas
  const previousCurrentTile = currentTile; // set opentile to the last value of currenttile ( this is whatever it was last time this ran)
  let tileClicked = detectMouseOnTile(); // grab mouse location (over which tile when clicking)

  // console.log(`currentTile is ${currentTile.tile}`);
  // console.log(`previousCurrentTile is ${previousCurrentTile.tile}`);
  // console.log(`tileClicked is ${tileClicked ? tileClicked.tile : "empty"}`);

  if (typeof(tileClicked) !== 'undefined') { // if the mouse is actually clicking on a tile
    if (graffitiCanvasOpen) { //  if canvas being closed
      if (inGraffitiCanvasCheck() == false) { // prevents accidental closing
        previousCurrentTile['taken'] = false; //  remove hold on previousCurrentTile
        saveTile(previousCurrentTile); // save the previousCurrentTile
        graffitiCanvasOpen = !graffitiCanvasOpen; // toggle canvas state
        noLoop(); // stop looping draw - for speed
      }

    } else { // if canvas is being opened
      // console.log(`previousCurrentTile is ${previousCurrentTile.tile}`);
      // console.log(`tileClicked is ${tileClicked.tile}`);
      loop(); // start looping draw
      currentTile = tileClicked // update 'current tile' to the tile that was clicked
      // console.log(`previousCurrentTile is ${previousCurrentTile.tile}`);
      // console.log(`tileClicked is ${tileClicked.tile}`);
      // openTileSound.play();

      if (currentTile.taken === false) { // if the tile is not currently taken
        currentTile['taken'] = true; // 'take' (reserve) the tile
        saveTile(currentTile);
      }
      graffitiCanvasOpen = !graffitiCanvasOpen; // toggle canvas
    }
  }
}

function inGraffitiCanvasCheck() { // check if in the drawcanvas
  if (mouseX > graffitiCanvasX && mouseX < graffitiCanvasX + graffitiCanvasW && mouseY > graffitiCanvasY && mouseY < graffitiCanvasY + graffitiCanvasH) {
    return true;
  } else {
    return false;
  }
}

function drawGraffitiCanvas() {
  push();
  stroke(DPEACH);
  strokeWeight(3);
  fill(LPEACH);
  rect(graffitiCanvasX, graffitiCanvasY, graffitiCanvasW, graffitiCanvasH);
  pop();
}

function leaveSceneTimer() {
  var timeoutID;
  timeoutID = window.setTimeout(leaveButton, 3 * 1000);

  function leaveButton() {
    stroke(DYELLOW);
    strokeWeight(7);
    let length = 200 * SCALEFACTOR
    let x1x2 = window.innerWidth/1.25;
    let y1 = window.innerWidth/2.4;
    let y2 = y1 + length * 2;
    let x3 = x1x2 + length * 2;
    let y3 = y1 + length;
    triangle(x1x2, y1, x1x2, y2, x3, y3)
  }
}


function toiletDraw() {
  // let frameStartTime = millis();
  background(LBLUE);
  displaySmallTileGraffiti(); // show all the small drawings/text
  image(toiletImg1, window.innerWidth/2 - toiletImg1.width/2, 0);

  image(toiletPaperImg1, window.innerWidth/1.5 - toiletPaperImg1.width/1.5, 240);

  if (graffitiCanvasOpen) { // if canvas is open
    highlightOpenTile(currentTile.position.x, currentTile.position.y, currentTile.width, currentTile.height);
    drawGraffitiCanvas();
    // graffitiTools();
    displayLargeTileGraffiti(); // show the open drawing/text
    captureDrawing(); // run the code to catch the drawing
  }
  // console.log('Amount of time to compute the frame:', millis() - frameStartTime);
  // console.log('Current frame rate:', frameRate());
  leaveSceneTimer();
}

function mirrorDraw() {
  // image(mirrorImg1, -15, 50);
}

function sinkDraw() {
  // image(toiletImg1, -15, 50);
}

function draw() {
  // translate(-width / 2, -height / 2, 0); // tried WEBGL to speed things up
  if (scene == 'toilet') {
    toiletDraw();
  } else if (scene == 'mirror') {
    mirrorDraw();
  } else if (scene == 'sink') {
    sinkDraw();
  } else if (scene == 'end') {
    endDraw();
  }
}

// integrate buildmap into tilemap
function buildMap(data) {
  let graffitiWall = data.val(); // grab all database entries
  let keys = graffitiWall ? Object.keys(graffitiWall) : []; // grab keys - if keys isn't empty
  for (let i = 0; i < keys.length; i++) { // for each key
    let key = keys[i]; // grab the key
    let tileId = graffitiWall[key]['tile']; // grab the tileID
    if (tileId !== currentTile.tile && typeof(tiles[tileId]) !== 'undefined') { // do the updates
      tiles[tileId]['firebaseKey'] = key;
      tiles[tileId]['drawing'] = graffitiWall[key]['drawing'] || [];
      tiles[tileId]['writing'] = graffitiWall[key]['writing'] || '';
      //let graffiti = graffitiWall[key];
      //let grafWriting = graffiti['writing'] || '';
      //tiles[tileId]['writingPoints'] = firaFont.textToPoints(grafWriting, graffiti.position.x, graffiti.position.y) || [];
      tiles[tileId]['taken'] = graffitiWall[key]['taken'] || false;
    }
  }
  redraw(); // redraw everytime there is an update in the database
}

//CALLBACK
function gotData(data) { // if anything changes in the database, update my tilemap
  buildMap(data);
}

function printErrors(err) { // show me the errors please!
  console.log(err);
}

window.addEventListener('beforeunload', function(event) {
  currentTile['taken'] = false;
  saveTile(currentTile);
});
