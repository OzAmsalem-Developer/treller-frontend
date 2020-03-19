import moment from 'moment'
import Vue from 'vue'

Vue.filter('capitalize', (str)=>{
    return str[0].toUpperCase() + str.slice(1)
})

Vue.filter('dateAgo', (timestamp)=>{
    return moment(new Date(timestamp)).fromNow()
})