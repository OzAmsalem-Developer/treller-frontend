import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
const baseUrl = 'board'


export const boardService = {
    query,
    getById,
    remove,
    save,
    getEmptyBoard,
    getEmptyList,
    getEmptyTask
}

function query(userId) {
    return httpService.get(baseUrl, userId)
}

function getById(id) {
    return httpService.get(`${baseUrl}/${id}`)
}

function remove(id) {
    return httpService.delete(`${baseUrl}/${id}`)
}

function save(board) {
    if (board._id) {
        return httpService.put(`${baseUrl}/${board._id}`, board)
    } else {
        return httpService.post(`${baseUrl}`, board)
    }
}


// Empty objects service

function getEmptyBoard() {
    return {
        name: '',
        style: {},
        activities: [],
        members : [],
        labels: {
            label1: {
                color: '#ff78cb',
                txt: ''
            },
            label2: {
                color: '#eb5a46',
                txt: ''
            },
            label3: {
                color: '#00c2e0',
                txt: ''
            },
            label4: {
                color: '#f2d600',
                txt: ''
            }
        },
        taskLists: [
            {
                id: utilService.makeId(7),
                name: 'Planning',
                tasks: []
            },
            {
                id: utilService.makeId(7),
                name: 'In Progress',
                tasks: []
            },
            {
                id: utilService.makeId(7),
                name: 'Done',
                tasks: []
            }
        ]
    }
}

function getEmptyList() {
    return {
        id: utilService.makeId(7),
        name: '',
        tasks: []
    }
}

function getEmptyTask() {
    return {
        id: utilService.makeId(7),
        name: '',
        style: { bgColor: 'default', color: 'default' },
        members: [],
        labels: [],
        dueDate: {
            time: null,
            isCompleted: null
        },
        desc: '',
        attachments: [],
        checklist: null,
        comments: []
    }
}