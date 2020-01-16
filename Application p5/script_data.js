let datablob;
let arrayOfMagnitude;
let arrayOfProfondeur;
let localite;
let maxMag;
let minMag;
let maxProf;
let minProf;



function preload() {
    datablob = loadTable("http://127.0.0.1:5500/seisme.tsv", "tsv", "header")
}

function setup() {
    createCanvas(windowWidth, 220);
    background(255);
    //print(datablob.getRowCount() + ' total rows in table');
    //print(datablob.getColumnCount() + ' total columns in table');

    arrayOfMagnitude = datablob.getColumn('Magnitude');
    arrayOfProfondeur = datablob.getColumn('Profondeur');
    localite = datablob.getColumn('Localite');
    arrayOfMagnitude = arrayOfMagnitude.map(Number); // formatting all entries from text to real numbers
    arrayOfProfondeur = arrayOfProfondeur.map(Number);

    // Valeur max et min des données
    maxMag = Math.max(...arrayOfMagnitude);
    minMag = Math.min(...arrayOfMagnitude);
    maxProf = Math.max(...arrayOfProfondeur);
    minProf = Math.min(...arrayOfProfondeur);
    // console.log(magnitude);

    let multiplier;
    let scale;

    // //calcule de l'intensity
    // arrayOfMagnitude.map((mag, index) => {
    //
    //     multiplier = (mag * profondeur[index]) / maxMag;
    //     scale = map(profondeur[index],minProf,maxProf,5,0);
    //     let intensity = (scale * mag).toFixed(2);
    //     // console.log(index, mag, profondeur[index], localite[index] + ": " + intensity)
    //     for (let i = 0; i < 10; i++) {
    //
    //         let poseY = 50 * (intensity + 1)
    //
    //
    //         // ecart entre les cercles - step
    //         step = (i * 35)
    //         fill(0)
    //         ellipse(step, poseY, 25, 25)
    //         console.log(intensity)
    //         // console.log(step + "hello");
    //         // console.log(profondeur);
    //     }
    //
    // })

    // point spacing parameters
    const stepPositionX     = 45
    const stepPositionY     = 30

    // global position parameters
    const topPosition       = 35
    const leftPosition      = 40
    let indexOfColumnsPrinted = 0 // increment after column printed
    const stepOfColumnToPrint = 200

    const indexToStart = indexOfColumnsPrinted * stepOfColumnToPrint
    const indexEnd = stepOfColumnToPrint + (stepOfColumnToPrint * indexOfColumnsPrinted)

    const arrayOfIntensity  = getAllIntensity(1, 6)

    const minIntensityCalc = Math.min(...arrayOfIntensity)
    const maxIntensityCalc = Math.max(...arrayOfIntensity)

    for(let i = indexToStart; i < indexEnd; i++) {

        const indexLeftPosition = i - indexToStart
        // const indexLeftPosition = i

        if(i < arrayOfIntensity.length) {
            const intensity = arrayOfIntensity[i]

            const intensityMapped = map(intensity, minIntensityCalc, maxIntensityCalc, 0, 5)
            const poseX = indexLeftPosition * stepPositionX + leftPosition
            const poseY = Math.round(intensityMapped) * stepPositionY + topPosition + (stepPositionY / 2)

            fill(0)
            ellipse(poseX, poseY, 25, 25)
        } else {
            // todo: code to execute at the end of array
            break
        }
    }

    console.log("intensity: ",  Math.min(...arrayOfIntensity),    Math.max(...arrayOfIntensity))

    //console.log(magnitude);
    maxProf = Math.max(...arrayOfProfondeur);
    minProf = Math.min(...arrayOfProfondeur);

    // fill(0);
    // // let w = width / magnitude.length;
    // for (let i = 0; i < 10; i++) {
    // profondeur = datablob.getColumn('Profondeur');
    // maxProf = Math.max(...profondeur);
    // minProf = Math.min(...profondeur);

    // let scaleProf = map(profondeur.map(Number),minProf,maxProf,5,0);
    // fill(0);

    // // let step = 30
    // // step * (valeur + 1)
    // // ecart entre les cercles - step
    // let step = 0
    // step =  (i * 35)
    // ellipse(step, profondeur [200 + 135] , 25,25);
    // // console.log(step + "hello");
    // // console.log(profondeur);
    // }

    //print les valeurs
    console.log(minMag,maxMag)
    console.log(minProf,maxProf)


    //   fill(0);
    //   textAlign(CENTER);
    //   push();
    //   translate(posx + w / 2, height / 2);
    //   textSize(30)
    //   text(localite[i], 0, 0);
    //   pop();
}

function draw() {
    //rect(10,10,windowWidth-20, 220-20);
    //fill(255);
   //lignes partition pour les notes//
    // line(10, height / 2 - 120, windowWidth - 10, height / 2 - 120 );
  let lineP1 = line(10, height / 2 - 75, windowWidth - 10, height / 2 - 75 );
  let line2 = line(10, height / 2 - 45, windowWidth - 10, height / 2 - 45);
  let line3 = line(10, height / 2 - 15, windowWidth - 10, height / 2 - 15);
  let line4 = line(10, height / 2 + 15, windowWidth - 10, height / 2 + 15);
  let line5 = line(10, height / 2 + 45, windowWidth - 10, height / 2 + 45);
  let line6 = line(10, height / 2 + 75, windowWidth - 10, height / 2 + 75);

//     push();
//     fill(0);
//     // if(intensity < 0 && intensity > -1){ ellipse(30, height / 2 - 60, 20);}

//     ellipse(30, height / 2 - 30, 20);
//     ellipse(30, height / 2 , 20);
//     ellipse(30, height / 2 + 30, 20);
//     ellipse(30, height / 2 + 60, 20);
//     pop();
//     translate(30,0);
}

// function declaration

function getAllIntensity(minMap, maxMap) {
    const saveIntensity = []

    let i = 0

    while(i < arrayOfMagnitude.length) {
        if(i < arrayOfProfondeur.length) {

            const magnitude = arrayOfMagnitude[i]
            const profondeur = arrayOfProfondeur[i]

            const magnitudeMapped  = map(magnitude, minMag, maxMag, minMap, maxMap, true) // between 1,6
            const profondeurMapped = map(profondeur, minProf, maxProf, minMap, maxMap, true) // between 1,6

            const intensity = magnitudeMapped / profondeurMapped

            saveIntensity.push(intensity)
        } else {
            break
        }

        i++
    }
    return saveIntensity
}
