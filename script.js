// Module function to define gameBoard
const gameBoard = (() => {
    let board = []
    let cell
    const getBoard = () => board
    const getContainer = () => document.querySelector('.gameboard')
    const createGrid = () => {
        const container = getContainer()
        for (let i = 0; i < 9; i++) {
            const div = document.createElement('div')
            div.dataset.index = i
            div.classList.add('cell')
            container.appendChild(div)
            div.addEventListener('click', function() {
                if (this.innerText || game.checkWin()) {return}
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
            board.length = 0
        }
        createGrid()
    }
    const setCell = (active) => {
        board[cell] = active
        let div = document.querySelector(`.cell[data-index="${cell}"]`)
        div.innerText = active
    }
    return { createGrid, setCell, resetGrid, getBoard }
})();

const Player = (symbol, isActive, isComputer) => {
    return { symbol, isActive, isComputer }
}

const game = (() => {
    const x = Player('X', false, false)
    const o = Player('O', false, false)
    let active = x
    let gameOver = false

    const playMove = () => {
        gameBoard.setCell(active.symbol)
        if (checkWin()) {isGameOver(active.symbol)} 
        if (checkTie()) {isGameOver()} 
        active === x ? active = o : active = x
    }

    const checkWin = () => {
        const board = gameBoard.getBoard()
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

    const checkTie = () => gameBoard.getBoard().length === 9 && !gameBoard.getBoard().includes(undefined)

    const isGameOver = (winner) => {
        const modal = document.querySelector('.winner')
        const wonText = document.querySelector('.won')
        const playAgainButton = document.querySelector('#play-again')
        wonText.innerText = `${winner} won!`
        modal.classList.add('active')
        gameOver = true
        playAgainButton.addEventListener('click', () => playAgain(modal))
        winner ? wonText.innerText = `${winner} won!` : wonText.innerText = "It's a tie!"
    }

    const playAgain = (modal) => {
        gameOver = false
        active = x
        modal.classList.remove('active')
        gameBoard.resetGrid()
    }

    return { playMove, checkWin }
})()



