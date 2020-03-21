<template>
  <section v-if="task" class="task-details">
    <div class="task-details-header">
      <textarea
        v-model="editedTask.name"
        class="details-title details-text-area"
        cols="20"
        rows="1"
        @change="updateTask"
      />
      <button class="close-details-btn">✖️</button>
    </div>
    <div class="details-container">
      <div class="details-info">
        <section v-if="task.labels.length" class="details-labels">
          <!-- <span>💡</span> -->
          <span class="font-bold">Labels:</span>
          <span class="action-link">Update</span>
          <div class="details-labels-list">
            <labelPreview :labels="task.labels" />
            <button>+</button>
          </div>
        </section>

        <section v-if="task.members" class="details-members">
          <span class="font-bold">Members:</span>
          <span class="action-link" @click="setMembers">Invite</span>
          <div class="details-members-list">
            <member-preview :members="task.members"></member-preview>
            <button class="member-card" @click="setMembers">+</button>
          </div>
        </section>

        <section class="details-due-date">
          <!-- <span>🕖</span> -->
          <span class="font-bold">Due Date:</span>
          <span class="action-link">Update</span>
          <div class="details-due-list">
            <input type="checkbox" />
            <input v-model="currDueDate" @change="setDueDate" type="date" />
            <span v-if="task.dueDate">{{task.dueDate | minimalDate}}:</span>
          </div>
        </section>

        <section v-if="task.desc" class="details-description">
          <!-- <span>📄</span> -->
          <div>
            <span class="font-bold">Description:</span>
            <span class="action-link">Edit</span>
          </div>
          <textarea
            v-model="editedTask.desc"
            @change="updateTask"
            class="details-text-area details-desc-input"
          />
        </section>

        <section v-if="task.checklist" class="details-checklist">
          <span class="font-bold">{{task.checklist.title}}</span>
          <span class="action-link">remove</span>
          <ul class="details-checklist-items clean-items">
            <li v-for="item in task.checklist.todos" :item="item" :key="item.id">{{item.txt}}</li>
          </ul>
          <input class="checklist-add-item" type="text" placeholder="add an item" />
        </section>

        <section class="details-discussion">
          <div>
            <!-- <span>💬</span> -->
            <span class="font-bold">Discussion:</span>
            <span class="action-link">hide activity feed</span>
          </div>
          <input class="discussion-add-item" type="text" placeholder="Write a comment" />
          <ul v-if="task.comments.length" class="discussion-cmts clean-items">
            <li v-for="cmt in task.comments" :key="cmt.id">
              <span class="font-bold">{{cmt.from}}:</span>
              <span>{{cmt.txt}}</span>
              <span>{{cmt.createdAt | minimalDate}}</span>
            </li>
          </ul>
        </section>
      </div>

      <section class="details-actions">
        <button @click="moveTask">Move</button>
        <button @click="copyTask">Copy</button>
        <button @click="setLabels">Labels</button>
        <button @click="setMembers">Members</button>
        <button @click="setDueDate">Due Date</button>
        <button @click="updateDescription">Description</button>
        <button @click="updateChecklist">Checklist</button>
        <button @click="sendAttachment">Attachments</button>
        <button @click="sendComment">Comments</button>
      </section>
    </div>
  </section>
</template>

<script>
import memberPreview from "@/cmps/task-cmps/previews/member-preview.vue";
import labelPreview from "@/cmps/task-cmps/previews/label-preview.vue";

export default {
  data() {
    return {
      editedTask: null,
      currDueDate: null
    };
  },
  methods: {
    async updateTask() {
      await this.$store.dispatch({ type: "updateTask", task: this.editedTask });
      try {
        console.log("Saved");
      } catch (prevTask) {
        this.editedTask = prevTask;
        console.log("Err, failed to save task");
      }
    },
    moveTask() {
      console.log("Please move the Task!");
    },
    copyTask() {
      console.log("Please copy the Task!");
    },
    updateTaskName() {
      console.log("I will updated th task name!");
    },
    setLabels() {
      console.log("Please set the Labels!");
    },
    setMembers() {
      console.log("Please set the Members!");
    },
    setDueDate() {
      this.editedTask.dueDate = JSON.parse(JSON.stringify(this.currDueDate));
      this.updateTask();
    },
    updateDescription() {
      console.log("Please update the Description!");
    },
    updateChecklist() {
      console.log("Please update the Checklist!");
    },
    sendAttachment() {
      console.log("Please send this Attachments!");
    },
    sendComment() {
      console.log("Please send this Comment!");
    },
    getCurrDueDate() {
      var day = new Date(this.editedTask.dueDate).getDate();
      var month = new Date(this.editedTask.dueDate).getMonth() + 1;
      var year = new Date(this.editedTask.dueDate).getFullYear();
      if (day < 10) {
        day = "0" + day;
      }
      if (month < 10) {
        month = "0" + month;
      }
      this.currDueDate = `${year}-${month}-${day}`;
    }
  },
  computed: {
    task() {
      return this.$store.getters.currTask;
    }
  },
  created() {
    this.editedTask = JSON.parse(JSON.stringify(this.task));
    if (this.editedTask) {
      this.getCurrDueDate();
    }
  },
  components: {
    memberPreview,
    labelPreview
  }
};
</script>