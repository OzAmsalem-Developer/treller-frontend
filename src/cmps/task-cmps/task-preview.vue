<template>
  <section class="task-preview">
      <section v-if="task.labels.length" class="task-label">
        <div class="task-label" 
        v-for="label in task.labels" :key="label.id"
        :style="{backgroundColor: label.color}">
          <span>{{label.txt}}</span>
        </div>
      </section>
      <h2 class="task-title">{{task.name}}</h2>
      <section class="task-indications">
        <div v-if="task.dueDate">
          <span class="task-due-date">
            {{task.dueDate | date}}
          </span>
        </div>
      </section>
  </section>
</template>

<script>
export default {
  props: {
    task: Object
  },
  created(){
    console.log(this.task.dueDate);
    
  }
 

}
</script>