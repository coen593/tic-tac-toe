// Module function to define gameBoard
const gameBoard = (() => {
    const board = []
    const getContainer = () => document.querySelector('.gameboard')
    const createGrid = () => {
        const container = getContainer()
        for (let i = 0; i < 9; i++) {
            const div = document.createElement('div')
            div.dataset.index = i
            div.classList.add('cell')
            container.appendChild(div)
            div.addEventListener('click', function() {
                let cell = this.dataset.index
                setCell(cell)
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
    const setCell = (cell) => {
        board[cell] = 'X'
        let div = document.querySelector(`.cell[data-index="${cell}"]`)
        div.innerText = "X"
    }
    return { createGrid, resetGrid }
})();

// Factory function to define players
const Player = (symbol) => {
    return { symbol }
}

const game = (() => {
    const x = Player('X')
    const o = Player('O')
})()

gameBoard.createGrid()

