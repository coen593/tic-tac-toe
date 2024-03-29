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

// Factory function to create new players
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

// Game function, module function defining the whole game
const game = (() => {
    const x = Player('X', false, false)
    const o = Player('O', false, false)
    let difficulty = 1

    const setDifficulty = (num) => {
        difficulty = num
    }

    // Sets the selected cell to the active player's symbol in the gameboard and on the display
    // Switches the active player
    // Checks if game is won or tied
    // If the new active player is a computer, it's asked to do a move
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

    // Returns a boolean to see if a game is won
    // If not called by the minimax function, it also triggers the win animation on the display
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
                if (isMinimax == false) {
                    displayController.winAnimate(c)
                }
                return true
            }
        }
        return false
    }

    // Checks if the game is tied
    const checkTie = (board) => !board.includes(undefined)

    // Below functions all toggle a modal on and off and basically walk through the menu structure as such
    const isGameOver = (winner) => {
        setTimeout(() => displayController.toggleWonModal(winner), 1000)
    }

    const playAgain = () => {
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

    // Random move generator
    const getRandomMove = (board) => {
        const options = getOptions(board)
        return options[Math.floor(Math.random() * options.length)]
    }

    // Optimal move generator through minmax function
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

    // Checks board input and returns all empty cells
    const getOptions = (board) => {
        let optionArray = []
        for (let i = 0; i < board.length; i++) {
            if (board[i] === undefined) optionArray.push(i)
        }
        return optionArray
    }

    // Based on difficulty more or less likely to produce a random or minimax move
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

    // Resets the game
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

// Display controller controls everything the user sees and can interact with
const displayController = (() => {
    // Below are all toggles for modals on the screen
    const toggleWonModal = (winner) => {
        const modal = document.querySelector('.winner')
        const wonText = document.querySelector('.won-header')
        toggleModal(modal)
        winner ? wonText.innerText = `${winner} won!` : wonText.innerText = "It's a tie!"
    }

    const togglePlayAgain = () => toggleModal(document.querySelector('.winner'))

    const toggleModeScreen = () => toggleModal(document.querySelector('.start'))

    const togglePlayerSymbol = () => toggleModal(document.querySelector('.choose-symbol'))

    const toggleDifficulty = () => toggleModal(document.querySelector('.difficulty'))

    const toggleModal = (modal) => modal.classList.toggle('active')

    // All initial event listeners (minus grid cells)
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

    // Simple function to quickly grab the gameboard (often used)
    const getContainer = () => document.querySelector('.gameboard')

    // Creates a grid: creates the canvas for drawing lines and nine empty cells
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

    // Removes the grid on the gameboard
    const resetGrid = () => {
        const divs = getContainer().childNodes
        for (let i = 0; i < divs.length; i++) {
            divs[i].remove()
            i--
        }
    }

    // Fill in value in a cell
    const setGridCell = (active, cell) => {
        let div = document.querySelector(`.cell[data-index="${cell}"]`)
        div.innerText = active
        div.classList.add(active)
    }

    // Animation to create a line through the winning cells
    // Also triggers a font size increase in the winning cells
    const winAnimate = (c) => {
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

        // Coordinates for the line based on winning cells
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

        // Class won increases the font size in the cells
        getContainer().childNodes.forEach(cell => {
            if (c.includes(parseInt(cell.dataset.index))) {
                cell.classList.add('won')
            }
        })
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
        winAnimate
    }
})()


