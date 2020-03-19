import {storageService} from './storage.service'
const KEY = 'boards'
var gBoards

export const boardService = {
    loadOne,
    query,
    save
}

function query(filterBy) {
    var boards = storageService.load(KEY)
    if (!boards) {
        boards = _getSampleBoards()
        storageService.store(KEY, boards)
    }
    gBoards = boards
    return Promise.resolve(boards)
}

function loadOne(boardId) {
    const boards = storageService.load(KEY)
    const foundBoard = boards.find(board => board._id === boardId)
    if (!foundBoard) return Promise.reject()
    return foundBoard
}

function save(board) {
    if (board._id) {
        const boardIdx = gBoards.findIndex(currBoard => currBoard._id === board._id)
        if (boardIdx === -1) throw new Error('Board not found')
        gBoards.splice(boardIdx, 1, board)
      
    } else {
        board._id = utilService.makeId(15)
        gBoards.unshift(board)
    }
    storageService.store(KEY, gBoards)
    return Promise.resolve(board)
}