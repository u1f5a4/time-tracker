import { Meteor } from 'meteor/meteor'
import { TasksCollection } from '/imports/db/TasksCollection'
import '../imports/api/tasksMethods'

const insertTask = (taskText) => TasksCollection.insert({ name: taskText, description: taskText })

Meteor.startup(() => {
  if (TasksCollection.find().count() === 0) {
    ;['First Task', 'Second Task', 'Third Task', 'Fourth Task', 'Fifth Task', 'Sixth Task', 'Seventh Task'].forEach(
      insertTask
    )
  }
})
