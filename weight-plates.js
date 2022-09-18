const { combinationsWithRep, round } = require('mathjs');

class Plate {
    constructor(weight, width, type) {
        this.weight = weight;
        this.width = width;
        this.type = type;
    }

    get density() {
        return (this.weight / this.width);
    }
}

class PlateSet {
    constructor(plates = []) {
        this.plates = plates;
    }

    get numPlates() {
        return this.plates.length;
    }

    get totalWeight() {
        return round(this.plates.reduce((accumulator, current) => accumulator + current.weight, 0), 2);
    }

    get totalWidth() {
        return round(this.plates.reduce((accumulator, current) => accumulator + current.width, 0), 2);
    }
}

// function combosWithRep(set, comboLength, depth = 0, currentCombo = [], allCombos = []) {
//     while (true) {
//         if (comboLength === 0) {
//             allCombos.push(currentCombo);
//             return allCombos;
//         } else if (depth === set.length) {
//             return allCombos;
//         } else {
//             combosWithRep(set, comboLength - 1, depth, currentCombo.concat(set[depth]), allCombos);
//             depth++;
//         }
//     }
// }

// function combosWithRepMaxLength(set, maxComboLength) {
//     const allCombos = [];
//     for (let comboLength = 0; comboLength <= maxComboLength; comboLength++) {
//         allCombos.push(...combosWithRep(set, comboLength));
//     }
//     return allCombos;
// }

function plateCombosWithRep(plateOptions, sleeveLength, depth = 0, currentCombo = new PlateSet(), allCombos = []) {
    while (true) {
        if (currentCombo.totalWidth > sleeveLength) {
            return;
        } else if (depth === plateOptions.numPlates) {
            allCombos.push(currentCombo);
            return allCombos;
        } else {
            const nextCombo = new PlateSet([...currentCombo.plates, plateOptions.plates[depth]]);
            plateCombosWithRep(plateOptions, sleeveLength, depth, nextCombo, allCombos);
            depth++;
        }
    }
}

const plateOptions = new PlateSet([
    new Plate(1.25, 0.39, 'change'),
    new Plate(2.5, 0.59, 'change'),
    new Plate(5, 0.75, 'change'),
    new Plate(10, 1.02, 'change'),
    new Plate(10, 0.83, 'bumper'),
    new Plate(15, 1.04, 'bumper'),
    new Plate(25, 1.5, 'bumper'),
    new Plate(35, 1.93, 'bumper'),
    new Plate(45, 2.36, 'bumper'),
    new Plate(55, 2.75, 'bumper')
]);

const sleeveLength = 15;

const testPlateCombos = plateCombosWithRep(plateOptions, 5);

console.log(testPlateCombos.map((combo, idx) => `Combo ${idx + 1}: ${combo.numPlates} plates, ${combo.totalWeight} lbs, ${combo.totalWidth} in`))