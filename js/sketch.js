let database;
let currentColor = 'black';
let currentFont = 'acki';
let currentAngle = '-30';

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
let sceneSwitchArrowViz = false;
let turnaround;
let currentDrawPath = {
  path: [],
  color: 'black'
};
let tileId = 1;
let isDrawing = false;
let graffitiCanvasOpen = false;
let canvasToolsVisible = false;
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

let incon;

let acki;
let amali;
let candy;
let clemina;
let jsKang;
let reallyFree;
let syifana;
let tiles;
let triangleParams;
let eventBuffer = [];

let paintColors = [
  DBLUE,
  LBLUE,
  LPINK,
  DPINK,
  PURPLE,
  LYELLOW,
  DYELLOW,
  DPEACH
];

function createUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function(c) {
    return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  });
}
const SESSION_ID = createUUID();

function dataSent(data, err) {}

function preload() {
  toiletImg1 = loadImage('img/toiletImg1.png');
  toiletImg2 = loadImage('img/toiletImg2.png');
  toiletPaperImg1 = loadImage('img/tpImg1.png');
  toiletPaperImg2 = loadImage('img/tpImg2.png');
  mirrorImg1 = loadImage('img/mirrorImg1.png');
  mirrorImg2 = loadImage('img/mirrorImg2.png');
  sinkImg1 = loadImage('img/sinkImg1.png');
  sinkImg2 = loadImage('img/sinkImg2.png');

  incon = loadFont('fonts/Incon.ttf');
  acki = loadFont('fonts/Acki.ttf');
  amali = loadFont('fonts/Amali.ttf');
  candy = loadFont('fonts/Candy.ttf');
  clemina = loadFont('fonts/Clemina.otf');
  jsKang = loadFont('fonts/JsKang.ttf');
  reallyFree = loadFont('fonts/ReallyFree.ttf');
  syifana = loadFont('fonts/Syifana.ttf');

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
  let graffitiWidth = calculateGraffitiCanvasWidth(canvasWidth, canvasHeight);
  return 4 / 7 * graffitiWidth;
}

function calculateGraffitiCanvasPositionX(canvasWidth, canvasHeight, graffitiCanvasW) {
  return canvasWidth / 2 - graffitiCanvasW / 2;
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
  graffitiCanvasX = calculateGraffitiCanvasPositionX(canvasWidth, canvasHeight, graffitiCanvasW);
  graffitiCanvasY = calculateGraffitiCanvasPositionY(canvasWidth, canvasHeight);

  toiletImg1.resize(0, canvasHeight);
  toiletImg2.resize(0, canvasHeight);
  toiletPaperImg1.resize(0, canvasHeight / 4.4);
  toiletPaperImg2.resize(0, canvasHeight / 4.4);
  mirrorImg1.resize(0, canvasHeight);
  mirrorImg2.resize(0, canvasHeight);
  sinkImg1.resize(0, canvasHeight);
  sinkImg2.resize(0, canvasHeight);


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

function makeToolButtons(x, y, w, h) {
  let toolWidth = 50;
  let toolSpacer = 5;
  return {
    write: {
      'x': x + w + toolSpacer,
      'y': y,
      'width': toolWidth,
      'height': toolWidth,
      'text': 'write',
      'select': false
    },
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
      'x': x + w + toolSpacer,
      'y': y + toolWidth + toolSpacer,

      // 'y': h + toolSpacer,
      // 'x': window.innerWidth - toolWidth * 1.5,
      // 'y': toolWidth,
      'width': toolWidth,
      'height': toolWidth,
      'text': 'CLEAR',
      'select': false
    }
  };
}


function snapshotter() {
  window.setTimeout(function() {
    console.log('taking snapshot');
    takeSnapshot();
    snapshotter();
  }, 20000); // change this to be longer
}

function setup() {
  leaveSceneTimer(5000);

  input = createInput();
  input.position(-100, -100);

  let canvasWidth = calculateCanvasWidth(window.innerWidth, window.innerHeight);
  let canvasHeight = calculateCanvasHeight(window.innerWidth, window.innerHeight);
  canvas = createCanvas(canvasWidth, canvasHeight);

  tiles = tileFactory(canvasWidth, canvasHeight);
  currentTile = tiles[0];

  // 20 is the length of the triangle
  triangleParams = createTriangleParameters(20);

  scaleAllTheThings(canvasWidth, canvasHeight);

  canvas.mouseMoved(hoverOnImg);

  textFont(incon, 50);

  function mouseClickFunctions() {
    let itemClicked = whatWasClicked(); // all this does is determine what was clicked
    let clicked = itemClicked['clicked']; // grab clicked
    let item = itemClicked['item']; // grab item
    clickActions(clicked, item); // call func
    redraw(); //redraw after every click action
  }

  toolButtons = makeToolButtons(graffitiCanvasX, graffitiCanvasY, graffitiCanvasW, graffitiCanvasH);

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
  initializeFromSnapshot(firebase);

  function handleKeyDown(event) {
    const key = event.key; // grab the key
    if (graffitiCanvasOpen) { // if graffiti draw canvas is open
      switch (key) {
        case 'Backspace': // IE/Edge specific value
          currentTile.writing = currentTile.writing.slice(0, -1);
          let writingEvent = {
            tile: currentTile.tile,
            type: 'remove_character',
          };
          eventBuffer.push(writingEvent);
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
          let dbEvent = {
            type: 'add_character',
            tile: currentTile.tile,
            char: event.key
          };
          eventBuffer.push(dbEvent);
          return; // quit when this doesn't handle the key event
      }
    }
  }
  document.addEventListener('keydown', handleKeyDown); // listen for keys being pressed

  noLoop();
  snapshotter();
}

function windowResized() {
  let canvasWidth = calculateCanvasWidth(window.innerWidth, window.innerHeight);
  let canvasHeight = calculateCanvasHeight(window.innerWidth, window.innerHeight);
  console.log(`resize: w = ${canvasWidth}, h = ${canvasHeight}`);
  resizeCanvas(canvasWidth, canvasHeight);
  scaleAllTheThings();
}


function whatWasClicked() {
  let arrow = inSceneSwitchArrowCheck();
  if (arrow) {
    return {
      clicked: 'arrowClicked',
      item: undefined
    };
  }

  // is the canvas open? if so, check if we've clicked on either:
  // a. a tool, or
  // b. the canvas
  if (graffitiCanvasOpen) {
    let tool = detectMouseOnTool();
    if (typeof(tool) !== 'undefined') {
      return {
        clicked: 'toolClicked',
        item: tool
      };
    }

    let canvas = inGraffitiCanvasCheck();
    if (canvas) {
      return {
        clicked: 'canvasClicked',
        item: undefined // i have no idea
      };
    }
  }

  let tile = detectMouseOnTile(); // click on a tile?
  if (typeof(tile) !== 'undefined') { //clicked on a tile.
    return {
      clicked: 'tileClicked',
      item: tile // findme
    };
  }

  return {
    clicked: 'nothing',
    item: undefined
  };
}

function clickActions(wasClicked, item) {
  if (wasClicked == 'arrowClicked') {
    sceneSwitch();
  } else if (wasClicked == 'toolClicked') {
    handleToolClick(item);
  } else if (wasClicked == 'canvasClicked') {
    startDrawPath()
  } else if (wasClicked == 'tileClicked') {
    toggleGraffitiCanvas(item);
    startDrawPath();
  } else if (wasClicked == 'nothing') {
    // do nothing
  } else {
    // we should never end up here
    console.log(`ERROR: clickActions received item it cannot handle. wasClicked=${wasClicked} item=${item}`);
  }
}

function startDrawPath() {
  if (graffitiCanvasOpen) {
    // if (graffitiCanvasOpen && inGraffitiCanvasCheck()) -> inGraffitiCanvasCheck here breaks drawing on mobile - why?
    isDrawing = true; // set isdrawing to true
    currentDrawPath = {
      path: [], // reset current path to an empty
      color: currentColor
    };
    currentTile['drawing'].push(currentDrawPath); // push the current path to the drawing object
    return false;
  }
}

function endDrawPath() {

  isDrawing = false; // set isdrawing to false
  let event = {
    type: 'add_path',
    tile: currentTile.tile,
    path: currentDrawPath
  };
  eventBuffer.push(event);
}

function captureDrawing() {
  if (isDrawing) { // if person isdrawing
    if (inGraffitiCanvasCheck()) { // and person isdrawing in the canvas
      let point = { // grab the x and y of each point
        x: mouseX,
        y: mouseY
      };
      currentDrawPath.path.push(point); // push that x and y into the currentDrawPath array
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

function chooseColor() {
  // let currentColor;
  return random(paintColors);
}

function chooseFont() {
  let currentfont;
  fonts = [acki, amali, candy, clemina, jsKang, reallyFree, syifana];
  currentfont = random(fonts);
  return currentfont;
}

function chooseTextAngle() {
  let currentAngle;
  // angles = [];
  currentAngle = random(-233, 36);
  return currentAngle;
}

function drawTileDrawing(tile, scaleFactor, translateX, translateY) {
  push();
  scale(scaleFactor, scaleFactor);
  translate(translateX, translateY);
  noFill();
  strokeWeight(5);
  textFont(incon, 50);
  let drawing = tile['drawing'];
  for (let i = 0; i < drawing.length; i++) { // foreach path in the drawing
    let pathObject = drawing[i]; // grab the next path
    if (typeof(pathObject.path) !== 'undefined') {
      stroke(pathObject.color);
      beginShape(); // draw
      for (let j = 0; j < pathObject.path.length; j++) { // for each coordinate in the path
        vertex(pathObject.path[j].x, pathObject.path[j].y); // mark each vertex and draw a line between
      }
      endShape();
    }
  }
  pop();
}


function drawTileWriting(tile, scaleFactor, x, y, w, h) {
  push();
  noStroke();
  textFont(currentFont, 50);

  fill(currentColor);
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
  //rotate(0.5);
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
    let btn = toolButtons[tool];
    fill(DBLUE);
    // rect(10, 10, 100, 100);
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
    let tile = tiles[tileId]; // grab the ID
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
  if (eventBuffer.length > 0) {
    let newBuffer = collapseEventBuffer(eventBuffer);
    let ref = database.ref('log');
    // submit all the events in order
    let promise = ref.push(newBuffer[0]);
    let tail = newBuffer.slice(1);
    for (const i in tail) {
      promise = promise.then(function() {
        return ref.push(tail[i]);
      });
    }
  }
  redraw();
}

function hover(x, y, w, h, img2, img1) {
  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    image(img2, x, y);
  } else {
    image(img1, x, y);
  }
}

function hoverOnImg() {
  if (scene == 'toilet') {
    hover(window.innerWidth / 2 - toiletImg1.width / 2, 0, toiletImg1.width, toiletImg2.height, toiletImg2, toiletImg1); // toilet hover
    hover(window.innerWidth / 1.5, 240, toiletPaperImg1.width, toiletPaperImg1.height, toiletPaperImg2, toiletPaperImg1); // tp hover
  } else if (scene == 'mirror') {
    redraw();
    hover(window.innerWidth / 2 - mirrorImg1.width / 2, 0, mirrorImg1.width, mirrorImg2.height, mirrorImg2, mirrorImg1); // mirror hover

  } else if (scene == 'sink') {
    redraw();
    hover(window.innerWidth / 2 - sinkImg1.width / 2, 0, sinkImg1.width, sinkImg2.height, sinkImg2, sinkImg1); // sink hover
  }
}


function openMobileKeyboard() {
  //input();
}

function clearTile() {
  currentTile.drawing = {
    path: [],
    color: 'black'
  };
  currentTile.writing = '';
  openMobileKeyboard();
}

function handleToolClick(tool) {
  if (tool.text === 'write') {
    // TODO
  } else if (tool.text === 'CLEAR') {
    clearTile();

  } else {
    // do nothing
    console.log(`ERROR: handleToolClick received a text it could not handle: tool=${JSON.stringify(tool)}`);
  }
}


function detectMouseOnTool() {
  var buttonClicked;
  for (const tool in toolButtons) {
    let btn = toolButtons[tool];
    if (mouseX > btn.x && mouseX < btn.x + btn.width && mouseY > btn.y && mouseY < btn.y + btn.height) {
      btn.select = true;
      buttonClicked = btn;
    } else {
      btn.select = false;
    }
  }
  return buttonClicked;
}

function toggleGraffitiCanvas(tileClicked) { // open and close canvas
  const previousCurrentTile = currentTile; // set opentile to the last value of currenttile ( this is whatever it was last time this ran)
  if (graffitiCanvasOpen) { //  if canvas being closed
    if (inGraffitiCanvasCheck() == false) { // prevents accidental closing
      previousCurrentTile['taken'] = false; //  remove hold on previousCurrentTile
      saveTile(previousCurrentTile); // save the previousCurrentTile
      graffitiCanvasOpen = !graffitiCanvasOpen; // toggle canvas state
      noLoop(); // stop looping draw - for speed
    }
  } else { // if canvas is being opened
    currentColor = chooseColor();
    currentFont = chooseFont();
    currentAngle = chooseTextAngle();
    loop(); // start looping draw
    currentTile = tileClicked // update 'current tile' to the tile that was clicked
    // openTileSound.play();
    if (currentTile.taken === false) { // if the tile is not currently taken
      currentTile['taken'] = true; // 'take' (reserve) the tile
      saveTile(currentTile);
    }
    graffitiCanvasOpen = !graffitiCanvasOpen; // toggle canvas
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

function sceneSwitch() {
  if (scene == 'line') {
    scene = 'toilet';
  } else if (scene == 'toilet') {
    scene = 'mirror';
  } else if (scene == 'mirror') {
    scene = 'sink';
  } else if (scene == 'sink') {
    scene = 'end'
  }
}

function createTriangleParameters(length) {
  let y1 = window.innerHeight / 1.2;
  let y2 = y1 + length * 2;
  let x3 = window.innerWidth - length;
  let y3 = y1 + length;
  let x1 = x3 - length * 1.5;

  return {
    length: length,
    y1: y1,
    y2: y2,
    x3: x3,
    y3: y3,
    x1: x1,
    x2: x1
  };

}

function drawSceneSwitchArrow() {
  stroke(DYELLOW);
  strokeWeight(7);
  let params = triangleParams;
  triangle(params.x1, params.y1, params.x2, params.y2, params.x3, params.y3);
}

function redrawSceneSwitchArrow() {
  sceneSwitchArrowViz = true; // keep drawing the arrow
  redraw();
}

function leaveSceneTimer(waitTime) {
  window.setTimeout(redrawSceneSwitchArrow, waitTime); // change this to be longer
}

function inSceneSwitchArrowCheck() {
  // function inSceneSwitchArrowCheck(px, py, x1, y1, x2, y2, x3, y3) {
  let px = mouseX;
  let py = mouseY;
  //let {x1, y1, x2, y2, x3, y3} = triangleParams;
  let x1 = triangleParams.x1;
  let y1 = triangleParams.y1;
  let x2 = triangleParams.x2;
  let y2 = triangleParams.y2;
  let x3 = triangleParams.x3;
  let y3 = triangleParams.y2;

  var areaOrig = floor(abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)));
  var area1 = floor(abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py)));
  var area2 = floor(abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py)));
  var area3 = floor(abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py)));
  if (area1 + area2 + area3 <= areaOrig) {
    return true;
  } else {
    return false;
  }
}


function toiletDraw() {
  // let frameStartTime = millis();

  if (graffitiCanvasOpen) { // if canvas is open
    highlightOpenTile(currentTile.position.x, currentTile.position.y, currentTile.width, currentTile.height);
    drawGraffitiCanvas();
    graffitiTools();
    displayLargeTileGraffiti(); // show the open drawing/text
    captureDrawing(); // run the code to catch the drawing

  } else {

    background(LBLUE);
    displaySmallTileGraffiti(); // show all the small drawings/text
    image(toiletImg1, window.innerWidth / 2 - toiletImg1.width / 2, 0);
    image(toiletPaperImg1, window.innerWidth / 1.5, 240);

    if (sceneSwitchArrowViz == true) {
      drawSceneSwitchArrow();
    }

  }

  // console.log('Amount of time to compute the frame:', millis() - frameStartTime);
  // console.log('Current frame rate:', frameRate());
}

function mirrorDraw() {
  background(LBLUE);
  image(mirrorImg1, window.innerWidth / 2 - mirrorImg1.width / 2, 0);
}

function sinkDraw() {
  background(LBLUE);
  image(sinkImg1, window.innerWidth / 2 - sinkImg1.width / 2, 0);
}

function draw() {
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
function buildMap(graffitiWall) {
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
  buildMap(data.val());
}

// this function collapses consecutive "add_character"
// events and smash them into a single event.
// events into a single writing event
function collapseEventBuffer(buffer) {

  let msg = "";
  let newBuffer = [];

  for (let i in buffer) {
    let event = buffer[i];
    if (event.type === 'add_character') {
      msg += event.char;
    } else if (event.type === 'remove_character') {
      msg = msg.slice(0, -1);
    } else {
      newBuffer.push(event);
    }
  }

  if (msg.length > 0) {
    newBuffer.push({
      tile: buffer[0].tile,
      type: 'update_writing',
      writing: msg
    });
  }
  return newBuffer;
}

function takeSnapshot() {
  database.ref('log').push({
    type: 'snapshot',
    session: SESSION_ID
  });
}

function handleEvent(event, key) {
  if (event.type === 'add_path') {
    // assume .tile has id, and .stroke
    let tileId = event.tile;
    tiles[tileId].drawing.push(event.path);

  } else if (event.type === 'update_writing') {

    let tileId = event.tile;
    tiles[tileId].writing = event.writing;

  } else if (event.type === 'clear_tile') {

    // assume .tile has id
    let tileId = event.tile;
    tiles[tileId].drawing = {
      path: [],
      color: 'black'
    };
    tiles[tileId].writing = "";
    tiles[tileId].taken = false;

  } else if (event.type === 'snapshot') {
    // only take snapshots from your current session
    // otherwise skip the snapshot events
    if (event.session === SESSION_ID) {
      let ref = database.ref('snapshot');
      ref.push({
        tiles: tiles,
        key: key,
        session: SESSION_ID
      });
    }
  } else {
    console.log(`received event type we could not handle: ${event.type}`);
  }
  console.log('redraw');
  redraw();
}

function initializeFromSnapshot(firebase) {
  let database = firebase.database();
  let snapshotRef = database.ref('/snapshot').orderByKey().limitToLast(1);

  var now = performance.now();

  snapshotRef.once('value', function(snapshot) {
    let dbSnapshot = snapshot.val();

    if (dbSnapshot === null) {
      // no snapshots exist, start from beginning of log
      let ref =
        database
        .ref('/log')
        .orderByKey()

      return ref.on('child_added', function(data) {
        let event = data.val();
        let key = data.key;
        handleEvent(event, key);
      }, printErrors);
    } else {
      // snapshots exist, so start from the most
      // recent snapshot
      database
        .ref('/snapshot')
        .orderByKey()
        .limitToLast(1)
        .once('child_added', function(snap) {

          let snapshot = snap.val();

          let snapshotKey = snapshot.key;
          buildMap(snapshot.tiles);
          // new reference
          let ref =
            database
            .ref('/log')
            .orderByKey()
            .startAt(snapshotKey);

          return ref.on('child_added', function(data) {
            let event = data.val();

            let key = data.key;
            handleEvent(event, key);
          }, printErrors);
        }, printErrors);
    }
  });
}


function printErrors(err) { // show me the errors please!
  console.log(err);
}

window.addEventListener('beforeunload', function(event) {
  currentTile['taken'] = false;
  saveTile(currentTile);
});
