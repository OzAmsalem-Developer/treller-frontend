<template>
  <section class="task-details">
    <h1>{{task.name}}</h1>

    <pre>{{task}}</pre>
    <section v-if="task.labels.length" class="details-labels">
      <span>Labels:</span>
      <span>Update</span>
      <div class="details-labels-list">
        <!-- <div v-for="label in task.labels" :key="label.id">{{label.txt}}</div> -->
        <div>{{task.labels.length}}</div>
        <button>+</button>
      </div>
    </section>

    <section v-if="task.members" class="details-members">
      <span>Members:</span>
      <span>Invite</span>
      <div class="details-members-list">
        <div v-for="member in task.members" :key="member._id">{{member.fullName}}</div>
        <button>+</button>
      </div>
    </section>

    <section class="details-due-date">
      <span>Due Date:</span>
      <span>Update</span>
      <button>[]</button>
      <span>Calender:</span>
      <span v-if="task.dueDate">{{task.dueDate | minimalDate}}:</span>
    </section>

    <section v-if="task.desc" class="details-description">
      <span>Description:</span>
      <span>Edit</span>
      <p>{{task.desc}}:</p>
    </section>

    <section v-if="task.checklist" class="details-checklist">
      <span>{{task.checklist.title}}</span>
      <span>remove</span>
      <ul class="details-checklist-items">
        <li v-for="item in task.checklist.todos" :item="item" :key="item.id">{{item.txt}}</li>
      </ul>
      <input class="checklist-add-item" type="text" placeholder="add an item" />
    </section>

    <section class="details-discussion">
      <span>Discussion:</span>
      <span>hide activity feed</span>
      <input class="discussion-add-item" type="text" placeholder="Write a comment" />
      <ul v-if="task.comments.length" class="discussion-cmts">
        <li v-for="cmt in task.comments" :key="cmt.id">
          <span>{{cmt.from.fullName}}</span>
          <span>{{cmt.txt}}</span>
          <span>{{cmt.createdAt}}</span>
        </li>
      </ul>
    </section>

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
  </section>
</template>

<script>
export default {
  methods: {
    moveTask() {
      console.log("Please move the Task!");
    },
    copyTask() {
      console.log("Please copy the Task!");
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
  created() {
    console.log("Details page loaded successfully");
  },
  props: {
    task: Object
  }
};
</script>

