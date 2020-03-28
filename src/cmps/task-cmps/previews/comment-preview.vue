<template>
  <section class="comments-preview">
    <div class="comment-card" v-for="comment in comments" :key="comment.id">
      <div class="comment-img-container member-card">
        <user-avatar :user="comment.from" />
      </div>
      <div class="comment-info">
        <div class="comment-from">{{comment.from.username}}</div>
        <div class="comment-time">{{comment.createdAt | dateAgo}}</div>
      </div>
      <div class="comment-txt">{{comment.txt}}</div>
      <div class="comment-controls">
        <span class="action-link" @click="removeComment(comment.id)">delete</span>
      </div>
    </div>
  </section>
</template>

<script>
import userAvatar from '@/cmps/main-cmps/user-avatar'
export default {
  methods: {
    removeComment(id) {
      this.$emit('removeComment', id)
    }
  },
  props: {
    comments: Array
  },
  components: {
    userAvatar
  }
};
</script>