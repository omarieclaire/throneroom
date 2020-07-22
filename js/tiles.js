//////// BUGS ////////
// drawings aren't scaling on mobile :(
// tile font loading late
// after hitting clear, can't draw
// stop hardclick on mobile
// triangle click not working perfectly


//////// TODO ////////
 // figure out where to put - writingSound.play(); and pause
// make toilet paper tile - a off-white draw canvas that doesn't call save when closing, instead calls a sound and animation
// debug "width" and "height" - make global variables and use them everywhere?
// make "device orientation" function that impacts the placement of toolbuttons and the sceneSwitch arrow (center/bottom for mobile)
// integrate random fonts and random text angles into database
// keyboard focus for mobile?
// restrict text input to 143 characters
// after 26 characters without a space or linebreak, insert a space
// click anywhere BUT the opengraffitidrawcanvas to close the canvas
// select color palette for drawing
// timer should only start after you click
// improve images
// improve sounds
// improve functionality of lettersound

//////// IF TIME ////////
// water flowing image on click for sink scene
// make scale better
// CHOOSE sound or reading in lineup
// choose light or dark in lineup
// anything to say before you go? (text in last scene)
// make small images for mirror and sink scene

//////// LATER ////////
// refactor code so canvas is only the drawcanvas
// debug "taken"
// debug "clear"
// must be able to moderate database? do I moderate live?
// make database private
// hide js? or opposite?


// DREAMIN AROUND
// add alt text to the lineup: (why are you here anyway?)
// what does handdrawn mean, on a computer? (art, fonts, etc)
// chat window
// click on toilet paper for special tile with flush button - flush sound when done and animation
// should I draw *all present* mouse cursors? so you can *feel* connected to the others?
// click on words in text to go to other words in text?
// link to live makeup
// handwashing
// link to gossip call
// so you are crying in the bathroom zine


// THINKING
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
      tiles[i].drawing = []; // set drawing
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
