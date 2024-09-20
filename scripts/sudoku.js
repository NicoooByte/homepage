// Function to generate a random Sudoku puzzle
function generatePuzzle() {
    const grid = [];
    for (let i = 0; i < 9; i++) {
        grid[i] = [];
        for (let j = 0; j < 9; j++) {
            grid[i][j] = 0;
        }
    }

    // Function to check if a number is valid in a cell
    function isValid(grid, row, col, num) {
        // Check the row
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num) {
                return false;
            }
        }

        // Check the column
        for (let i = 0; i < 9; i++) {
            if (grid[i][col] === num) {
                return false;
            }
        }

        // Check the box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[boxRow + i][boxCol + j] === num) {
                    return false;
                }
            }
        }

        return true;
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
            if (Math.random() < 0.3) {
                grid[i][j] = 0;
            }
        }
    }

    return grid;
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
            } else {
                const input = document.createElement('p');
                input.type = 'number';
                input.min = 1;
                input.max = 9;
                cell.appendChild(input);
            }
            gameGrid.appendChild(cell);
        }
    }
}

function isValidPlacement(currentSolution, row, col, num) {
    // Check the 3x3 subgrid
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (currentSolution[i][j] === num) {
                return false;
            }
        }
    }

    return true; // Valid placement
}

function getAvailableDigits(currentSolution, row, col) {
    const availableDigits = [];
    for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(currentSolution, row, col, num)) {
            availableDigits.push(num);
        }
    }
    return availableDigits;
}

function fillSudoku(currentSolution) {
    // Create an array to hold the positions of empty cells
    let emptyCells = [];
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (currentSolution[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }

    // Fill empty cells with logically available digits
    for (let i = 0; i < emptyCells.length; i++) {
        const { row, col } = emptyCells[i];
        const availableDigits = getAvailableDigits(currentSolution, row, col);

        if (availableDigits.length > 0) {
            // Randomly select one of the available digits
            const randomIndex = Math.floor(Math.random() * availableDigits.length);
            currentSolution[row][col] = availableDigits[randomIndex];
        }
    }
    return currentSolution;
}


function switchCells(newSolution, cost, stuckCount) {
    if (stuckCount == 0)
        stuckCount = 1
    for (let i = 0; i < Math.floor(Math.sqrt(cost)); i++) {
        const add = [0, 3, 6];
        const subgridRow = add[Math.floor(Math.random() * add.length)];
        const subgridCol = add[Math.floor(Math.random() * add.length)];
        const row1 = Math.floor(Math.random() * 3) + subgridRow;
        const row2 = Math.floor(Math.random() * 3) + subgridRow;
        const col1 = Math.floor(Math.random() * 3) + subgridCol;
        const col2 = Math.floor(Math.random() * 3) + subgridCol;
        if (isOriginalCell(row1, col1) || isOriginalCell(row2, col2)) {
            continue; // Skip if the cell is an original cell
        }

        [newSolution[row1][col1], newSolution[row2][col2]] = [newSolution[row2][col2], newSolution[row1][col1]];
    }
    return newSolution;
}


var iterationTotal = 0;
function simulatedAnnealing(currentSolution) {
    const maxIterations = 5;

    let currentCost = calculateCost(currentSolution);
    let newSolution = JSON.parse(JSON.stringify(currentSolution));
    let stuckCount = 0;

    for (let iteration = 0; iteration < maxIterations; iteration++) {
        let oldSolution = newSolution;
        newSolution = switchCells(newSolution, currentCost, stuckCount);
        const newCost = calculateCost(newSolution);

        if (newCost < currentCost) {
            currentSolution = newSolution;
            currentCost = newCost;
            stuckCount = 0;
            drawGrid(currentSolution);
        } else {
            stuckCount++;
            if (Math.random() < ((Math.min(1, stuckCount / 200)) / (1 / (currentCost / 500)))) {
                currentSolution = newSolution;
                currentCost = newCost;
            }
            else {
                newSolution = oldSolution;
            }
        }

        if (currentCost === 0) {
            clearInterval(intervall);
            break; // Stop if a solution is found
        }
    }
    iterationTotal += maxIterations;
    addPoint(iterationTotal, currentCost)
    return currentSolution;
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

function isOriginalCell(row, col) {
    return originalPuzzle[row][col] !== 0;
}

var puzzle = generatePuzzle();
const originalPuzzle = JSON.parse(JSON.stringify(puzzle));

puzzle = fillSudoku(puzzle);
drawGrid(puzzle);

function calcBatch() {
    puzzle = simulatedAnnealing(puzzle);
}

var intervall = setInterval(function () { calcBatch(); }, 100);

const ctx = document.getElementById('scatterPlotSudoku').getContext('2d');

const scatterData = {
    datasets: [{
        label: 'Cost at iteration',
        data: [

        ],
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