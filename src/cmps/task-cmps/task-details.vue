<template>
  <section class="task-details">
    <h1>{{task.name}}</h1>

    <section v-if="task.labels" class="details-labels">
      <span>Labels:</span>
      <span>Update</span>
      <div class="details-labels-list">
        <div v-for="label in labels" :key="label.id">{{label.txt}}</div>
        <button>+</button>
      </div>
    </section>

    <section v-if="task.members" class="details-members">
      <span>Members:</span>
      <span>Invite</span>
      <div class="details-members-list">
        <div v-for="member in task.members" :key="member.id">{{member.fullName}}</div>
        <button>+</button>
      </div>
    </section>

    <section class="details-due-date">
      <button>[]</button>
      <span>Calender:</span>
      <span v-if="task.dueDate">{{task.dueDate | minimalDate}}:</span>
    </section>

    <section v-if="task.description" class="details-description">
      <span>Description:</span>
      <span>Edit</span>
      <p>{{task.description}}:</p>
    </section>

    <section v-if="task.checklist" class="details-checklist">
      <span>{{task.checklist}}</span>
      <ul class="details-checklist-items">
        <li v-for="item in task.checklist" :key="item.id"></li>
      </ul>
      <input class="checklist-add-item" type="text" placeholder="add an item" />
    </section>

    <section class="details-discussion">
      <span>Discussion:</span>
      <input class="discussion-add-item" type="text" placeholder="Write a comment" />
      <ul v-if="task.comments.length" class="discussion-cmts">
        <li v-for="cmt in comments" :key="cmt.id">
          <span>{{cmt.from}}</span>
          <span>{{cmt.txt}}</span>
          <span>{{cmt.createdAt}}</span>
        </li>
      </ul>
    </section>
    <section class="details-actions">
      <button>Move</button>
      <button>Copy</button>
      <button>Labels</button>
      <button>Members</button>
      <button>Due Date</button>
      <button>Description</button>
      <button>Checklist</button>
      <button>Attachments</button>
      <button>Comments</button>
    </section>
  </section>
</template>

<script>
export default {
  props: {
    task: Object
  },
  created() {
    console.log('Details page loaded successfully')
  }
};
</script>

