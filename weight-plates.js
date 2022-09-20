const fs = require('fs');
const { combinationsWithRep, round } = require('mathjs');

class Plate {
    constructor(weight, width, type) {
        this.weight = weight;
        this.width = width;
        this.type = type;
    }

    get plateName() {
        return `${this.weight}${this.type[0]}`;
    }

    get density() {
        return (this.weight / this.width);
    }
}

class PlateSet {
    constructor(plates = []) {
        this.plates = plates;
    }

    get totalPlates() {
        return this.plates.length;
    }

    get totalWeight() {
        return round(this.plates.reduce((accumulator, current) => accumulator + current.weight, 0), 2);
    }

    get totalWidth() {
        return round(this.plates.reduce((accumulator, current) => accumulator + current.width, 0), 2);
    }

    get minWeight() {
        if (this.totalPlates === 0) {
            return null;
        } else {
            return round(this.plates.map(plate => plate.weight).reduce((accumulator, current) => Math.min(accumulator, current)), 2);
        }
    }

    get groupedPlates() {
        return [...new Set(this.plates)].map(plate => {
            return {
                quantity: this.plates.filter(comparePlate => comparePlate == plate).length,
                type: plate
            }
        })
    }

    get toString() {
        return `[ ${this.plates.map(plate => plate.plateName).join(' + ')} = ${this.totalWeight} | ${this.totalWidth} | ${this.totalPlates}]`;
    }

    addPlate(plate, quantity = 1) {
        for (let i = 0; i < quantity; i++) {
            this.plates.push(plate);
        }
    }

    merge(plateSet) {
        plateSet.groupedPlates.forEach(groupedPlate => {
            const index = this.groupedPlates.findIndex(compareGroupedPlate => compareGroupedPlate.type == groupedPlate.type);
            if (index === -1) {
                this.addPlate(groupedPlate.type, groupedPlate.quantity);
            } else {
                const quantityDiff = groupedPlate.quantity - this.groupedPlates[index].quantity;
                this.addPlate(groupedPlate.type, Math.max(0, quantityDiff));
            }
        })
    }

    contains(plateSet) {
        return plateSet.groupedPlates.every(groupedPlate => {
            const index = this.groupedPlates.findIndex(compareGroupedPlate => compareGroupedPlate.type == groupedPlate.type);
            return index === -1 || groupedPlate.quantity - this.groupedPlates[index].quantity > 0 ? false : true;
        });
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
        } else if (depth === plateOptions.totalPlates) {
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

const allPlateCombos = plateCombosWithRep(plateOptions, 5);

const allPlateCombosByWeight = [...new Set(allPlateCombos.map(plateSet => plateSet.totalWeight))].map(weight => ({ weight: weight, plateCombos: [] }));

allPlateCombos.forEach(plateSet => {
    const index = allPlateCombosByWeight.findIndex(comboWeight => comboWeight.weight === plateSet.totalWeight);
    allPlateCombosByWeight[index].plateCombos.push(plateSet);
});

allPlateCombosByWeight.sort((a, b) => {
    const lengthDiff = a.plateCombos.length - b.plateCombos.length;
    return lengthDiff === 0 ? b.weight - a.weight : lengthDiff;
});


const solutions = [];

function allSolutions(combosByWeight, solutionSet) {
    const nextCombosByWeight = combosByWeight.filter(element => {
        return !element.plateCombos.some(combo => solutionSet.contains(combo))
    })

    if (nextCombosByWeight.length === 0) {
        solutions.push(solutionSet);
        return;
    } else {
        nextCombosByWeight[0].plateCombos.forEach(plateCombo => {
            const nextSolutionSet = new PlateSet([...solutionSet.plates]);
            nextSolutionSet.merge(plateCombo);
            allSolutions(nextCombosByWeight, nextSolutionSet);
        })        
    }
}

allSolutions(allPlateCombosByWeight, new PlateSet([]));

console.log(solutions.length);
solutions.sort((a, b) => a.totalPlates - b.totalPlates === 0 ? a.totalWeight - b.totalWeight : a.totalPlates - b.totalPlates).forEach(plateSet => plateSet.plates.sort((a, b) => a.weight - b.weight));

const data = JSON.stringify(solutions.map(a=>a.toString), null, 4);

fs.writeFile('solutions5.json', data, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});