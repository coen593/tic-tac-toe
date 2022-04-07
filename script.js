// Module function to define gameBoard
const gameBoard = (() => {
    let board = []
    const getBoard = () => board

    const resetBoard = () => board.length = 0

    const setCell = (active, cell) => board[cell] = active

    return { setCell, getBoard, resetBoard }
})();

const Player = (symbol, isActive, isComputer) => {
    const getSymbol = () => symbol
    const getActive = () => isActive
    const setActive = (bool) => isActive = bool
    const getComputer = () => isComputer
    const setComputer = (bool) => isComputer = bool
    return { 
        getSymbol, 
        getActive, 
        setActive, 
        setComputer, 
        getComputer
    }
}

const game = (() => {
    const x = Player('X', false, false)
    const o = Player('O', false, false)

    const playMove = (cell) => {
        let active = getActivePlayer()
        gameBoard.setCell(active.getSymbol(), cell)
        displayController.setGridCell(active.getSymbol(), cell)
        active === x ? setActivePlayer(o) : setActivePlayer(x)
        if (checkWin()) {
            isGameOver(active.getSymbol())
            return
        } 
        if (checkTie()) {
            isGameOver()
            return
        }
        if (getActivePlayer().getComputer()) doComputerMove()
    }

    const getActivePlayer = () => x.getActive() ? x : o

    const setActivePlayer = (active) => {
        if (active == x) {
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
        displayController.toggleWonModal(winner)
    }

    const playAgain = () => {
        setActivePlayer(x)
        displayController.togglePlayAgain()
        displayController.toggleModeScreen()
    }

    const getPlayerSymbol = () => {
        displayController.toggleModeScreen()
        displayController.togglePlayerSymbol()
    }

    const doComputerMove = () => {
        let options = gameBoard.getBoard()
        let cell = ''
        while (cell === '' || options[cell] === 'X' || options[cell] === 'O') {
            cell = Math.floor(Math.random() * 9)
        }
        game.playMove(cell)
    }

    const initGame = (mode, symbol) => {
        if (mode === 'person') {
            displayController.toggleModeScreen()
            x.setComputer(false)
            o.setComputer(false)
        } else if (symbol === 'X') {
            displayController.togglePlayerSymbol()
            x.setComputer(false)
            o.setComputer(true)
        } else {
            displayController.togglePlayerSymbol()
            x.setComputer(true)
            o.setComputer(false)
        }
        gameBoard.resetBoard()
        displayController.resetGrid()
        displayController.createGrid()
        setActivePlayer(x)
        if (symbol === 'O') doComputerMove()
    }

    return { 
        playMove, 
        checkWin, 
        initGame, 
        playAgain, 
        getActivePlayer,
        getPlayerSymbol
    }
})()

const displayController = (() => {
    const toggleWonModal = (winner) => {
        const modal = document.querySelector('.winner')
        const wonText = document.querySelector('.won')
        toggleModal(modal)
        winner ? wonText.innerText = `${winner} won!` : wonText.innerText = "It's a tie!"
    }

    const togglePlayAgain = () => toggleModal(document.querySelector('.winner'))

    const toggleModeScreen = () => toggleModal(document.querySelector('.start'))

    const togglePlayerSymbol = () => toggleModal(document.querySelector('.choose-symbol'))

    const toggleModal = (modal) => modal.classList.toggle('active')

    const initEventListeners = (() => {
        const personMode = document.querySelector('#vs-person')
        const aiMode = document.querySelector('#vs-ai')
        const playAgainButton = document.querySelector('#play-again')
        const playerX = document.querySelector('#player-x')
        const playerO = document.querySelector('#player-o')
        playAgainButton.addEventListener('click', () => game.playAgain())
        personMode.addEventListener('click', () => game.initGame('person'))
        aiMode.addEventListener('click', () => game.getPlayerSymbol())
        playerX.addEventListener('click', () => game.initGame('ai','X'))
        playerO.addEventListener('click', () => game.initGame('ai','O'))
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
    }

    const setGridCell = (active, cell) =>{
        let div = document.querySelector(`.cell[data-index="${cell}"]`)
        div.innerText = active
    }

    return {
        toggleWonModal, 
        createGrid, 
        resetGrid, 
        setGridCell, 
        togglePlayAgain, 
        toggleModeScreen,
        togglePlayerSymbol
    }
})()


