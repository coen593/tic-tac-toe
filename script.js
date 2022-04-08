// Module function to define gameBoard
const gameBoard = (() => {
    let board = [, , , , , , , , ,]
    const getBoard = () => board

    const resetBoard = () => {
        board = [, , , , , , , , ,]
    }

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
    let difficulty = 1

    const setDifficulty = (num) => {
        difficulty = num
    }

    const playMove = (cell) => {
        let active = getActivePlayer()
        gameBoard.setCell(active.getSymbol(), cell)
        displayController.setGridCell(active.getSymbol(), cell)
        active === x ? setActivePlayer(o) : setActivePlayer(x)
        if (checkWin(gameBoard.getBoard())) {
            isGameOver(active.getSymbol())
            return
        }
        if (checkTie(gameBoard.getBoard())) {
            isGameOver()
            return
        }
        if (getActivePlayer().getComputer()) doComputerMove()
    }

    const getActivePlayer = () => x.getActive() ? x : o

    const getNonactivePlayer = () => x.getActive() ? o : x

    const setActivePlayer = (active) => {
        if (active == x) {
            x.setActive(true)
            o.setActive(false)
        } else {
            o.setActive(true)
            x.setActive(false)
        }
    }

    const checkWin = (board, isMinimax = false) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let c of winConditions) {
            if (board[c[0]] === board[c[1]] &&
                board[c[0]] === board[c[2]] &&
                board[c[0]]) {
                if (isMinimax == false) displayController.createLine(c)
                return true
            }
        }
        return false
    }

    const checkTie = (board) => !board.includes(undefined)

    const isGameOver = (winner) => {
        displayController.toggleWonModal(winner)
    }

    const playAgain = () => {
        setActivePlayer(x)
        displayController.togglePlayAgain()
        displayController.toggleModeScreen()
    }

    const getPlayerSymbol = () => {
        displayController.toggleDifficulty()
        displayController.togglePlayerSymbol()
    }

    const getDifficulty = () => {
        displayController.toggleModeScreen()
        displayController.toggleDifficulty()
    }

    const getRandomMove = (board) => {
        const options = getOptions(board)
        return options[Math.floor(Math.random() * options.length)]
    }

    const getMiniMaxMove = (board, depth, maximizing) => {
        const options = getOptions(board)
        if (checkTie(board)) {
            return { move: options[0], val: 0 }
        }
        if (maximizing) {
            let highest = -100
            let move = -1
            for (let i = 0; i < options.length; i++) {
                const currBoard = [...board]
                currBoard[options[i]] = getActivePlayer().getSymbol()
                if (checkWin(currBoard, true)) {
                    highest = 10 - depth
                    move = options[i]
                } else {
                    let value = getMiniMaxMove(currBoard, depth + 1, false).val
                    if (value > highest) {
                        highest = value
                        move = options[i]
                    }
                }
            }
            return { move, val: highest }
        } else {
            let lowest = +100
            let move = -1
            for (let i = 0; i < options.length; i++) {
                const currBoard = [...board]
                currBoard[options[i]] = getNonactivePlayer().getSymbol()
                if (checkWin(currBoard, true)) {
                    lowest = depth - 10
                    move = options[i]
                } else {
                    let value = getMiniMaxMove(currBoard, depth + 1, true).val
                    if (value < lowest) {
                        lowest = value
                        move = options[i]
                    }
                }
            }
            return { move, val: lowest }
        }
    }

    const getOptions = (board) => {
        let optionArray = []
        for (let i = 0; i < board.length; i++) {
            if (board[i] === undefined) optionArray.push(i)
        }
        return optionArray
    }

    const doComputerMove = () => {
        const board = gameBoard.getBoard()
        let cell
        if (Math.random() > difficulty / 3) {
            cell = getRandomMove(board)
        } else {
            cell = getMiniMaxMove(board, 0, true).move
        }
        playMove(cell)
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
        getPlayerSymbol,
        getOptions,
        setDifficulty,
        getDifficulty
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

    const toggleDifficulty = () => toggleModal(document.querySelector('.difficulty'))

    const toggleModal = (modal) => modal.classList.toggle('active')

    const initEventListeners = (() => {
        const personMode = document.querySelector('#vs-person')
        const aiMode = document.querySelector('#vs-ai')
        const playAgainButton = document.querySelector('#play-again')
        const playerX = document.querySelector('#player-x')
        const playerO = document.querySelector('#player-o')
        const diffButtons = document.querySelectorAll('.difficulty-button')
        playAgainButton.addEventListener('click', () => game.playAgain())
        personMode.addEventListener('click', () => game.initGame('person'))
        aiMode.addEventListener('click', () => game.getDifficulty())
        playerX.addEventListener('click', () => game.initGame('ai', 'X'))
        playerO.addEventListener('click', () => game.initGame('ai', 'O'))
        diffButtons.forEach(button => {
            button.addEventListener('click', function () {
                game.setDifficulty(this.dataset.difficulty)
                game.getPlayerSymbol()
            })
        })
    })()

    const getContainer = () => document.querySelector('.gameboard')

    const createGrid = () => {
        const container = getContainer()
        const canvas = document.createElement('canvas')
        container.appendChild(canvas)
        for (let i = 0; i < 9; i++) {
            const div = document.createElement('div')
            div.dataset.index = i
            div.classList.add('cell')
            container.appendChild(div)
            div.addEventListener('click', function () {
                if (this.innerText || game.checkWin(gameBoard.getBoard())) { return }
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

    const setGridCell = (active, cell) => {
        let div = document.querySelector(`.cell[data-index="${cell}"]`)
        div.innerText = active
        div.classList.add(active)
    }

    const createLine = (c) => {
        var cvs = document.querySelector("canvas");
        var ctx = cvs.getContext("2d");
        ctx.strokeStyle = "darkblue";

        function drawLine(x1, y1, x2, y2, ratio) {
            ctx.moveTo(x1, y1);
            x2 = x1 + ratio * (x2 - x1);
            y2 = y1 + ratio * (y2 - y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        if (c[0] == 0 && c[2] == 2) {x1 = 0  ; y1 = 20 ; x2 = 300; y2 = 20 }
        if (c[0] == 3 && c[2] == 5) {x1 = 0  ; y1 = 75 ; x2 = 300; y2 = 75 }
        if (c[0] == 6 && c[2] == 8) {x1 = 0  ; y1 = 130; x2 = 300; y2 = 130}
        if (c[0] == 0 && c[2] == 6) {x1 = 38 ; y1 = 0  ; x2 = 38 ; y2 = 300}
        if (c[0] == 1 && c[2] == 7) {x1 = 148; y1 = 0  ; x2 = 148; y2 = 300}
        if (c[0] == 2 && c[2] == 8) {x1 = 262; y1 = 0  ; x2 = 262; y2 = 300}
        if (c[0] == 0 && c[2] == 8) {x1 = 0  ; y1 = 0  ; x2 = 600; y2 = 300}
        if (c[0] == 2 && c[2] == 6) {x1 = 0  ; y1 = 150; x2 = 300; y2 = 0  }

        function animate(ratio) {
            ratio = ratio || 0;
            drawLine(x1, y1, x2, y2, ratio);
            if (ratio < 1) {
                requestAnimationFrame(function () {
                    animate(ratio + 0.02);
                });
            }
        }

        animate();
    }

    return {
        toggleWonModal,
        createGrid,
        resetGrid,
        setGridCell,
        togglePlayAgain,
        toggleModeScreen,
        togglePlayerSymbol,
        toggleDifficulty,
        createLine
    }
})()


