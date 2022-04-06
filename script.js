// Module function to define gameBoard
const gameBoard = (() => {
    const board = []
    let cell
    const getContainer = () => document.querySelector('.gameboard')
    const createGrid = () => {
        const container = getContainer()
        for (let i = 0; i < 9; i++) {
            const div = document.createElement('div')
            div.dataset.index = i
            div.classList.add('cell')
            container.appendChild(div)
            div.addEventListener('click', function() {
                if (this.innerText || game.gameOver) {return}
                cell = this.dataset.index
                game.playMove(this.dataset.index)
            })
        }
    }
    const resetGrid = () => {
        const divs = getContainer().childNodes
        for (let i = 0; i < divs.length; i++) {
            divs[i].remove()
            i--
        }
        createGrid()
    }
    const setCell = (active) => {
        board[cell] = active
        let div = document.querySelector(`.cell[data-index="${cell}"]`)
        div.innerText = active
    }
    return { createGrid, setCell, board }
})();

const game = (() => {
    const Player = (symbol) => {
        return { symbol }
    }
    const x = Player('X')
    const o = Player('O')
    let active = x
    let gameOver

    const playMove = () => {
        gameBoard.setCell(active.symbol)
        if (checkWin()) {
            isGameOver(active.symbol)
        }
        console.log(gameOver)
        active === x ? active = o : active = x
    }

    const checkWin = () => {
        let board = gameBoard.board
        const winConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]
        for (let c of winConditions) { 
            if (board[c[0]] === board[c[1]] && 
            board[c[0]] === board[c[2]] &&
            board[c[0]]) {
                return true
            }
        }
        return false
    }

    const isGameOver = (winner) => {
        const modal = document.querySelector('.winner')
        const wonText = document.querySelector('.won')
        wonText.innerText = `${winner} won!`
        modal.classList.add('active')
        gameOver = true
    }

    return { playMove, gameOver }
})()

gameBoard.createGrid()

