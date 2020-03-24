<template>
  <div @click="close" class="div-screen">
  </div>
</template>

<script>
import {eventBus, EV_closeFromScreen} from '@/services/eventBus.service'
export default {
methods: {
  close() {
    eventBus.$emit(EV_closeFromScreen)
    this.$store.commit({type: 'closeScreen'})
  }
}
}
</script>