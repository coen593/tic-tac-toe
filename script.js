// Module function to define gameBoard
const gameBoard = (() => {
    let board = []
    const getBoard = () => board
    const resetBoard = () => board.length = 0
    const setCell = (active, cell) => {
        board[cell] = active
    }
    return { setCell, getBoard, resetBoard }
})();

const Player = (symbol, isActive, isComputer) => {
    const getSymbol = () => symbol
    const getActive = () => isActive
    const setActive = (bool) => isActive = bool
    const setComputer = () => isComputer = true
    const setPerson = () => isComputer = false
    return { getSymbol, getActive, setActive, setComputer, setPerson }
}

const game = (() => {
    const x = Player('X', false, false)
    const o = Player('O', false, false)

    const playMove = (cell) => {
        let active = getActivePlayer()
        gameBoard.setCell(active.getSymbol(), cell)
        displayController.setGridCell(active.getSymbol(), cell)
        active === x ? setActivePlayer(o) : setActivePlayer(x)
        if (checkWin()) {isGameOver(active.getSymbol())} 
        if (checkTie()) {isGameOver()}
    }

    const getActivePlayer = () => x.getActive() ? x : o

    const setActivePlayer = (active) => {
        if (active === x) {
            x.setActive(true)
            o.setActive(false)
        } else {
            o.setActive(true)
            x.setActive(false)
        }
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
        displayController.wonModal(winner)
    }

    const playAgain = () => {
        setActivePlayer(x)
        displayController.resetGrid()
        displayController.playAgainDisplay()
        game.initGame('person')
    }

    const initGame = (mode) => {
        if (mode === 'person') {
            gameBoard.resetBoard()
            displayController.resetGrid()
            displayController.removeModeScreen()
            x.setActive(true)
            o.setActive(false)
            x.setComputer(false)
            o.setComputer(false)
        }
    }

    return { playMove, checkWin, initGame, playAgain, getActivePlayer }
})()

const displayController = (() => {
    const wonModal = (winner) => {
        const modal = document.querySelector('.winner')
        const wonText = document.querySelector('.won')
        modal.classList.add('active')
        winner ? wonText.innerText = `${winner} won!` : wonText.innerText = "It's a tie!"
    }

    const playAgainDisplay = () => {
        const modal = document.querySelector('.winner')
        removeModal(modal)
    }
    const removeModeScreen = () => {
        const modal = document.querySelector('.start')
        removeModal(modal)
    }
    const removeModal = (modal) => modal.classList.remove('active')

    const initEventListeners = (() => {
        const personMode = document.querySelector('#vs-person')
        const aiMode = document.querySelector('#vs-ai')
        const playAgainButton = document.querySelector('#play-again')
        playAgainButton.addEventListener('click', () => game.playAgain())
        personMode.addEventListener('click', () => game.initGame('person'))
        aiMode.addEventListener('click', () => game.initGame('ai'))
    })()

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

    const setGridCell = (active, cell) =>{
        let div = document.querySelector(`.cell[data-index="${cell}"]`)
        div.innerText = active
    }

    return {wonModal, createGrid, resetGrid, setGridCell, playAgainDisplay, removeModeScreen}
})()


