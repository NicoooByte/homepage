function isValid(board, row, col, num) {
    // Check the row
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) {
            return false;
        }
    }

    // Check the column
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) {
            return false;
        }
    }

    // Check the 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }

    return true;
}

function findEmpty(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                return [row, col]; // Return the row and column of the empty cell
            }
        }
    }
    return null; // No empty space found
}

var changes = [];
function solveSudoku(board) {
    const emptySpot = findEmpty(board);
    if (!emptySpot) {
        return true; // Solved
    }

    const [row, col] = emptySpot;

    for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num; // Place the number
            changes.push({ row, col, num }); // Track the change

            if (solveSudoku(board)) {
                return true;
            }

            // Backtrack
            board[row][col] = 0; // Reset on backtrack
        }
    }

    return false; // No solution found
}

function isOriginalCell(row, col) {
    return originalPuzzle[row][col] !== 0;
}

function fillEmpty(puzzle) {
    let filledPuzzle = JSON.parse(JSON.stringify(puzzle));;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (filledPuzzle[i][j] === 0) {
                filledPuzzle[i][j] = Math.floor(Math.random() * 9) + 1;
            }
        }
    }
    return filledPuzzle;
}

function drawGrid(grid) {
    const gameGrid = document.querySelector('.game-grid');
    gameGrid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell-sudoku');
            if (grid[i][j] !== 0) {
                p = document.createElement("p")
                cellP = cell.appendChild(p);
                cellP.innerHTML = grid[i][j];
                if (isOriginalCell(i, j)) {
                    cell.classList.add("cell-sudoku-original");
                }
            }
            gameGrid.appendChild(cell);
        }
    }
}

function generatePuzzle() {
    const grid = [];
    for (let i = 0; i < 9; i++) {
        grid[i] = [];
        for (let j = 0; j < 9; j++) {
            grid[i][j] = 0;
        }
    }
    function solvePuzzle(grid) {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (grid[i][j] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(grid, i, j, num)) {
                            grid[i][j] = num;
                            if (solvePuzzle(grid)) {
                                return true;
                            }
                            grid[i][j] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    solvePuzzle(grid);
    // Make some cells empty
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (Math.random() < 0.9) {
                grid[i][j] = 0;
            }
        }
    }
    return grid;
}

function calculateCost(solution) {
    let cost = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (solution[i][j] !== 0) {
                // Check the row
                for (let k = 0; k < 9; k++) {
                    if (k !== j && solution[i][k] === solution[i][j]) {
                        cost++;
                    }
                }

                // Check the column
                for (let k = 0; k < 9; k++) {
                    if (k !== i && solution[k][j] === solution[i][j]) {
                        cost++;
                    }
                }
            }
        }
    }
    return cost;
}
const ctx = document.getElementById('scatterPlotSudoku').getContext('2d');

const scatterData = {
    datasets: [{
        label: 'Cost at iteration',
        data: [],
        backgroundColor: 'rgba(192, 192, 192, 0.6)',
        borderColor: 'rgba(0,0,0, 1)',
        borderWidth: 1,
        pointRadius: 5,
    }]
};

const scatterConfig = {
    type: 'scatter',
    data: scatterData,
    options: {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom'
            },
            y: {
                beginAtZero: true
            }
        }
    }
};
const myScatterPlot = new Chart(ctx, scatterConfig);

function addPoint(x, y) {
    scatterData.datasets[0].data.push({ x: x, y: y });
    myScatterPlot.update();
}

var puzzle = generatePuzzle();
const originalPuzzle = JSON.parse(JSON.stringify(puzzle));
solveSudoku(puzzle)
puzzle = JSON.parse(JSON.stringify(originalPuzzle));;

var changesCounter = 0;
calcBatch();
var sudokuInterval = setInterval(() => {
    calcBatch()
}, 200)

function calcBatch() {
    for (let i = 0; i < 5; i++) {
        if (changesCounter == changes.length) {
            break;
        }
        let change = changes[changesCounter]
        let row = change.row;
        let col = change.col;
        let num = change.num;
        puzzle[row][col] = num;
        changesCounter++;
    }
    let puzzleEmptyFilled = fillEmpty(puzzle);
    drawGrid(puzzleEmptyFilled);
    let cost = calculateCost(puzzleEmptyFilled);
    addPoint(changesCounter, cost)
    if (changes.length == 0) clearInterval(sudokuInterval);
} 