<template>
  <section>
    <div class="screen-trans" @click="$emit('clicked')"></div>
    <menu class="list-menu">
      <div @click="$emit('add-task')" class="item">
        <i class="fas fa-plus"></i>
        <span>Add new task</span>
      </div>
      <div @click="isMoveOpen = !isMoveOpen" class="item move-list-btn">
        <i class="fas fa-arrow-right"></i>
        <span>Move list</span>
      </div>
      <list-mover v-if="isMoveOpen" 
      v-model="moveToIdx" 
      @input="moveList" 
      @close-picker="isMoveOpen = false"
      :options="listIdxs" 
      />
      <div @click="emitEv('remove-list')" class="item remove">
        <i class="far fa-trash-alt remove-list-icon"></i>
        <span>Remove list</span>
      </div>
    </menu>
  </section>
</template>

<script>
import { eventBus, EV_closeFromScreen } from "@/services/eventBus.service";
import listMover from "@/cmps/list-cmps/list-mover";

export default {
  data() {
    return {
      isMoveOpen: false,
      moveToIdx: null
    };
  },
  methods: {
    emitEv(evName) {
      eventBus.$emit(evName, this.listId);
    },
    moveList(toIdx) {
      this.$emit("list-moved", toIdx);
    }
  },
  computed: {
    listIdxs() {
      return this.$store.getters.taskLists.reduce((acc, tl, idx) => {
        if (tl && tl.id !== this.listId) acc.push(idx + 1);
        return acc;
      }, []);
    }
  },
  components: {
    listMover
  },
  props: {
    listId: String
  }
};
</script>

<style>
</style>