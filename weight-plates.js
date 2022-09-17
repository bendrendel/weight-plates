class Weight {
    constructor(weight, width, type) {
        this.weight = weight;
        this.width = width;
        this.type = type;
    }

    get density() {
        return (this.weight / this.width);
    }
}

class WeightSet {
    constructor(weights = []) {
        this.weights = weights;
    }

    get totalWeight() {
        return weights.reduce((accumulator, current) => accumulator + current.weight, 0);
    }

    get totalWidth() {
        return weights.reduce((accumulator, current) => accumulator + current.width, 0);
    }

    addWeight(weight) {
        this.weights.push(weight);
    }
}

const weights = [
    new Weight(1.25, 0.39, 'change'),
    new Weight(2.5, 0.59, 'change'),
    new Weight(5, 0.75, 'change'),
    new Weight(10, 1.02, 'change'),
    new Weight(10, 0.83, 'bumper'),
    new Weight(15, 1.04, 'bumper'),
    new Weight(25, 1.5, 'bumper'),
    new Weight(35, 1.93, 'bumper'),
    new Weight(45, 2.36, 'bumper'),
    new Weight(55, 2.75, 'bumper')
]

const sleeveLength = 15;

const myWeights = new WeightSet(weights);

console.log(myWeights.totalWidth);

const testSet = ['A', 'B', 'C', 'D', 'E'];

const allSubsets = [];

function getSubsets(set, subsetLength, currentSubset = []) {
    while (true) {
        if (subsetLength === 0) {
            allSubsets.push(currentSubset);
            return;
        } else if (set.length === 0) {
            return;
        } else {
            getSubsets(set.slice(), subsetLength - 1, currentSubset.concat(set[0]));
            set.shift();
        }
    }
}

getSubsets(['A','B','C','D','E'], 2);

allSubsets.forEach((subset, idx) => {
    console.log((idx + 1) + ': [' + subset.reduce((accum, currVal) => accum + currVal, '') + ']');
})