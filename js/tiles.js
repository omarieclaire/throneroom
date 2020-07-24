//////// Stuck ////////
// fix remaining arrows on other levels
// work on hover
// tiles not drawing in last scene
// how to integrate 'font' and (if time - random text angles) into database
// 'clear' should only clear unpushed updates - is this hard?
// command z removes last draw path
// if orientation=vertical > the sceneSwitch arrow is moved to the bottom center
// why is text top left when loading?
// only draw updates for a single tile
// remove canvas tools

////////// Not Code /////////
// select color palette for drawing
// improve images
// improve sounds
// choose main font - make fonts?
// water flowing image on click for sink scene
// make small images for mirror and sink scene

//////// If time ////////
// hover working
// debug "taken"
// improve functionality of lettersound
// keyboard focus for mobile?
// a - delete code saving to graffitiWall

////// If I Can Stop Time ////////
// choose sound or reading in lineup
// choose light or dark in lineup
// refactor code so canvas is only the drawcanvas
// resize bug: is it because height is changing and not width?: Uncaught DOMException: Failed to execute 'drawImage' on 'CanvasRenderingContext2D': The image argument is a canvas element with a width or height of 0.
// after 26 characters without a space or linebreak, insert a space


//////// BEFORE PUBLISHING ////////
// make the 'text' canvas tool invisible (also clear if clear still clears EVERYTHING)
// make database private
// hide js? or opposite?
// what do we do if firebase is full? 100 people? real line?

// DREAMIN AROUND
// add alt text to the lineup: (why are you here anyway?)
// what does handdrawn mean, on a computer? (art, fonts, etc)
// chat window
// ritual/request text appears and then fades at scene open
// anything to say before you go? (text in last scene)
// click on toilet paper for special tile with flush button - flush sound when done and animation
// should I draw *all present* mouse cursors? so you can *feel* connected to the others?
// click on words in text to go to other words in text?
// link to live makeup
// handwashing
// link to gossip call
// so you are crying in the bathroom zine

// what are you ready to flush away? see it in your mind and flush it away in our imaginary toilet
// what do you want to see when you look in the mirror? can you see it here, in our imaginary mirror?
// what do you want to do with your hands? can you gently, slowly, wash your hands here in our imaginary sink?



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
  // let numberOfTiles = 8 * 15; // 120, 240, 360, 480
  let numberOfTiles = 480;


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
    // if i is divisible by 120 (remainder is zero) reset rowCounter
    if(i % 120 == 0) {
      rowCounter = 0;
      xVal = 0;
      yVal = 0;
    }

    rowCounter++; // increment rowCounter

    let tile = tiles[i];
    if(typeof(tile) === 'undefined') {
      // tile does not exist, so lets create a blank tile
      tiles[i] = {}; // make each empty "tile object"
      tiles[i].tile = i; // set tileID to tile #
      tiles[i].writing = ""; // set writing
      tiles[i].drawing = []; // set drawing
      tiles[i].taken = false; // Set 'taken': false to every tile.
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
