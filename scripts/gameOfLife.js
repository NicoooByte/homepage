class GameOfLife {
    constructor(startingPositions, rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = this.initializeGrid(startingPositions);
    }

    initializeGrid(startingPositions) {
        let grid = [];
        for (let i = 0; i < this.rows; i++) {
            grid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                grid[i][j] = 0;
            }
        }
        startingPositions.forEach(([x, y]) => {
            if (x >= 0 && x < this.rows && y >= 0 && y < this.cols) {
                grid[x][y] = 1;
            }
        });
        return grid;
    }

    countNeighbors(x, y) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let nx = (x + i + this.rows) % this.rows;
                let ny = (y + j + this.cols) % this.cols;
                count += this.grid[nx][ny];
            }
        }
        count -= this.grid[x][y];
        return count;
    }

    nextGeneration() {
        let newGrid = [];
        for (let i = 0; i < this.rows; i++) {
            newGrid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                let liveNeighbors = this.countNeighbors(i, j);
                if (this.grid[i][j] === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
                    newGrid[i][j] = 0;
                } else if (this.grid[i][j] === 0 && liveNeighbors === 3) {
                    newGrid[i][j] = 1;
                } else {
                    newGrid[i][j] = this.grid[i][j];
                }
            }
        }
        this.grid = newGrid;
    }

    flipParticle(x, y) {
        if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
            this.grid[y][x] ^= 1;
        }
    }

    printGrid(element) {
        let html = '';
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                html += this.grid[i][j] === 1 ? '*' : '&nbsp;';
            }
            html += '<br/>';
        }
        element.innerHTML = html;
    }
}

let startingPositions = [];
let rlePattern = [
    "27b2o", "27bobo", "29bo4b2o", "25b4ob2o2bo2bo", "25bo2bo3bobob2o",
    "28bobobobo", "29b2obobo", "33bo", "", "19b2o", "20bo8bo", "20bobo5b2o",
    "21b2o", "35bo", "36bo", "34b3o", "", "25bo", "25b2o", "24bobo4b2o22bo",
    "31bo21b3o", "32b3o17bo", "34bo17b2o", "", "45bo", "46b2o12b2o", "45b2o14bo",
    "3b2o56bob2o", "4bo9b2o37bo5b3o2bo", "2bo10bobo37b2o3bo3b2o", "2b5o8bo5b2o35b2obo",
    "7bo13bo22b2o15bo", "4b3o12bobo21bobo12b3o", "3bo15b2o22bo13bo", "3bob2o35b2o5bo8b5o",
    "b2o3bo3b2o37bobo10bo", "o2b3o5bo37b2o9bo", "2obo56b2o", "3bo14b2o", "3b2o12b2o",
    "19bo", "", "11b2o17bo", "12bo17b3o", "9b3o21bo", "9bo22b2o4bobo", "38b2o",
    "39bo", "", "28b3o", "28bo", "29bo", "42b2o", "35b2o5bobo", "35bo8bo", "44b2o",
    "", "31bo", "30bobob2o", "30bobobobo", "27b2obobo3bo2bo", "27bo2bo2b2ob4o",
    "29b2o4bo", "35bobo", "36b2o"
];

let element = document.getElementById('gameOfLife');
let screenHeight = window.innerHeight;
let lineHeight = parseInt(getComputedStyle(element).lineHeight);
let gridSize2 = Math.floor(screenHeight / lineHeight);
let xOffset = 2;
let yOffset = Math.floor(gridSize2 / 2 - rlePattern.length / 2);;

for (let i = 0; i < rlePattern.length; i++) {
    let row = rlePattern[i];
    let x = xOffset;
    for (let j = 0; j < row.length; j++) {
        let count = '';
        while (j < row.length && !isNaN(row[j])) {
            count += row[j];
            j++;
        }
        if (count === '') {
            count = '1';
        }
        count = parseInt(count);
        let type = row[j];
        if (type === 'b') {
            x += count;
        } else if (type === 'o') {
            for (let k = 0; k < count; k++) {
                startingPositions.push([i + yOffset, x + k]);
            }
            x += count;
        } else if (type === '$') {
            break;
        }
    }
}

let game = new GameOfLife(startingPositions, gridSize2, 70);
game.printGrid(element);
game.nextGeneration();

setInterval(() => {
    game.printGrid(element);
    game.nextGeneration();
}, 100);

var height = 0;
function getCharacterWidth(character, font) {
    const offScreenElement = document.createElement('span');
    offScreenElement.style.visibility = 'hidden';
    offScreenElement.style.position = 'absolute';
    offScreenElement.style.font = font;
    offScreenElement.textContent = character;
    document.body.appendChild(offScreenElement);

    const width = offScreenElement.offsetWidth;
    height = offScreenElement.offsetHeight;
    document.body.removeChild(offScreenElement);

    return width;
}
const character = '*';
const font = window.getComputedStyle(element).getPropertyValue('font');
let characterWidth = getCharacterWidth(character, font);

element.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.button === 0) {
        let rect = element.getBoundingClientRect();
        let x = Math.floor((event.clientX - rect.left) / characterWidth);
        let y = Math.floor((event.clientY - rect.top) / height);
        game.flipParticle(x, y);
    }
});