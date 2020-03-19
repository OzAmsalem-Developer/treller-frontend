<template>
  <section class="task-preview">
      <h1>{{task.name}}</h1>
      <pre>{{task}}</pre>
  </section>
</template>

<script>
export default {
  props: {
    task: Object
  }

}
</script>