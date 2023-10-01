import { check } from 'meteor/check'
import { TasksCollection } from '../db/TasksCollection'
import { TimersCollection } from '../db/TimersCollection'

Meteor.methods({
  'tasks.insert'(name, description) {
    check(name, String)
    check(description, String)

    TasksCollection.insert({
      name,
      description,
      createdAt: new Date(),
    })
  },

  'tasks.remove'(taskId) {
    check(taskId, String)

    TasksCollection.remove(taskId)
    TimersCollection.remove({ taskId })
  },

  'tasks.setIsFinished'(taskId) {
    check(taskId, String)

    // if has timer, pause it
    const nowUpdatedAt = new Date()
    const timer = TimersCollection.findOne({ taskId })

    if (timer) {
      TimersCollection.update(timer._id, {
        $set: {
          status: 'pause',
          duration: nowUpdatedAt - timer.updatedAt + timer.duration,
          updatedAt: nowUpdatedAt,
        },
      })
    }

    // set task isFinished
    TasksCollection.update(taskId, {
      $set: {
        isFinished: true,
        updatedAt: new Date(),
      },
    })
  },

  // ====== Timer Methods ======

  'tasks.startTimer'(taskId) {
    check(taskId, String)

    const task = TasksCollection.findOne({ _id: taskId })

    // if has timer, just start it
    if (task.timerId) {
      TimersCollection.update(task.timerId, {
        $set: {
          status: 'run',
          updatedAt: new Date(),
        },
      })

      return
    }

    // if not, create a new timer
    const newTimerId = TimersCollection.insert({
      taskId,
      status: 'run',
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    TasksCollection.update(taskId, {
      $set: {
        timerId: newTimerId,
        updatedAt: new Date(),
      },
    })
  },

  'tasks.pauseTimer'(taskId) {
    check(taskId, String)

    const nowUpdatedAt = new Date()
    const timer = TimersCollection.findOne({ taskId })

    TimersCollection.update(timer._id, {
      $set: {
        status: 'pause',
        duration: nowUpdatedAt - timer.updatedAt + timer.duration,
        updatedAt: nowUpdatedAt,
      },
    })
  },
})
