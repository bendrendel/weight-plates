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

    get totalWeight() {
        return this.plates.reduce((accumulator, current) => accumulator + current.weight, 0);
    }

    get totalWidth() {
        return this.plates.reduce((accumulator, current) => accumulator + current.width, 0);
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

function combosWithRep(set, comboLength, currentCombo = [], allCombos = []) {
    set = set.slice();
    while (true) {
        if (comboLength === 0) {
            allCombos.push(currentCombo);
            return allCombos;
        } else if (set.length === 0) {
            return allCombos;
        } else {
            combosWithRep(set, comboLength - 1, currentCombo.concat(set[0]), allCombos);
            set.shift();
        }
    }
}

function combosWithRepMaxLength(set, maxComboLength) {
    const allCombos = [];
    for (let comboLength = 0; comboLength <= maxComboLength; comboLength++) {
        allCombos.push(...combosWithRep(set, comboLength));
    }
    return allCombos;
}