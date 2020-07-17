let mywidth = window.innerWidth; // the p5 variables were throwing errors (why?) so i made my own
let myheight = window.innerHeight;
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
let toolWidth = 50;
let toolSpacer = 5;
let currentDrawPath = [];
let tileId = 1;
let isDrawing = false;
let graffitiCanvasOpen = false;
let graffitiCanvasW = mywidth/2;
let graffitiCanvasH = mywidth/3;
let graffitiCanvasX = mywidth/4;
let graffitiCanvasY = mywidth/20;
let canvasToolsVisible = false;
const SCALEFACTOR = 0.098 //0.145;
let currentTile = tiles[1];
let toiletImg1;
let toiletImg2;
let tpImg1;
let tpImg2;
let mirrorImg1;
let mirrorImg2;
let sinkImg1;
let sinkImg2;
let firaFont;

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
  toiletImg2 = loadImage('img/toiletImg2.png');
  tpImg1 = loadImage('img/tpImg1.png');
  tpImg2 = loadImage('img/tpImg2.png');
  firaFont = loadFont('fonts/FiraSans-Book.otf');

  openTileSound = document.createElement('audio');
  if (openTileSound.canPlayType('audio/mpeg')) {
    openTileSound.setAttribute('src', 'audio/tileopen.mp3');
  }
}

function setup() {
  canvas = createCanvas(mywidth, myheight);
  textFont(firaFont, 40);

  function mouseFunctions() {
    toggleGraffitiCanvas(); // open or close graf canvas
    startDrawPath(); // collect x and y points
    detectMouseOnTool(); // detect mouse on graf canvas tool
  }

  canvas.mousePressed(mouseFunctions); // run the mouse functions
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
  resizeCanvas(mywidth, myheight);
}

function startDrawPath() {
  if (graffitiCanvasOpen) {
  // if (graffitiCanvasOpen && inGraffitiCanvasCheck()) -> inGraffitiCanvasCheck here breaks drawing on mobile - why?
    isDrawing = true; // set isdrawing to true
    currentDrawPath = []; // reset current path to an empty object
    console.log(currentTile);
    currentTile['drawing'].push(currentDrawPath); // push the current path to the drawing object
    return false;

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

function openMobileKeyboard(){

}

function clearTile() {
  currentTile.drawing = [];
  currentTile.writing = '';
  openMobileKeyboard();
}

function detectMouseOnTool() {
  for (const tool in toolButtons) {
    let btn = toolButtons[tool]
    if (mouseX > btn.x && mouseX < btn.x + btn.width && mouseY > btn.y && mouseY < btn.y + btn.height) {
      console.log(`clicked on ${btn}`);
      btn.select = true;
    } else {
      btn.select = false;
    }
  }
  if (toolButtons.clear.select) {
    clearTile();
  }
}

function toggleGraffitiCanvas() { // open and close canvas
  const openedTile = currentTile; // grab the 'current tile'
  let tile = detectMouseOnTile(); // grab mouse location (over which tile?)
  if (typeof(tile) !== 'undefined') { // if the mouse is actually clicking on a tile
    if (graffitiCanvasOpen) { //  if canvas is open (is being closed)
      if (inGraffitiCanvasCheck() == false) { // if not in graf canvas - prevents accidental closing
        openedTile['taken'] = false; //  the opened tile should no longer be 'taken' (reserved)
        saveTile(openedTile); // save the opened tile
        graffitiCanvasOpen = !graffitiCanvasOpen; // toggle canvas
        noLoop();
      }
    } else { // if the canvas is closed (is being opened)
      loop();
      currentTile = tile // update 'current tile' to the tile that was clicked
      openTileSound.play();
      if (tile.taken === false) { // if the tile is not currently taken
        tile['taken'] = true; // 'take' (reserve) the tile
        saveTile(tile);
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

// was testing WEBGL for speed reasons but couldn't figure out clicking on draw3dTiles

// function draw3dTiles() {
//   let canvasTop = -windowHeight / 3.8;
//   let canvasLeft = -windowWidth / 3.5;
//   for (let i = 0; i < 10; i++) { // draw one column
//     push();
//     let y = canvasTop + (i * 25);
//     rotateY(.6);
//     translate(canvasLeft, y, 0); //x, y, z
//     plane(30, 20);
//     pop();
//     for (let u = 0; u < 5; u++) { // draw a row for each column
//       push();
//       let x = canvasLeft + (u * 35);
//       rotateY(.6);
//       translate(x, y, 0);
//       plane(30, 20);
//       pop();
//     }
//   }
// }

function draw3dTileRoom() {
  push();
  draw3dTiles();
  rotateY(PI / 1.6); // something funny here with the rotate adding together
  draw3dTiles();
  pop();
}

function drawGraffitiCanvas() {
  push();
  stroke(DPEACH);
  strokeWeight(3);
  fill(LPEACH);
  rect(graffitiCanvasX, graffitiCanvasY, graffitiCanvasW, graffitiCanvasH);
  pop();
}

function changeImage (){
  // let toiletImage = image(toiletImg2, mywidth/4, 0);
}


function toiletDraw() {
  let frameStartTime = millis();
  background(LBLUE);
  displaySmallTileGraffiti(); // show all the small drawings/text
  // draw3dTileRoom(); // Trying WEBGL for speed
  let toiletImage = image(toiletImg1, mywidth/4, 0);
  // toiletImage.mouseOver(changeImage);

  image(tpImg1, 670, 240);

  // tpImg.mouseover();


  if (graffitiCanvasOpen) { // if canvas is open
    highlightOpenTile(currentTile.position.x, currentTile.position.y, currentTile.width, currentTile.height);
    drawGraffitiCanvas();
    graffitiTools();
    displayLargeTileGraffiti(); // show the open drawing/text
    captureDrawing(); // run the code to catch the drawing
  }
  // console.log('Amount of time to compute the frame:', millis() - frameStartTime);
  // console.log('Current frame rate:', frameRate());
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
    if (tileId !== currentTile.tile) { // do the updates
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
function gotData(data) {   // if anything changes in the database, update my tilemap
  buildMap(data);
}

function printErrors(err) { // show me the errors please!
  console.log(err);
}

window.addEventListener('beforeunload', function(event) {
  currentTile['taken'] = false;
  saveTile(currentTile);
});
