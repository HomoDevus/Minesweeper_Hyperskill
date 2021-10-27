function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}

function bombCreator() {
    let bombsPositions = []
    let position
    for (let i = 10; i > 0;) {
        position = Math.floor(getRandomNum(0, 71));
        if (!bombsPositions.includes(position)) {
            bombsPositions.push(position);
            i--;
        }
    }
    return bombsPositions
}

function cellsCreator() {
    let cellsCreate = [];
    for (let id = 0; id < 72; id++) {
        cellsCreate.push({id: id, bomb: false, bombsAround: '', flag: false, open: false, cellClass: ''});
    }
    return cellsCreate;
}

export default function bombPlacer() {
        let bombsPositions = bombCreator();
        let field = cellsCreator();
        bombsPositions.forEach(function(bombPos) {
            field[bombPos].bomb = true;
        })
        return field
    }