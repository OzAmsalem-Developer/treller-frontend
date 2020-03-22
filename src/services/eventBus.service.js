import Vue from 'vue'

export const eventBus = new Vue()

// Event names
export const EV_removeList = 'remove-list'
export const EV_saveFailed = 'list-saving-failed'
export const EV_moveTask = 'move-task-event'
export const EV_setTaskLabel = 'set-task-label'
