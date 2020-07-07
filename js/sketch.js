// http://patreon.com/codingtrain

// VARIABLE FOR THE DATABASE
var database;

// DRAWING (ARRAY OF POINTS)
var drawing = [];
var writing;

// CURRENT PATH  (ARRAY WHERE THE CURRENT DRAWING IS BEING STORED)
var currentPath = [];

// !ISDRAWING BY DEFAULT
var isDrawing = false;
var inDrawCanvas;
var drawCanvasToggle = false;

var tileId = 1;

// empty javascript object / map
var tileFirebaseMap = {};

var bg;

//SETUP
function setup() {
  // CREATE CANVAS
  bg = loadImage('img/toilet2.png');
  canvas = createCanvas(800, 517);
  // canvas = createCanvas(windowWidth, windowHeight);

  // WHEN THE MOUSE IS PRESSED, START COLLECTING X AND Y POINTS
  canvas.mousePressed(startPath);

  //SET THE PARENT OF THE CANVAS TO THE CANVAS CONTAINER...WHY?
  canvas.parent('canvascontainer');

  // WHEN THE MOUSE IS RELEASED, START COLLECTING X AND Y POINTS
  canvas.mouseReleased(endPath);

  // SET A "SAVEBUTTON" VAR TO THE THING THAT HAS THE ID OF SAVEBUTTON
  // var saveButton = select('#saveButton');
  //WHEN THE MOUSE PRESSES ON THE SAVEBUTTON RUN THE SAVE DRAWING FUNCTION
  // saveButton.mousePressed(saveDrawing);

  // var clearButton = select('#clearButton');
  // clearButton.mousePressed(clearDrawing);

  // saveButton = createButton('save');
  // saveButton.position(205, 205);
  // saveButton.size(60, 40);
  // saveButton.mousePressed(saveDrawing);

  // clearButton = createButton('clear');
  // clearButton.position(135, 205);
  // clearButton.size(60, 40);
  // clearButton.mousePressed(clearDrawing);


  toggleDrawCanvasButton = createButton('');
  toggleDrawCanvasButton.position(65, 250);
  toggleDrawCanvasButton.size(60, 40);
  toggleDrawCanvasButton.mousePressed(toggleDrawCanvas);

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

  // get URL params for permalink
  var params = getURLParams();
  // console.log(params);
  if (params.id) {
    showDrawing(params.id);
  }

  // GRAB THE DRAWINGS
  var ref = database.ref('drawings');
  //EVENT THAT WILL BE TRIGGERED ANYTIME ANYTHING IS CHANGED IN THE DATABASE
  // ERR DATA IN CASE THERE IS AN ERROR
  ref.on('value', gotData, errData);

  // tileFirebaseMap
  ref.once('value', buildMap, errData);
}

function startPath() {
  // SET ISDRAWING TO TRUE
  isDrawing = true;
  // RESET CURRENT PATH TO AN EMPTY OBJECT
  currentPath = [];
  // PUSH THE CURRENT PATH TO THE DRAWING OBJECT
  drawing.push(currentPath);
}

function endPath() {
  // SET ISDRAWING TO FALSE
  isDrawing = false;
}

function displayArt(){
  if(!drawCanvasToggle) {
    scale(0.2, 0.2);
  }
  // FOR EACH IN THE DRAWING OBJECT
  for (var i = 0; i < drawing.length; i++) {
    // GRAB THE NEXT LIST [{X:90,Y:80},{X:4,Y:5}] & SET IT TO "PATH"
    var path = drawing[i];
    // BEGIN DRAWING
    beginShape();
    // THEN FOR EACH in the PATH OBJECT
    for (var j = 0; j < path.length; j++) {
      // FOR EVERY SPOT IN THE PATH, CREATE A VERTEX & DRAW A LINE BETWEEN
      vertex(path[j].x, path[j].y);
    }
    // STOP DRAWING
    endShape();
  }
}

function toggleDrawCanvas() {
  if (drawCanvasToggle) {
    saveDrawing();
  }
  drawCanvasToggle = !drawCanvasToggle;
}

function inDrawCanvasCheck() {
  if (mouseX > 20 && mouseX < 420 && mouseY > 20 && mouseY < 220) {
    inDrawCanvas = true;
  } else {
    inDrawCanvas = false;
  }
}

function draw() {
  background(bg);

  if (drawCanvasToggle) {
    fill("white");
    stroke("black");
    strokeWeight(3);
    rect(20, 20, 400, 200);
  }


  if (drawCanvasToggle) {
    if (isDrawing) {
      inDrawCanvasCheck();
      if (inDrawCanvas) {
        // DRAW EACH POINT OF THE DRAWING
        var point = {
          x: mouseX,
          y: mouseY
        };
        // PUSH THAT POINT (AN X VALUE AND A Y VALUE) INTO THE ARRAY
        currentPath.push(point);
      }
    }
    // LINE STUFF
    stroke("black");
    strokeWeight(4);
    noFill();

    // scale(0.2);
  }
  displayArt();
}

// SAVE THE DRAWING
function saveDrawing() {
  if (drawing.length > 0) {
    // MAKE A NEW REFERENCE to the drawings database
    var ref = database.ref('drawings');
    // WE CAN ADD OTHER DATA!
    var data = {
      writing: 'writing',
      drawing: drawing,
      tile: tileId,
    };
    // 1. for the current tile (tileId = 1)
    //    do we have an firebase ID for it?
    // 2. if we have a firebase id, then we update
    // 3. if we do not have a firebase id, then we PUSH
    //    and update the tile-id-firebase-id map.
    if (tileId in tileFirebaseMap) {
      // tileId is in the map
      var firebaseKey = tileFirebaseMap[tileId];
      // update instead of push
    } else {
      // PUSH THE DATA TO THE REF THAT WE CREATED ABOVE
      var result = ref.push(data, dataSent);
      tileFirebaseMap[tileId] = result.key;
      console.log(result.key);
    }
    function dataSent(err, status) {
      console.log(status);
    }
    // draw it to the screen
    drawing = data.drawing;
  }
}

function buildMap(data) {
  // MAKE A DRAWINGS VAR AND STORE IN IT ALL THE ENTRIES IN THE DATABASE
  var drawings = data.val();
  var keys = Object.keys(drawings);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var tileId = drawings[key]["tile"];
    tileFirebaseMap[tileId] = key;
  }
}

//CALLBACK
function gotData(data) {
  // clear the listing
  // CREATE AN ELEMENTS VAR & SELECT ALL
  var elts = selectAll('.listing');
  // GO THROUGH EACH OF THEM
  for (var i = 0; i < elts.length; i++) {
    // REMOVE DOM ELEMENTS FROM THE PAGE
    elts[i].remove();
  }

  // GRAB ALL THE VALS FROM THE DATA(?) OBJECT
  var drawings = data.val();
  // GET ALL THE KEYS
  var keys = Object.keys(drawings);
  // ITERATE OVER ALL THE KEYS
  for (var i = 0; i < keys.length; i++) {
    // GRAB THE KEY
    var key = keys[i];
    // CREATE LI ELEMENT
    var li = createElement('li', '');
    // GIVE EVERY ONE OF THE ELEMENTS A CLASS OF LISTING
    li.class('listing');
    // CREATE A LINK ELEMENT WITH THE KEY IN IT
    //var ahref = createA('#', key);
    // CREATE AN EVENT CALLED SHOW DRAWING
    //ahref.mousePressed(showDrawing);
    var ahref = document.createElement('a');
    ahref.setAttribute('href', '#');
    ahref.addEventListener('click', showDrawing);
    ahref.innerHTML = key;

    ahref = new p5.Element(ahref);
    ahref.parent(li);

    // SET UP PERMALINK
    var perma = createA('?id=' + key, 'permalink');
    // PARENT IT TO THE LIST
    perma.parent(li);
    // STYLE ON THE PERMA
    perma.style('padding', '4px');
    // MAKE ITS PARENT THE DRAWING LIST
    li.parent('drawinglist');
  }
}

// IF THERE IS AN ERROR, SHOW ME IN THE CONSOLE
function errData(err) {
  console.log(err);
}

// function createShowDrawingFunction(key) {
//   return function() {
//     var ref = database.ref('drawings/' + key);
//     // PASS THE VALUE ONCE, ONEDRAWING FUNCT, AND CALLBACK FOR ERROR
//     ref.once('value', oneDrawing, errData);
//
//     // GETS DATA
//     function oneDrawing(data) {
//       // grab the current drawing from the database
//       var dbdrawing = data.val();
//       // console.log(data.val);
//       drawing = dbdrawing.drawing;
//     }
//   };
// }

// DISPLAY DRAWING - give it the key
function showDrawing(key) {
  console.log('the arguments');
  console.log(arguments);
  // REPURPOSING FUNCTION FOR TWO DIFFERENT USES?
  // if the "key" passed into showdrawing is a mouseevent
  if (key instanceof MouseEvent) {
    // set key to this.html?
    key = key.target.innerHTML;
    console.log('key html = ' + key);
  }
  // then....

  //  GRAB THE REF AND PASS DRAWINGS PLUS THE PATH AND WHATEVER KEY
  var ref = database.ref('drawings/' + key);
  // PASS THE VALUE ONCE, ONEDRAWING FUNCT, AND CALLBACK FOR ERROR
  ref.once('value', oneDrawing, errData);


  // GETS DATA
  function oneDrawing(data) {
    // grab the current drawing from the database
    var dbdrawing = data.val();
    console.log("dbdrawing " + JSON.stringify(dbdrawing));
    drawing = dbdrawing.drawing;
    // console.log("value of dbdrawing  " + Object.keys(dbdrawing));
  }
}

function clearDrawing() {
  drawing = [];
}
