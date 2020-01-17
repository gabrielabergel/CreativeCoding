var camera, vida;
let noteA;
let noteB;
let noteC;
let noteD;
let noteE;
let datablob;
let arrayOfMagnitude;
let arrayOfProfondeur;





/*
  We will use the sound in this example (so remember to add the p5.Sound
  library to your project if you want to recreate this). This array will be
  used to store oscillators.
*/
var synth = [];

function preload() {
  noteA = loadSound("sonA.mp3");
  noteB = loadSound("sonB.mp3");
  noteC = loadSound("sonC.mp3");
  noteD = loadSound("sonD.mp3");
  noteE = loadSound("sonE.mp3");
  datablob = loadTable("http://127.0.0.1:5500/seisme.tsv", "tsv", "header")
}

/*
  Here we are trying to get access to the camera.
*/
function initCaptureDevice() {
  try {
    camera = createCapture(VIDEO);
    camera.size(320, 240);
    camera.elt.setAttribute('playsinline', '');
    camera.hide();
    console.log(
      '[initCaptureDevice] capture ready. Resolution: ' +
      camera.width + ' ' + camera.height
    );
  } catch (_err) {
    console.log('[initCaptureDevice] capture error: ' + _err);
  }
}

function setup() {
  var canvas = createCanvas(640, 480);

  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('sketch-holder');
  // createCanvas(640, 480); // we need some space...
  initCaptureDevice(); // and access to the camera



  //** create table */
  // coll
  const tsv_column = datablob.columns
  
  const tableContainer = createDivForTalbe("container")

  const headerLIne = createDivForTalbe("line header-line")

  tableContainer.appendChild(headerLIne)

  for(const collumnName of tsv_column) {
    const collElement = createDivForTalbe("header-column column")
    collElement.innerText = collumnName

    headerLIne.append(collElement)
  }

  document.querySelector(".content").appendChild(tableContainer)

  for (const line of datablob.rows) {

    const bodyLIne = createDivForTalbe("line body-line")

    const bodyCollHeur = createDivForTalbe("body-column column")
    const bodyCollMagn = createDivForTalbe("body-column column")
    const bodyCollLoc = createDivForTalbe("body-column column")
    const bodyCollProf = createDivForTalbe("body-column column")
    const bodyCollLat = createDivForTalbe("body-column column")
    const bodyCollLong = createDivForTalbe("body-column column")

    bodyCollHeur.innerText  = line.obj["Heure locale"]
    bodyCollMagn.innerText  = line.obj["Magnitude"]
    bodyCollLoc.innerText   = line.obj["Localite"]
    bodyCollProf.innerText  = line.obj["Profondeur"]
    bodyCollLat.innerText   = line.obj["Latitude"]
    bodyCollLong.innerText  = line.obj["Longitude"]

    bodyLIne.appendChild(bodyCollHeur)
    bodyLIne.appendChild(bodyCollMagn)
    bodyLIne.appendChild(bodyCollLoc)
    bodyLIne.appendChild(bodyCollProf)
    bodyLIne.appendChild(bodyCollLat)
    bodyLIne.appendChild(bodyCollLong)

    tableContainer.appendChild(bodyLIne)

  }
  /*
    VIDA stuff. One parameter - the current sketch - should be passed to the
    class constructor (thanks to this you can use Vida e.g. in the instance
    mode).
  */
  vida = new Vida(this); // create the object
  /*
    Turn on the progressive background mode.
  */
  vida.progressiveBackgroundFlag = true;
  /*
    The value of the feedback for the procedure that calculates the background
    image in progressive mode. The value should be in the range from 0.0 to 1.0
    (float). Typical values of this variable are in the range between ~0.9 and
    ~0.98.
  */
  vida.imageFilterFeedback = 0.82;
  /*
    The value of the threshold for the procedure that calculates the threshold
    image. The value should be in the range from 0.0 to 1.0 (float).
  */
  vida.imageFilterThreshold = 0.15;
  /*
    You may need a horizontal image flip when working with the video camera.
    If you need a different kind of mirror, here are the possibilities:
      [your vida object].MIRROR_NONE
      [your vida object].MIRROR_VERTICAL
      [your vida object].MIRROR_HORIZONTAL
      [your vida object].MIRROR_BOTH
    The default value is MIRROR_NONE.
  */
  vida.mirror = vida.MIRROR_HORIZONTAL;
  /*
    In order for VIDA to handle active zones (it doesn't by default), we set
    this flag.
  */
  vida.handleActiveZonesFlag = true;
  /*
    If you want to change the default sensitivity of active zones, use this
    function. The value (floating point number in the range from 0.0 to 1.0)
    passed to the function determines the movement intensity threshold which
    must be exceeded to trigger the zone (so, higher the parameter value =
    lower the zone sensitivity).
  */
  vida.setActiveZonesNormFillThreshold(0.30);
  /*
    Let's create several active zones. VIDA uses normalized (in the range from
    0.0 to 1.0) instead of pixel-based. Thanks to this, the position and size
    of the zones are independent of any eventual changes in the captured image
    resolution.
  */
  var padding = 0.052; var n = 5;
  var zoneWidth = 0.06; var zoneHeight = 0.1;
  var hOffset = (1.0 - (n * zoneWidth + (n - 1) * padding)) / 3.4;
  var vOffset = 0.55;
  for (var i = 0; i < n; i++) {
    /*
      addActiveZone function (which, of course, adds active zones to the VIDA
      object) comes in two versions:
        [your vida object].addActiveZone(
          _id, // zone's identifier (integer or string)
          _normX, _normY, _normW, _normH, // normalized (!) rectangle
          _onChangeCallbackFunction // callback function (triggered on change)
        );
      and
        [your vida object].addActiveZone(
          _id, // zone's identifier (integer or string)
          _normX, _normY, _normW, _normH // normalized (!) rectangle
        );
      If we use the first version, we should define the function that will be
      called after the zone status changes. E.g.
        function onActiveZoneChange(_vidaActiveZone) {
          console.log(
            'zone: ' + _vidaActiveZone.id +
            ' status: ' + _vidaActiveZone.isMovementDetectedFlag
          );
        }
      Then the addActiveZone call can look like this:
        [your vida object].addActiveZone(
          'an_id', // id
          0.33, 0.33, 0.33, 0.33, // big square on the center of the image
          onActiveZoneChange // callback function
        );
      Note: It is also worth mentioning here that if you want, you can delete a
            zone (or zones) with a specific identifier (id) at any time. To do
            this, use the removeActiveZone function:
              [your vida object].removeActiveZone(id);
      But this time we just want to create our own function drawing the zones
      and we will check their statuses manually, so we can opt out of defining
      the callback function, and we will use the second, simpler version of the
      addActiveZone function.
    */
    vida.addActiveZone(
      i,
      hOffset + i * (zoneWidth + padding), vOffset, zoneWidth, zoneHeight,
    );

    //intensité du son
    noteA.setVolume(0.3);
    noteB.setVolume(0.3);
    noteC.setVolume(0.3);
    noteD.setVolume(0.3);
    noteE.setVolume(0.3);
    // noteB.setVolume(0.3);
    // noteC.setVolume(0.5);
    // noteD.setVolume(0.5);
    // noteE.setVolume(0.5);

    /*
      For each active zone, we will also create a separate oscillator that we
      will mute/unmute depending on the state of the zone. We use the standard
      features of the p5.Sound library here: the following code just creates an
      oscillator that generates a sinusoidal waveform and places the oscillator
      in the synth array.
    */
    // var osc = new p5.Oscillator();
    // osc.setType('sine');
    /*
      Let's assume that each subsequent oscillator will play 4 halftones higher
      than the previous one (from the musical point of view, it does not make
      much sense, but it will be enough for the purposes of this example). If
      you do not take care of the music and the calculations below seem unclear
      to you, you can ignore this part or access additional information , e.g.
      here: https://en.wikipedia.org/wiki/MIDI_tuning_standard
    */
    //   osc.freq(440.0 * Math.pow(2.0, (60 + (i * 4) - 69.0) / 12.0));
    //   osc.amp(0.0); osc.start();
    //  synth[i] = osc;
  }

  frameRate(30); // set framerate
}

function draw() {

  if (camera !== null && camera !== undefined) { // safety first
    background(255);
    /*
      Call VIDA update function, to which we pass the current video frame as a
      parameter. Usually this function is called in the draw loop (once per
      repetition).
    */
    vida.update(camera);
    /*
      Now we can display images: source video (mirrored) and subsequent stages
      of image transformations made by VIDA.
    */
    //image(vida.currentImage, 0, 240);
    image(vida.thresholdImage, 320, 240);
    // let's also describe the displayed images
    noStroke(); fill(255, 255, 255);
    // text('camera', 20, 260);
    // text('vida: threshold image', 340, 260);
    /*
      VIDA has two built-in versions of the function drawing active zones:
        [your vida object].drawActiveZones(x, y);
      and
        [your vida object].drawActiveZones(x, y, w, h);
      But we want to create our own drawing function, which at the same time
      will be used for the current handling of zones and reading their statuses
      (we must also remember about controlling the sound).
    */
    // defint size of the drawing
    var temp_drawing_w = width / 2; var temp_drawing_h = height / 2;
    // offset from the upper left corner
    var offset_x = 320; var offset_y = 240;
    // pixel-based zone's coords
    var temp_x, temp_y, temp_w, temp_h;
    push(); // store current drawing style and font
    translate(offset_x, offset_y); // translate coords
    // set text style and font
    textFont('Helvetica', 10); textAlign(LEFT, BOTTOM); textStyle(NORMAL);
    // let's iterate over all active zones
    for (var i = 0; i < vida.activeZones.length; i++) {

      // read and convert norm coords to pixel-based
      temp_x = Math.floor(vida.activeZones[i].normX * temp_drawing_w);
      temp_y = Math.floor(vida.activeZones[i].normY * temp_drawing_h);
      temp_w = Math.floor(vida.activeZones[i].normW * temp_drawing_w);
      temp_h = Math.floor(vida.activeZones[i].normH * temp_drawing_h);
      // draw zone rect (filled if movement detected)
      strokeWeight(1);
      if (vida.activeZones[i].isEnabledFlag) {
        stroke(255);
        if (vida.activeZones[i].isMovementDetectedFlag) fill(255);
        else noFill();
      }
      else {
        stroke(0);
        /*
          Theoretically, movement should not be detected within the excluded
          zone, but VIDA is still in the testing phase, so this line will be
          useful for testing purposes.
        */
        if (vida.activeZones[i].isMovementDetectedFlag) fill(0, 0, 255);
        else noFill();
      }
      rect(temp_x, temp_y, temp_w, temp_h);
      // print id
      noStroke();
      if (vida.activeZones[i].isEnabledFlag) fill(255);
      else fill(0);
      text(vida.activeZones[i].id, temp_x, temp_y - 1);
      /*
        Using the isChangedFlag flag is very important if we want to trigger an
        behavior only when the zone has changed status.
      */
      if (vida.activeZones[i].isChangedFlag) {
        // print zone id and status to console ... 
        console.log(
          'zone: ' + vida.activeZones[i].id +
          ' status: ' + vida.activeZones[i].isMovementDetectedFlag
        );
        //... and use this information to control the sound.
        // synth[vida.activeZones[i].id].amp(
        //   0.1 * vida.activeZones[i].isMovementDetectedFlag
        // );
        if (vida.activeZones[0].isMovementDetectedFlag) {

          if (noteA.isPlaying() === true && noteA.currentTime() > 1) {
            noteA.stop();
            noteA.play();
            console.log("%c========", 'color: red')
          } else if (noteA.isPlaying() === false) {
            console.log("%c========", 'color: green')
            noteA.play();
          }

        }

        if (vida.activeZones[1].isMovementDetectedFlag) {

          if (noteB.isPlaying() === true && noteB.currentTime() > 1) {
            noteB.stop();
            noteB.play();
            console.log("%c========", 'color: red')
          } else if (noteB.isPlaying() === false) {
            console.log("%c========", 'color: green')
            noteB.play();
          }

        }

        if (vida.activeZones[2].isMovementDetectedFlag) {

          if (noteC.isPlaying() === true && noteC.currentTime() > 1) {
            noteC.stop();
            noteC.play();
            console.log("%c========", 'color: red')
          } else if (noteC.isPlaying() === false) {
            console.log("%c========", 'color: green')
            noteC.play();
          }

        }

        if (vida.activeZones[3].isMovementDetectedFlag) {

          if (noteD.isPlaying() === true && noteD.currentTime() > 1) {
            noteD.stop();
            noteD.play();
            console.log("%c========", 'color: red')
          } else if (noteD.isPlaying() === false) {
            console.log("%c========", 'color: green')
            noteD.play();
          }

        }

        if (vida.activeZones[4].isMovementDetectedFlag) {

          if (noteE.isPlaying() === true && noteE.currentTime() > 1) {
            noteE.stop();
            noteE.play();
            console.log("%c========", 'color: red')
          } else if (noteE.isPlaying() === false) {
            console.log("%c========", 'color: green')
            noteE.play();
          }

        }

        console.log(noteA.currentTime())

        // if(vida.activeZones[1].isMovementDetectedFlag){
        //   if(noteA._playing !== true) {
        //     noteA.play();
        //   }
        // }

      }
    }
    pop(); // restore memorized drawing style and font
  }
  else {
    /*
      If there are problems with the capture device (it's a simple mechanism so
      not every problem with the camera will be detected, but it's better than
      nothing) we will change the background color to alarmistically red.
    */
    background(255, 0, 0);
  }
}


function createDivForTalbe(classForDiv) {
  const div = document.createElement('div')
  div.className = classForDiv

  return div
}