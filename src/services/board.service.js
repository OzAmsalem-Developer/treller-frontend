import { storageService } from './storage.service'
import { utilService } from './util.service'

const KEY = 'boards'
var gBoards

export const boardService = {
    loadOne,
    query,
    save,
    getEmptyList
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

async function loadOne(boardId) {
    const boards = storageService.load(KEY)
    if (!boards) await query()
    const foundBoard = boards.find(board => board._id === boardId)
    if (!foundBoard) return Promise.reject()
    return foundBoard
}

async function save(board) {
    if (!gBoards) await query()
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

function getEmptyList() {
    return {
        id: utilService.makeId(),
        name: '',
        tasks: []
    }
}

    

function _getSampleBoards() {
    return [
        {
            _id: 'board7272',
            name: 'Final sprint board',
            theme: 'dark',
            labels: {
                label1: {
                    id: 'lb101',
                    color: 'pink',
                    txt: 'Together'
                },
                label2: {
                    id: 'lb102',
                    color: 'red',
                    txt: 'Error'
                },
                label3: {
                    id: 'lb103',
                    color: 'blue',
                    txt: 'New Feature'
                },
                label4: {
                    id: 'lb104',
                    color: 'yellow',
                    txt: 'ITP'
                }
            },
            taskLists: [
                {
                    id: utilService.makeId(),
                    name: 'Planning',
                    tasks: [
                        {
                            id: 'task382034',
                            name: 'Create navbar',
                            style: { bgColor: 'blue' },
                            members: [
                                {
                                    _id: 'u101',
                                    fullName: 'Guy Amsalem',
                                    imgUrl: null
                                },
                                {
                                    _id: 'u102',
                                    fullName: 'Oz Amsalem',
                                    imgUrl: null
                                },
                                {
                                    _id: 'u103',
                                    fullName: 'Rami Davidov',
                                    imgUrl: null
                                }
                            ],
                            labels: ['label1'],
                            dueDate: (Date.now() + 1000 * 60 * 60 * 5),
                            desc: 'Build a nice data to show',
                            attachments: [],
                            checklist:
                            {
                                id: utilService.makeId(),
                                title: 'Our todos',
                                todos: [
                                    {
                                        id: utilService.makeId(),
                                        txt: 'Need to do that',
                                        isDone: false
                                    }
                                ]
                            },
                            comments: [
                                {
                                    id: utilService.makeId(),
                                    from: 'User name',
                                    txt: 'Good job',
                                    createdAt: 32938219823782,
                                    imgUrl: null
                                }
                            ]
                        },
                        {
                            id: utilService.makeId(),
                            name: 'Basic structure building',
                            style: { bgColor: 'yellow' },
                            members: [
                                {
                                    _id: 'u102',
                                    fullName: 'Oz Amsalem',
                                    imgUrl: null
                                }
                            ],
                            labels: ['label2'],
                            dueDate: (Date.now() + 1000 * 60 * 60 * 100),
                            desc: 'Start a new project',
                            attachments: [],
                            checklist:
                            {
                                id: utilService.makeId(),
                                title: 'Get started',
                                todos: [
                                    {
                                        id: utilService.makeId(),
                                        txt: 'Implement Vue CLI',
                                        isDone: false
                                    },
                                    {
                                        id: utilService.makeId(),
                                        txt: 'Folders structure',
                                        isDone: false
                                    }
                                ]
                            },
                            comments: [
                                {
                                    id: utilService.makeId(),
                                    from: 'user2',
                                    txt: 'Im here for help, feel free to call',
                                    createdAt: 32938219823782,
                                    imgUrl: null
                                }
                            ]
                        },
                        {
                            id: utilService.makeId(),
                            name: 'Add vue filters',
                            style: { bgColor: 'white' },
                            members: [
                                {
                                    _id: 'u102',
                                    fullName: 'Oz Amsalem',
                                    imgUrl: null
                                }
                            ],
                            labels: ['label4', 'label3'],
                            dueDate: null,
                            desc: null,
                            attachments: [],
                            checklist:
                            {
                                id: utilService.makeId(),
                                title: 'Get started',
                                todos: [
                                    {
                                        id: utilService.makeId(),
                                        txt: 'Implement Vue CLI',
                                        isDone: false
                                    },
                                    {
                                        id: utilService.makeId(),
                                        txt: 'Folders structure',
                                        isDone: false
                                    }
                                ]
                            },
                            comments: [
                                {
                                    id: utilService.makeId(),
                                    from: 'Guy Amsalem',
                                    txt: 'Im here for help, feel free to call',
                                    createdAt: 32938219823782,
                                    imgUrl: null
                                }
                            ]
                        },
                    ]
                },
                {
                    id: utilService.makeId(),
                    name: 'In progress',
                    tasks: [
                        {
                            id: utilService.makeId(),
                            name: 'Buliding taskList componnent',
                            style: { bgColor: 'white' },
                            members: [
                                {
                                    _id: 'u103',
                                    fullName: 'Rami Davidov',
                                    imgUrl: null
                                }
                            ],
                            labels: [],
                            dueDate: (Date.now() + 1000 * 60 * 60 * 5),
                            desc: 'Buliding taskList componnent',
                            attachments: [],
                            checklist:
                            {
                                id: utilService.makeId(),
                                title: 'Building steps:',
                                todos: [
                                    {
                                        id: utilService.makeId(),
                                        txt: 'Connect to parents/ router',
                                        isDone: false
                                    },
                                    {
                                        id: utilService.makeId(),
                                        txt: 'Add imports if needed',
                                        isDone: false
                                    }
                                ]
                            },
                            comments: [
                                {
                                    id: utilService.makeId(),
                                    from: 'Oz Amsalem',
                                    txt: 'Good luck with that',
                                    createdAt: 32938219823782,
                                    imgUrl: null
                                }
                            ]
                        },
                        {
                            id: utilService.makeId(),
                            name: 'Set up the stores',
                            style: { bgColor: 'white' },
                            members: [
                                {
                                    _id: 'u102',
                                    fullName: 'Oz Amsalem',
                                    imgUrl: null
                                }
                            ],
                            labels: [],
                            dueDate: (Date.now() + 1000 * 60 * 60 * 48),
                            desc: null,
                            attachments: [],
                            checklist: null,
                            comments: []
                        },
                    ]
                },
                {
                    id: utilService.makeId(),
                    name: 'Done',
                    tasks: [
                        {
                            id: utilService.makeId(),
                            name: 'Technical approval',
                            style: { bgColor: 'white' },
                            members: [
                                {
                                    _id: 'u101',
                                    fullName: 'Guy Amsalem',
                                    imgUrl: null
                                },
                                {
                                    _id: 'u102',
                                    fullName: 'Oz Amsalem',
                                    imgUrl: null
                                }
                            ],
                            labels: ['label1'],
                            dueDate: Date.now(),
                            desc: null,
                            attachments: [],
                            checklist: null,
                            comments: [
                                {
                                    id: utilService.makeId(),
                                    from: 'Rami Davidov',
                                    txt: 'Best team EVER!!!',
                                    createdAt: 32938219823782,
                                    imgUrl: null
                                }
                            ]
                        }
                    ]
                },
            ]
        }
    ]
}


