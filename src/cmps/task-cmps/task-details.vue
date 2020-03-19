<template>
  <section v-if="task" class="task-details">
    <h1>{{task.name}}</h1>

    <section v-if="task.labels" class="task-labels">
      <span>Labels:</span>
      <span>Update</span>
      <div class="members-list">
        <div v-for="label in labels" :key="label.id">{{label.txt}}</div>
        <button>+</button>
      </div>
    </section>

    <section v-if="task.members" class="task-members">
      <span>Members:</span>
      <span>Invite</span>
      <div class="members-list">
        <div v-for="member in task.members" :key="member.id">{{member.fullName}}</div>
        <button>+</button>
      </div>
    </section>

    <section class="task-due-date">
      <button>[]</button>
      <span>Calender:</span>
      <span v-if="task.dueDate">{{task.dueDate}}:</span>
    </section>

    <section v-if="task.description" class="task-description">
      <span>Description:</span>
      <span>Edit</span>
      <p>{{task.description}}:</p>
    </section>

    <section v-if="task.checklist" class="task-checklist-">
      <span>{{task.checklist}}</span>
      <ul class="task-checklist-items">
        <li v-for="item in task.checklist" :key="item.id"></li>
      </ul>
      <input class="checklist-add-item" type="text" placeholder="add an item" />
    </section>

    <section class="task-discussion">
      <span>Discussion:</span>
      <input class="checklist-add-item" type="text" placeholder="Write a comment" />
      <ul v-if="task.comments.length" class="discussion-cmts">
        <li v-for="cmt in comments" :key="cmt.id">
          <span>{{cmt.from}}</span>
          <span>{{cmt.txt}}</span>
          <span>{{cmt.createdAt}}</span>
        </li>
      </ul>
    </section>
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
    // this.loadTask();
  }
};
</script>

