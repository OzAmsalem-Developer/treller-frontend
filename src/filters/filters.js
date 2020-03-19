import moment from 'moment'
import Vue from 'vue'

Vue.filter('capitalize', (str)=>{
    return str[0].toUpperCase() + str.slice(1)
})

Vue.filter('price', (num)=>{
    return '$' + num
})

Vue.filter('date', (timestamp)=>{
    return moment(new Date(timestamp)).fromNow();
})