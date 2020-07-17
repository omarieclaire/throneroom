let tiles = {};
let numberofTiles = 150
let numberOfRows = 10;
let rowCounter = 0;
let xVal = 0;
let yVal = 0;
let tileWidth = 70;
let tileHeight = 40;
let tileSpacer = 5;
let ySpacer = tileHeight + tileSpacer;
let xSpacer = tileWidth + tileSpacer;

for (var i = 0; i < numberofTiles; i++) {
   tiles[i] = {}; // make each empty "tile object"
   tiles[i].tile = i; // set tileID to tile #
   tiles[i].writing = ""; // set writing
   tiles[i].drawing = []; // set writing
   tiles[i].taken = false; // Set 'taken': false to every tile.
   tiles[i].firebaseKey = null; // Set 'taken': false to every tile.
   tiles[i].width = tileWidth; // set width
   tiles[i].height = tileHeight; // set height
   tiles[i].position = {}; // Set x
   tiles[i].position.x = xVal; // Set x
   tiles[i].position.y = yVal; // Set y

   yVal += ySpacer; // increment y val
   if (rowCounter == numberOfRows) { // if we have drawn all the rows
     rowCounter = 0; // reset rowcounter
     yVal = 0; // set y to 0
     xVal += xSpacer; // increment x val
   }
   rowCounter++; // increment rowCounter

}

// for (const tileId in tiles) {
//   tiles[tileId].tile = tileId; // set tileID to tile #
//   tiles[tileId].writing = ""; // set writing
//   tiles[tileId].drawing = []; // set writing
//   tiles[tileId].taken = false; // Set 'taken': false to every tile.
//   tiles[tileId].firebaseKey = null; // Set 'taken': false to every tile.
//   tiles[tileId].width = tileWidth; // set width
//   tiles[tileId].height = tileHeight; // set height
//
//   tiles[tileId].position.x = xVal; // Set x
//   tiles[tileId].position.y = yVal; // Set y
//
//   yVal += ySpacer; // increment y val
//   if (rowCounter == numberOfRows) { // if we have drawn all the rows
//     rowCounter = 0; // reset rowcounter
//     yVal = 0; // set y to 0
//     xVal += xSpacer; // increment x val
//   }
//   rowCounter++; // increment rowCounter
// }


// Come to the imaginary bathroom for graffiti, letting go, reaching out, and moving on.
// toilet thoughts
// go to your bathroom to establish a psychic link to this imaginary public bathroom
// bathrooms are intimate spaces, special spaces, complicated spaces
// sometimes the bathroom is the only place you can go to be alone
// In bathrooms, people urinate, deficate, vomit, clean our bodies, put on makeup, use drugs, gossip, cry, masterbate.
// Bathroom walls used to be one of the few places you could write to people anonomously.

// TODO

// TEXT
// make drawing scale factor work - should be related to canvas width?
// image with transparent bg?
// drawing tools - random color (from list) and random font (+ font angle)

// make an animation on click
// integrate a "timer"
// debug "taken"
// keyboard focus for mobile?
// draw tiles with code

// integrate second scene - timer makes button appear "go to sink"
// integrate third scene - timer makes coundown appear
// click on toilet paper for special tile with flush button - flush sound when done and animation
// make sound effects - open tile, close tile, isdrawing
// make fonts and integrate fonts and text angle

//  integrate handwashing
//  link to other video call - show off your makeup
// more tiles? mathmatically place them?
// add thematic colours to painting?
// make a lineup for the bathroom
// make a final / close screen
// click on words in text to go to other words in text?

// THINKING
// how to handle clicks??? IF mouse on tile & canvas open -> save drawing, IF mouse on tile and canvas closed -> open canvas, ELSE if canvas open & mouse on canvas -> draw, ELSE if mouse on clickable object -> sound and animate
// if anyone wants me to read the tiles to them, I will!
