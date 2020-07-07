var database;
var drawing = [];
var hardtileId = 1;
var currentTile = hardtileId;
var tiles = {
  1: {
    'writing': 'writing',
    'drawing': drawing,
    'tile': 1,
    'firebaseKey' : null,
    'width': 70,
    'height': 40,
    'position': {
      'x': 10,
      'y': 10
    }
  },
  2: {
    'writing': 'writing',
    'drawing': drawing,
    'tile': 2,
    'firebaseKey' : null,
    'width': 70,
    'height': 40,
    'position': {
      'x': 10,
      'y': 50
    }
  }
};
var writing;
var currentPath = []; // (ARRAY WHERE THE CURRENT DRAWING IS BEING STORED)
var isDrawing = false;
var drawCanvasToggle = false;
// var tileFirebaseMap = {}; // empty javascript object / map
var bg;

//SETUP
function setup() {
  // CREATE CANVAS
  bg = loadImage('img/toilet2.png');
  canvas = createCanvas(800, 517);
  // canvas = createCanvas(windowWidth, windowHeight);
  canvas.mousePressed(startPath); // when mouse is PRESSED, START COLLECTING X AND Y POINTS
  canvas.parent('canvascontainer'); //SET THE PARENT OF THE CANVAS TO THE CANVAS CONTAINER?
  canvas.mouseReleased(endPath); // WHEN THE MOUSE IS RELEASED, stop COLLECTING X AND Y POINTS

  // clearButton = createButton('clear');
  // clearButton.position(135, 205);
  // clearButton.size(60, 40);
  // clearButton.mousePressed(clearDrawing);

// for each tile
  for (const tileId in tiles) {
    tile = createButton(''); // make a button
    tile.position(tiles[tileId]['position']['x'], tiles[tileId]['position']['y']);
    tile.size(tiles[tileId]['width'], tiles[tileId]['height']);
    tile.mousePressed(toggleDrawCanvas); // when mouse is pressed on tile togl draw canvas
  }

  // FIREBASE AUTH STUFF
  var config = {
    apiKey: "AIzaSyAkqkz-UZyRSv_1QgfMjUeqX8mjZfg0MJE",
    authDomain: "throne-room-club.firebaseapp.com",
    databaseURL: "https://throne-room-club.firebaseio.com",
    storageBucket: "throne-room-club.appspot.com",
    messagingSenderId: "889776405480"
  };
  firebase.initializeApp(config);
  database = firebase.database();

  var params = getURLParams();  // get URL params for permalink
  if (params.id) {
    showDrawing(params.id);
  }

  // get THE DRAWINGS
  var ref = database.ref('drawings');
  ref.on('value', gotData, errData); //trigger this anytime anything is changed in the database (err is in case of error)
  ref.once('value', buildMap, errData);  // buildMap at start

}

function startPath() {
  isDrawing = true; //set isdrawing to true
  currentPath = []; // reset current path to an empty object
  tiles["1"]["drawing"].push(currentPath); // push the current path to the drawing object
}

function endPath() {
  isDrawing = false; // set isdrawing to false
}

function displayDrawing() {
  if (!drawCanvasToggle) {
    scale(0.2, 0.2);
  }
  for (var i = 0; i < tiles['1']['drawing'].length; i++) { // foreach path in the drawing
    var path = tiles["1"]["drawing"][i]; // grab the next path
    beginShape();
    for (var j = 0; j < path.length; j++) { // for each path
      vertex(path[j].x, path[j].y); // mark each vertex and draw a line between
    }
    endShape();
  }
}
function detectMouseLocation() {
  for (const tileId in tiles) { // for each tile, check if mouse is over it
    if (mouseX > tiles[tileId]['position']['x'] && mouseX < tiles[tileId]['position']['x'] + tiles[tileId]['width'] && mouseY > tiles[tileId]['position']['y'] && mouseY < tiles[tileId]['position']['y'] + tiles[tileId]['height']) {
      return tiles[tileId];
    }
  }
}
function toggleDrawCanvas() {
  var tileId = detectMouseLocation(); // grab mouse location (over which tile?)
  if (drawCanvasToggle) { // if drawcanvas is open
    saveDrawing(tileId); // save to specific tile
  } else { // if drawcanvas is closed
    currentTile = tileId //update currenttile
  }
  drawCanvasToggle = !drawCanvasToggle; // toggle canvas
}

function inDrawCanvasCheck() { // check if in the drawcanvas
  if (mouseX > 20 && mouseX < 420 && mouseY > 20 && mouseY < 220) {
    return true;
  } else {
    return false;
  }
}

function draw() {
  background(bg);

  if (drawCanvasToggle) { // if canvas is open
    fill("white");
    stroke("black");
    strokeWeight(3);
    rect(20, 20, 400, 200);
    if (isDrawing) {  // if person isdrawing
      if (inDrawCanvasCheck()) { // and person isdrawing in the canvas
        var point = { // grab the x and y of each point
          x: mouseX,
          y: mouseY
        };
        currentPath.push(point); // push that x and y into the currentpath array
      }
    }
    noFill(); // don't fill the draw stroke
  }
  displayDrawing(); // show the drawing
}

function saveDrawing(tile) {
  var id = tile["tile"]; // grab the tile id
  if (tiles[id]["drawing"].length > 0) { // if the drawing is not nothing
    var ref = database.ref('drawings'); // make a new reference to the drawings database
    var data = { // include
      writing: 'writing',
      drawing: drawing,
      tile: id,
    };

    if (tiles[id]['firebaseKey'] == null) {
      var result = ref.push(data, dataSent); // push the data to the ref we created above
      tiles[id]['firebaseKey'] = result.key;
    }
    function dataSent(err, status) {}
    tiles[id]["drawing"] = data.drawing; // draw to the screen
  }
}

// integrate buildmap into tilemap
function buildMap(data) {
  var drawings = data.val(); // grab all database entries
  var keys = drawings ? Object.keys(drawings) : []; // grab keys - if keys isn't empty
  for (var i = 0; i < keys.length; i++) {  // for each key
    var key = keys[i]; // grab the key
    var tileId = drawings[key]["tile"]; // grab the tileID
    tiles[tileId]["firebaseKey"] = key;
  }
}

//CALLBACK
function gotData(data) {
  // clear the listing?
  var elts = selectAll('.listing'); // grab all (all what?)
  for (var i = 0; i < elts.length; i++) { // foreach
    elts[i].remove(); // remove dom elements
  }

  var drawings = data.val(); // grab all drawings from firebase
  var keys = drawings ? Object.keys(drawings) : []; // if there are keys, grab them all
  for (var i = 0; i < keys.length; i++) { // foreach
    var key = keys[i]; // grab the key
    var li = createElement('li', ''); // create li element
    li.class('listing'); // give each the "listing" class
    var ahref = createA('#', key); // make a link element with the key in it
    // ahref.mousePressed(showDrawing); // CREATE AN EVENT CALLED SHOW DRAWING
    var ahref = document.createElement('a');
    ahref.setAttribute('href', '#');
    ahref.addEventListener('click', showDrawing);
    ahref.innerHTML = key;
    ahref = new p5.Element(ahref);
    ahref.parent(li);
    // var perma = createA('?id=' + key, 'permalink'); // set up permalink
    // perma.parent(li); // parent it to the list
    // perma.style('padding', '4px'); // style it
    li.parent('drawinglist'); // parent it to the drawing list
  }
}

function errData(err) { // show me the errors
  console.log(err);
}

function showDrawing(key) { //show drawing
  if (key instanceof MouseEvent) { // if the key passed into showdrawing is a mouseevent
    key = key.target.innerHTML; // set key to this.html?
  }
  var ref = database.ref('drawings/' + key); // grab the drawings and whatever key
  ref.once('value', oneDrawing, errData); //pass the value once and run oneDrawing

  function oneDrawing(data) {
    var dbdrawing = data.val(); // grab the current drawing from the database
    tiles["1"]["drawing"] = dbdrawing.drawing;
  }
}

function clearDrawing() {
  tiles["1"]["drawing"] = [];
}
