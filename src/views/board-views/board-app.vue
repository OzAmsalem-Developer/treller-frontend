<template>
    <main class="board-app" v-if="board">
        <board-header></board-header>
        <task-list v-for="list in taskLists" :taskList="list" :key="list.id">
        </task-list>
    </main>
</template>

<script>
import boardHeader from '@/cmps/board-cmps/board-header'
import taskList from '@/cmps/task-cmps/task-list'

export default {
    data() {
        return {
            board: null
        }
    },
    computed: {
        taskLists() {
            return this.$store.getters.taskLists
        }
    },
    created() {
        const boardId = this.$route.params.boardId
        async function getBoard() {
           const board = await this.$store.dispatch({type: 'loadById', boardId})
           try {
               this.board = JSON.parse(JSON.stringify(board)) 
           } catch {
               console.log('Err msg to user here')
               this.$router.push('/user/dashboard')
           }
        }
    },
    components: {
    boardHeader,
    taskList
    }
}
</script>