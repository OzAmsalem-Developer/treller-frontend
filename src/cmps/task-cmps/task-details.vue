<template>
  <section v-if="task" class="task-details">
    <h1>{{task.name}}</h1>

    <div class="task-labels">
      <span>Labels:</span>
      <span>Update</span>
      <div class="members-list">
        <div v-for="label in labels" :key="label.id">{{label.txt}}</div>
        <button>+</button>
      </div>
    </div>

    <div class="task-members">
      <span>Members:</span>
      <span>Invite</span>
      <div class="members-list">
        <div v-for="member in members" :key="member.id">{{member.fullName}}</div>
        <button>+</button>
      </div>
    </div>

    <div class="task-due-date">
      <button>[]</button>
      <span>Calender:</span>
      <span>{{task.dueDate}}:</span>
    </div>

    <div class="task-description">
      <span>Description:</span>
      <span>Edit</span>
      <p>{{task.description}}:</p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      task: null
    };
  },
  methods: {
    async loadTask() {
      const taskId = this.$route.params.id;
      if (taskId) {
        const task = await this.$store.dispatch({
          type: "loadTask",
          taskId
        });
        this.task = task;
      }
    }
  },
  created() {
    this.loadTask();
  }
};
</script>

