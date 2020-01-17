let datablob;
let arrayOfMagnitude;
let arrayOfProfondeur;
let localite;
let maxMag;
let minMag;
let maxProf;
let minProf;
let c;

const ration = 2



function preload() {
    datablob = loadTable("http://127.0.0.1:5501/seisme.tsv", "tsv", "header")
    
}

function setup() {
    // console.log(datablob)
    // console.log(datablob.columns);
    // console.log(datablob.rows);

    for(const line of datablob.rows) {
        console.log(line.obj["Heure locale"])
        console.log(line.obj["Magnitude"])
        console.log(line.obj["Localite"])
        console.log(line.obj["Profondeur"])
        console.log(line.obj["Latitude"])
        console.log(line.obj["Longitude"])
    }

    //let c = createCanvas(504/ration , 384/ration);

    let c = createCanvas(384/ration ,504/ration);
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

    // point spacing parameters
    const stepPositionY     = 100/ration
    const stepPositionX     = 60/ration

    // global position parameters
    const topPosition       = 42/ration
    const leftPosition      = 40/ration

   /////////////////////////////////////////////////////////////////////////////////////////////////////////////


    let indexOfColumnsPrinted = 10 // increment after column printed
   


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const stepOfColumnToPrint = 5 //number of notes
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
            const poseY = indexLeftPosition * stepPositionY + leftPosition
            const poseX = Math.round(intensityMapped) * stepPositionX + topPosition + (stepPositionX / 2)

            fill(0)
            ellipse(poseX, poseY, 40/ration, 40/ration)
        } else {
            // todo: code to execute at the end of array
            break
        }
    }

    console.log("intensity: ",  Math.min(...arrayOfIntensity),    Math.max(...arrayOfIntensity))

    //console.log(magnitude);
    maxProf = Math.max(...arrayOfProfondeur);
    minProf = Math.min(...arrayOfProfondeur);

    //print les valeurs
    console.log(minMag,maxMag)
    console.log(minProf,maxProf)
}

function draw() {

//grid of the partition

line(width / 2 - 150/ration, 504, width / 2 - 150/ration, 0);
line(width / 2 - 90/ration, 504, width / 2 - 90/ration, 0);
line(width / 2 - 30/ration, 504, width / 2 - 30/ration, 0);
line(width / 2 + 30/ration, 504, width / 2 + 30/ration, 0);
line(width / 2 + 90/ration, 504, width / 2 + 90/ration, 0);
line(width / 2 + 150/ration, 504, width / 2 + 150/ration, 0);

// line(0, height / 2 - 90/ration, width, height / 2 - 90/ration);
// line(0, height / 2 - 30/ration, width, height / 2 - 30/ration);
// line(0, height / 2 + 30/ration, width, height / 2 + 30/ration);
// line(0, height / 2 + 90/ration, width, height / 2 + 90/ration);
// line(0, height / 2 + 150/ration, width, height / 2 + 150/ration);

// textSize(15);
// text("fragment sonore", 250,height-20);

}

//save the image
function mouseClicked() {
saveCanvas('Partition','png');

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
