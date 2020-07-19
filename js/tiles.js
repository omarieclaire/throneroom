// how to make hover work? hover not recognized when not drawing.

// drawing tools - random color (from list) and random font (+ font angle)
// make an animation on hover
// integrate a "timer"
// keyboard focus for mobile?
// second scene - timer makes button appear "go to sink"
// third scene - timer makes coundown appear
// sound effects - open tile, close tile, isdrawing
// fonts and integrate fonts and text angle
// if canvas is bigger than X constrain it to a manageable size
// vertical vs horizontal logic for sceneSwitchArrow


// QUESTIONS
// can I do "responsive" with

// LATER
// debug "taken"
// debug "clear"
// must be able to moderate database? do I moderate live?


// MUST
// delete escape function
// make database private
// hide js? or opposite?


// DREAMIN AROUND
// chat window
// click on toilet paper for special tile with flush button - flush sound when done and animation
// should I draw *all present* mouse cursors? so you can *feel* connected to the others?
// click on words in text to go to other words in text?
// link to live makeup
// handwashing
// link to gossip call
// so you are crying in the bathroom zine
// lineup for the bathroom
// a final / close screen


// THINKING
// how to handle clicks??? IF mouse on tile & canvas open -> save drawing, IF mouse on tile and canvas closed -> open canvas, ELSE if canvas open & mouse on canvas -> draw, ELSE if mouse on clickable object -> sound and animate
// Come to the imaginary bathroom for graffiti, letting go, reaching out, and moving on.
// toilet thoughts
// go to your bathroom to establish a psychic link to this imaginary public bathroom
// bathrooms are intimate spaces, special spaces, complicated spaces
// sometimes the bathroom is the only place you can go to be alone
// In bathrooms, people urinate, deficate, vomit, clean our bodies, put on makeup, use drugs, gossip, cry, masterbate.
// Bathroom walls used to be one of the few places you could write to people anonomously.
// if anyone wants me to read the tiles to them, I will!
// thanks aaron, august, sukanya, julia

function tileFactory(canvasWidth, canvasHeight, existingTiles) {

  let numColumns;
  let numRows;
  let tileSpacer = 5;
  let numberOfTiles = 8 * 15; //120;

  if(canvasWidth <= canvasHeight) {
    // taller
    numColumns = 8;
    numRows = 15;

  } else {
    // wider
    numColumns = 15;
    numRows = 8;
  }

  let tileWidth = (canvasWidth - tileSpacer * numColumns) / numColumns;
  let tileHeight = 4 / 7 * tileWidth;

  // if we pass in existingTiles use that, otherwise use {}
  let tiles = existingTiles || {};

  let numberOfColumns = numRows;


  //let canvasWidthMinusSpaces = canvasWidth/1.5 - (numberOfColumns - 1) * tileSpacer;  // to get the height of the tile take the total canvas height and remove the spacers (for 10 tiles, there will be 9 spaces)
  //let tileWidth = canvasWidthMinusSpaces / numberOfColumns;   // now take the remaining canvas space after removing the spacers & divide that by the number of tiles in a row; that will be the tile height.
  //let tileHeight = 4/7 * tileWidth;   // to get the tileWidth - use the original tile ratio (70/40 or 7/4)

  let rowCounter = 0;
  let xVal = 0;
  let yVal = 0;
  let ySpacer = tileHeight + tileSpacer;
  let xSpacer = tileWidth + tileSpacer;

  for (var i = 0; i < numberOfTiles; i++) {
    rowCounter++; // increment rowCounter

    let tile = tiles[i];
    if(typeof(tile) === 'undefined') {
      // tile does not exist, so lets create a blank tile
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
    } else {
      // only update the x and y
      tile.position.x = xVal;
      tile.position.y = yVal;
    }

     yVal += ySpacer; // increment y val
     if (rowCounter === numberOfColumns) { // if we have drawn all the rows
       rowCounter = 0; // reset rowcounter
       yVal = 0; // set y to 0
       xVal += xSpacer; // increment x val
     }
  }
  return tiles;
}
