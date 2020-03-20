<template>
  <transition name="fade">
    <section class="task-menu">
        <div class="menu-action" v-for="(n, idx) in 4" :key="idx">
            {{idx}}
        </div>
    </section>
  </transition>
</template>

<script>
export default {
};
</script>

<style>
</style>