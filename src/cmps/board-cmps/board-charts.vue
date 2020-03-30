<template>
<section>
<div @click="$emit('closed')" class="div-screen center-flex"></div>
   <section class="board-charts">
       <button class="close-btn" @click="$emit('closed')">
           <i class="fas fa-times" aria-hidden="true"></i></button>
       <boardStatistics />
   </section>
</section>
</template>

<script>
import boardStatistics from '@/cmps/board-cmps/board-statistic'
export default {

    components: {
        boardStatistics
    }
}
</script>

<style>

</style>