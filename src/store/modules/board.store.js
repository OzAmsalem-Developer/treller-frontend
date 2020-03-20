import { boardService } from '@/services/board.service.js'

export const boardStore = ({
    state: {
        boards: [],
        currBoard: null,
        filterBy: null,
        currTask: null
    },
    getters: {
        currBoardId(state) {
            return state.currBoard._id
        },
        taskLists(state) {
            console.log(state.currBoard)
            return state.currBoard.taskLists
        },
        currTask(state) {
            return state.currTask
        },
        labels(state) {
            return state.currBoard.labels
        }
    },
    mutations: {
        setBoards(state, { boards }) {
            state.boards = boards
        },
        setCurrBoard(state, { board }) {
            state.currBoard = board
        },
        setCurrTask(state, {task}) {
            state.currTask = task
        },
        setTaskById(state, { taskId }) {
            if (!taskId) {
                state.currTask = null
                return
            }
            state.currBoard.taskLists.forEach(taskList => {
                let currTask = taskList.tasks.find(task => task.id === taskId)
                if (currTask) state.currTask = currTask
            })
        }
    },
    actions: {
        async loadBoards(context) {
            const filterBy = context.state.filterBy
            const boards = await boardService.query(filterBy)
            try {
                context.commit({ type: 'setBoards', boards })
                return boards
            } catch {
                console.log('Err: Boards load failed')
                throw new Error()
            }
        },
        async loadById(context, { boardId }) {
            const board = await boardService.loadOne(boardId)
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
            console.log(boardCopy)
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
        async saveBoard(context, { board }) {
            const prevBoard = JSON.parse(JSON.stringify(context.state.currBoard))
            context.commit({ type: 'setCurrBoard', board })
            const savedBoard = await boardService.save(board)
            try {
                console.log('Board Saved!')
                return savedBoard
            } catch {
                context.commit({ type: 'setCurrBoard', prevBoard })
                console.log('Err: Board saving failed')
                return Promise.reject(prevBoard)
            }
        }
    }
})
