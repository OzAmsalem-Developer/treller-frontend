import {boardService} from '@/services/board.service.js'

export const boardStore = ({
    state: {
        boards: []
    },
    mutations: {
    },
    actions: {
        async loadBoards(context, {userId}) {
            const boards = await boardService.query()
            try {
                context.commit({type: 'setBoards', boards})
            } catch {
                console.log('Err: Boards load failed');
                throw new Error()
            }
        }
    }
  })
  