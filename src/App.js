import React from 'react';
import './App.css';
import Minesweeper from "./Minesweeper";
import bombPlacer from './CellsCreate';
import Context from "./context";

let firstRun = true
let closedCells = 72
let frozeField = false

function App() {
    function reset() {
        timerStart(false);
        firstRun = true;
        closedCells = 72;
        frozeField = false;
        setCells(bombPlacer());
        setControl(({timerCount: new Date(0), flags: 10, resetEmoji: '🙂'}))
    }
    // ======== States =======
    const [cells, setCells] = React.useState(bombPlacer());
    const [control, setControl] = React.useState(
        {timerCount: new Date(0), flags: 10, resetEmoji: '🙂'}
        );
    // =======================

    // ============== Cell open functions ===================
    function getRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function firstCellBomb(clickedCell) {
        let position = getRandomNum(0, 71)
        setCells(cells.map(cell => {
            if (cell.id === clickedCell.id) {
                cell.bomb = false
            }
            if (cell.id === position) {
                if (!cell.bomb) {
                    cell.bomb = true
                } else {
                    firstCellBomb(clickedCell)
                }
            }
            return cell
        }))
    }

    function openCell(clickedCell) {
        // Check if this first running
        if (firstRun) {
            if (clickedCell.bomb) {
                firstCellBomb(clickedCell)
            }
            timerStart(true);
        }

        // change values and add classes
        firstRun = false
        const CellPosition = clickedCell.id
        const Cell = cells[clickedCell.id]

        if (Cell.open === false && !frozeField) {
            if (Cell.bomb) {
                setControl(prev => ({...prev, resetEmoji: '😵'}));
                showAllBombs();
            } else {
                emptyCellOpen(CellPosition)
            }
        }
    }

    function emptyCellOpen(CellPosition) {
        let flagAmount = flagCounter()
        let changes = {open: true, flag: false, cellClass: 'empty'}
        changeCell(CellPosition, changes);
        cellsAround(CellPosition);
        closedCells--
        checkForWin(closedCells)
        setControl(prev => ({...prev, flags: flagAmount}));
    }

    // Return array with id of cells around
    function cellsAround(cellPos) {
        let cellsAround = [];

        if (cellPos % 8 !== 0) {cellsAround.push(cellPos - 1)}
        if ((cellPos + 1) % 8 !== 0) {cellsAround.push(cellPos + 1)}
        if ((cellPos + 8) < 72) {cellsAround.push(cellPos + 8)}
        if ((cellPos - 8) > -1) { cellsAround.push(cellPos - 8) }
        if ((cellPos + 9) < 72 && (cellPos + 9) % 8 !== 0) {cellsAround.push(cellPos + 9)}
        if ((cellPos - 9) > -1 && (cellPos - 8) % 8 !== 0) {cellsAround.push(cellPos - 9)}
        if ((cellPos + 7) < 72 && (cellPos + 8) % 8 !== 0) {cellsAround.push(cellPos + 7)}
        if ((cellPos - 7) > -1 && (cellPos - 7) % 8 !== 0) {cellsAround.push(cellPos - 7)}

        return checkBombsAround(cellPos, cellsAround);
    }

    // Get central cell and cells around in array from other function and return a number of bombs
    function checkBombsAround(cellPos, cellsAround) {
        let bombs = 0;

        for (const CellPos of cellsAround) {
            if (cells[CellPos].bomb) {
                bombs++;
            }
        }
        if (bombs !== 0) {
            return applyBombsAround(cellPos, bombs);
        } else {
            for (const CellPos of cellsAround) {
                setTimeout(function() {
                    if (!cells[CellPos].open) {
                        emptyCellOpen(CellPos)
                    }
                }, 0)
            }
        }
    }
    // Get cell and bombs amount from checkBombsAround func. Then adds class for each number its own color
    function applyBombsAround(cellPosition, bombsAmount) {
        let style
        switch (bombsAmount) {
            case 1:
                style = 'one-bomb';
                break;
            case 2:
                style = 'two-bombs';
                break;
            case 3:
                style = 'three-bombs';
                break;
            case 4:
                style = 'four-bombs';
                break;
            case 5:
                style = 'five-bombs';
                break;
            case 6:
                style = 'six-bombs';
                break;
            case 7:
                style = 'seven-bombs';
                break;
            case 8:
                style = 'eight-bombs';
                break;
        }

        let addObj = {cellClass: `empty ${style}`, bombsAround: bombsAmount}
        changeCell(cellPosition, addObj)
    }
    // =======================================================

    // ================== Flag functions ======================

    function flag(clickedCell) {
        const Cell = cells[clickedCell.id]
        let changes = {}

        if (!Cell.open) {
            if (!Cell.flag && control.flags > 0) {
                changes = {flag: true, cellClass: 'flagged'}
            } else {
                changes = {flag: false, cellClass: ''}
            }
            changeCell(clickedCell.id, changes)
        }
        setControl(prev => ({...prev, flags: flagCounter()}))
    }

    function flagCounter() {
        let flagCount = 10

        for (let cell of cells) {
            if (cell.flag) {
                flagCount -= 1
            }
        }
        return flagCount
    }
    // =========================================================

    // ============== Timer functions ==============

    function addSecond(date) {
        date.setSeconds(date.getSeconds() + 1)
        return date
    }

    function timerStart(status) {

        if (status) {
            let timerId = setInterval(function() {
                let date = addSecond(control.timerCount)
                setControl(prevState => ({...prevState, timerCount: date}))}, 1000)
            setControl(prevState => ({...prevState, timerId: timerId}))
        } else {
            clearInterval(control.timerId);
        }
    }
    // =============================================
    // =============== Win/Lose functions ==========

    // Checks if closed cells = amount of bombs. If it's true shows all bombs and changes emoji
    function checkForWin(closedCellsAmount) {
        if (closedCellsAmount === 10) {
            showAllBombs();
            setControl(prev => ({...prev, resetEmoji: '🥳'}));
        }
    }

    function showAllBombs() {
        cells.map(cell => {
            if (cell.bomb === true) {
                let changes = {open: true, flag: false, cellClass: 'bomb'};
                changeCell(cell.id, changes);
                timerStart(false);
                setControl(prev => ({...prev, flags: flagCounter()}));
                frozeField = true;
            }
        })
    }
    // =============================================
    // ========== Often used functions =============

    // get cell position in an array and array with properties to change and change them
    function changeCell(cellPosition, addObj) {
        setCells(prev => {
            prev[cellPosition] = Object.assign(prev[cellPosition], addObj)
            return prev
        })
    }
    // =============================================
  return (
      <Context.Provider value={{openCell, flag, reset}}>
        <div className="App">
            <Minesweeper cells={cells} control={control} />
        </div>
      </Context.Provider>
  );
}

export default App;
