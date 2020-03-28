<template>
    <section class="board-activities">
        <user-activity v-for="activity in activities" :activity="activity"/>
    </section>
</template>

<script>
import userActivity from '@/cmps/board-cmps/user-activity'

export default {
    props: {
        activities: Array
    },
    components: {
        userActivity
    }
}
</script>