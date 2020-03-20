<template>
  <section v-if="task" class="task-details">
    <!-- <h1>{{task.name}}</h1> -->
    <textarea
      v-model="editedTask.name"
      class="details-task-name"
      cols="20"
      rows="1"
      @change="updateTaskName"
    />
    <div class="details-container">
      <div class="details-info">
        <section v-if="task.labels.length" class="details-labels">
          <!-- <span>💡</span> -->
          <span class="font-bold">Labels:</span>
          <span class="action-link">Update</span>
          <div class="details-labels-list">
            <!-- <div v-for="label in task.labels" :key="label.id">{{label.txt}}</div> -->
            <!-- <div>{{task.labels.length}}</div> -->
            <labelPreview :labels="task.labels" />
            <button>+</button>
          </div>
        </section>

        <section v-if="task.members" class="details-members">
          <span class="font-bold">Members:</span>
          <span class="action-link" @click="setMembers">Invite</span>
          <div class="details-members-list">
            <!-- <div v-for="member in task.members" :key="member._id">{{member.fullName}}</div> -->
            <member-preview :members="task.members"></member-preview>
            <button class="member-card" @click="setMembers">+</button>
          </div>
        </section>

        <section class="details-due-date">
          <!-- <span>🕖</span> -->
          <span class="font-bold">Due Date:</span>
          <span class="action-link">Update</span>
          <div class="details-due-list">
            <input type="checkbox" name id />
            <span>Calender:</span>
            <span v-if="task.dueDate">{{task.dueDate | minimalDate}}:</span>
          </div>
        </section>

        <section v-if="task.desc" class="details-description">
          <!-- <span>📄</span> -->
          <span class="font-bold">Description:</span>
          <span class="action-link">Edit</span>
          <p>{{task.desc}}:</p>
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
      editedTask: null
    };
  },
  methods: {
    async saveBoard() {
      await this.$store.dispatch({ type: "saveBoard", board: this.board });
      try {
        console.log("CMP: Board Saved Succesfully");
      } catch (prevBoard) {
        this.board = JSON.parse(JSON.stringify(board));
        console.log("Err, board didnt saved");
      }
    },
    async updateTask() {
      await this.$store.dispatch({ type: "updateToy", editedTask });
      try {
      } catch (preTask) {
        this.editedTask = preTask;
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
      console.log("Please set the Members!");
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
    }
  },
  computed: {
    task() {
      return this.$store.getters.currTask;
    }
  },
  created() {
    console.log("Details page loaded successfully");
    this.editedTask = JSON.parse(JSON.stringify(this.task));
    console.log("editedTask", this.editedTask);
    // console.log("Task members:", this.task.members);
  },
  components: {
    memberPreview,
    labelPreview
  }
};
</script>

