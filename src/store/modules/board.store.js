import { boardService } from '@/services/board.service.js'

export const boardStore = ({
    state: {
        currBoard: null,
        filterBy: null,
        currTask: null,
        isLabelsMini: true,
    },
    getters: {
        currBoardId(state) {
            return state.currBoard._id
        },
        taskLists(state) {
            return state.currBoard.taskLists
        },
        boardTasks(state) {
            const boardTasks = []
            state.currBoard.taskLists.forEach(list => {
                list.tasks.forEach(task => {
                    boardTasks.push(task)
                })    
            })
            return boardTasks
        },
        currTask(state) {
            return state.currTask
        },
        labels(state) {
            return state.currBoard.labels
        },
        currBoard(state) {
            return state.currBoard
        },
        isLabelsMini(state) {
            return state.isLabelsMini
        }

    },
    mutations: {
        setBoards(state, { boards }) {
            state.boards = boards
        },
        setCurrBoard(state, { board }) {
            state.currBoard = board
        },
        setCurrTask(state, { task }) {
            state.currTask = task
        },
        setTaskById(state, { taskId }) {
            if (!taskId) { //Option to set null
                state.currTask = null
                return
            }
            state.currBoard.taskLists.forEach(taskList => {
                let currTask = taskList.tasks.find(task => task.id === taskId)
                if (currTask) state.currTask = currTask
            })
        },
        toggleMiniLabals(state) {
            state.isLabelsMini = !state.isLabelsMini
        },
        removeCurrBoard(state) {
            state.currBoard = null
            state.currTask = null
            state.filterBy = null
            state.isLabelsMini = true
        }
    },

    actions: {

        async loadById(context, { boardId }) {
            const board = await boardService.getById(boardId)
            try {
                context.commit({ type: 'setCurrBoard', board })
                return board
            } catch {
                console.log('Err: Board load failed')
                throw new Error()
            }
        },
        async updateTask(context, { task }) {
            const prevTask = JSON.parse(JSON.stringify(context.state.currTask))
            context.commit({ type: 'setCurrTask', task })
            const boardCopy = JSON.parse(JSON.stringify(context.state.currBoard))

            // save the list id on the task its easier here
            boardCopy.taskLists.forEach(taskList => {
                let idx = taskList.tasks.findIndex(currTask => currTask.id === task.id)
                if (idx !== -1) {
                    taskList.tasks.splice(idx, 1, task)
                    try {
                        context.dispatch({ type: 'saveBoard', board: boardCopy })
                    } catch {
                        console.log('Err: Task saving failed')
                        context.commit({ type: 'setCurrTask', prevTask })
                        return Promise.reject(prevTask)
                    }
                }
            })
        },
        async removeTask(context, { task }) {
            const prevTask = JSON.parse(JSON.stringify(context.state.currTask))
            // Oz do you want me to reset currTask here?
            const boardCopy = JSON.parse(JSON.stringify(context.state.currBoard))
            boardCopy.taskLists.forEach(taskList => {
                let idx = taskList.tasks.findIndex(currTask => currTask.id === task.id)
                if (idx !== -1) {
                    taskList.tasks.splice(idx, 1)
                    try {
                        context.dispatch({ type: 'saveBoard', board: boardCopy })
                    } catch {
                        console.log('Err: Task saving failed')
                        context.commit({ type: 'setCurrTask', prevTask })
                        return Promise.reject(prevTask)
                    }
                }
            })
        },
        async saveBoard(context, { board }) {
            const prevBoard = JSON.parse(JSON.stringify(context.state.currBoard))
            context.commit({ type: 'setCurrBoard', board })
            const savedBoard = await boardService.save(board)
            try {
                return savedBoard
            } catch {
                context.commit({ type: 'setCurrBoard', prevBoard })
                console.log('Err: Board saving failed')
                return Promise.reject(prevBoard)
            }
        },
        async removeBoard(context, { boardId }) {
            const prevBoard = JSON.parse(JSON.stringify(context.state.currBoard))
            // context.commit({ type: 'removeCurrBoard', boardId })
            await boardService.remove(boardId)
            try {
                console.log('Board Deleted')
                return boardId
            } catch {
                context.commit({ type: 'setCurrBoard', prevBoard })
                console.log('Err: Board removind failed')
                return Promise.reject(prevBoard)
            }
        },
        async createBoard(context, { board }) {
            const newBoard = await boardService.save(board)
            try {
                return newBoard
            } catch {
                console.log('Board create failed')
                return Promise.reject()
            }
        }
    }
})
