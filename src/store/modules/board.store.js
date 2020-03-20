import { boardService } from '@/services/board.service.js'

export const boardStore = ({
    state: {
        boards: [],
        currBoard: null,
        filterBy: null,
        currTask: null
    },
    getters: {
        taskLists(state) {
            return state.currBoard.taskLists
        },
        currTask(state) {
            return state.currTask
        }
    },
    mutations: {
        setBoards(state, { boards }) {
            state.boards = boards
        },
        setCurrBoard(state, { board }) {
            state.currBoard = board
        },
        setCurrTask(state, { taskId }) {
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
            console.log(boardId);
            const board = await boardService.loadOne(boardId)
            try {

                context.commit({ type: 'setCurrBoard', board })
                return board
            } catch {
                console.log('Err: Board load failed')
                throw new Error()
            }
        },
        async saveBoard(context, { board }) {
            const savedBoard = await boardService.save(board)
            try {
                console.log('Board Saved!')
                return savedBoard
            } catch {
                console.log('Err: Board saving failed')
                throw new Error()
            }
        }
    }
})
