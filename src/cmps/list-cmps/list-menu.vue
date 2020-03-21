<template>
  <menu class="list-menu">
    <div @click="emitEv('remove-list')" class="item">Remove list</div>
    <div @click="$emit('add-task')" class="item">Add new task</div>
    <div  @click="emitEv('move-list')" class="item">Move list</div>
  </menu>
</template>

<script>
import {eventBus} from '@/services/eventBus.service'

export default {
    methods: {
        emitEv(evName) {
            eventBus.$emit(evName, this.listId)
        }
    },
    props: {
        listId: String
    }
}
</script>

<style>

</style>