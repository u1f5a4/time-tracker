<template>
  <div className="container">
    <header>
      <div className="app-bar">
        <div className="app-header">
          <h1>⏱️ Time Tracker</h1>
        </div>
      </div>
    </header>

    <div class="main">
      <TaskForm />
            
      <ul class="tasks">
        <Task
            class="task"
            v-for="task in tasks"
            v-bind:key="task._id"
            v-bind:task="task"
        />
      </ul>
    </div>
  </div>
</template>



<script>
import Task from "./components/Task.vue";
import TaskForm from "./components/TaskForm.vue";
import { TasksCollection } from "../db/TasksCollection";

export default {
  components: {
    Task,
    TaskForm
  },

  data() {
    return {};
  },

  methods: {},

  meteor: {
    tasks() {
      const tasks = TasksCollection.find({}, {
        sort: {
          isFinished: 1,  
          createdAt: -1
        } 
      }).fetch()

      const unfinishedTasks = []
      const finishedTasks = tasks
      .filter((task, i) => {
        if (!task.isFinished) unfinishedTasks.push(task)
        return task.isFinished})
      .sort((a, b) => b.updatedAt - a.updatedAt);

      return [...unfinishedTasks, ...finishedTasks];
    }
  }
};
</script>