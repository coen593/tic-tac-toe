// Module function to define gameBoard
const gameBoard = (() => {
    const board = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = {
                row: i,
                col: j,
                fill: ''
            }
            board.push(cell)
        }
    }
    return { board }
})();

// Factory function to define players
const Player = (symbol) => {
    const symbol = symbol
    return { symbol }
}