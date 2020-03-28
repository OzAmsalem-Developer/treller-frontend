<template>
<div class="avatar">
      <div class="user-avatar center-flex" :style="{background: background}">
      {{avatarTxt}}
  </div>
      <img :src="imgUrl" alt="" class="remove-img" @click="removeMember(user._id)" />
</div>

      
</template>

<script>
import {utilService} from '@/services/util.service'
import {eventBus,EV_removeMember} from "@/services/eventBus.service";
export default {
    methods: {
    async removeMember(userId) {
      const users =  await this.$store.dispatch({type: 'loadUsers'})
      const user = users.find(u => u._id === userId)
      if (!user) return
      const idx = user.boards.findIndex(board => board._id === this.$store.getters.currBoard._id)
      user.boards.splice(idx, 1)
      this.$store.dispatch({type: 'updateUser', user})
        eventBus.$emit(EV_removeMember, userId)
        }
    },
computed: {
    avatarTxt() {
        return (this.user.imgUrl) ? '' : this.user.username.slice(0,1).toUpperCase()
    },
    background() {
         return (this.user.imgUrl) ? this.user.imgUrl 
         : this.user.avatarColor ? this.user.avatarColor : utilService.getRandomColor()
    },
    imgUrl() {
        return require('@/assets/img/remove-btn.webp')
    }
},
props: {
    user: Object
    }
}
</script>