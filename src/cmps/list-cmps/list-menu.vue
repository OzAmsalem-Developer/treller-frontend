<template>
  <menu class="list-menu">
    <div @click="emitEv('remove-list')" class="item">Remove list</div>
    <div @click="$emit('add-task')" class="item">Add new task</div>
    <div  @click="isMoveOpen = !isMoveOpen" class="item">Move list</div>
    <list-mover v-if="isMoveOpen" v-model="moveToIdx" @input="moveList" :options="listIdxs" />
  </menu>
</template>

<script>
import {eventBus} from '@/services/eventBus.service'
import listMover from '@/cmps/list-cmps/list-mover'

export default {
    data() {
        return {
            isMoveOpen: false,
            moveToIdx: null
        }
    },
    methods: {
        emitEv(evName) {
            eventBus.$emit(evName, this.listId)
        },
        moveList(toIdx) {
            this.$emit('list-moved', toIdx)
        }
    },
    computed: {
        listIdxs() {
         return this.$store.getters.taskLists.reduce((acc, tl,idx) => {
                if (tl.id !== this.listId) acc.push(idx + 1)
                return acc
            },[])
        }
    },
    components: {
        listMover
    },
    props: {
        listId: String
    }
}
</script>

<style>

</style>