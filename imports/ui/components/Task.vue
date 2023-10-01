<template>
  <li>
    <div class="text-container">
      <span v-bind:class="{finished: this.task.isFinished}" class="name">name: {{ this.task.name }}</span>
      <span v-bind:class="{finished: this.task.isFinished}" class="description">description: {{ this.task.description }}</span>

      <span v-if="this.task.timerId" v-bind:class="{finished: this.task.isFinished}" class="time">timer: {{ duration }}</span>
    </div>


    <div class="button-container">
      <div class="button-row">
        <button v-if="!this.task.isFinished" class="finish-button" @click="finishThisTask">✓</button>
        <button class="delete-button" @click="deleteThisTask">×</button>
      </div>

      <div v-if="!this.task.isFinished" class="button-row">
        <button v-if="this.timer && this.timer.status === 'run'" class="pause-button" @click="pauseThisTimer">Pause track</button>
        <button v-else class="run-button" @click="runThisTimer">Run track</button>
      </div>
    </div>
  </li>
</template>



<script>
import { Meteor } from 'meteor/meteor';
import { TimersCollection } from "../../db/TimersCollection";

export default {
  props: {
    task: {
      type: Object,
      required: true
    }
  },

  // this.task = {
  //   _id: string,
  //
  //   name: string,
  //   description: string,
  //
  //   timerId?: string,
  //   isFinished?: boolan,
  //
  //   createdAt: Date,
  //   updatedAt?: Date,
  // }

  // this.timer = {
  //   taskId: string,
  //
  //   status: 'run' | 'pause',
  //   duration: number,
  //
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // }

  data() {
    return {
      intervalId: null,
      virtualDuration: null
    };
  },

  mounted() {
    console.log('this.task', this.task);
    console.log('this.timer', this.timer);

    if (!this.timer) return

    this.virtualDuration =  this.timer.duration

    if (this.timer.status === 'run') {
      this.virtualDuration = new Date().getTime() - this.timer.updatedAt.getTime() + this.timer.duration
      this.startInterval()
    }
  },

  beforeDestroy() {
    this.stopInterval()
  },

  computed: {
    duration() {
      if (!this.virtualDuration) return '00:00:00'

      return this.convertMsToTimer(this.virtualDuration) 
    },
  },

  meteor: {
    timer() {
      if (!this.task.timerId) return

      const timers = TimersCollection.find({ _id: this.task.timerId }).fetch();
      const timer = timers[0]
      return timer
    }
  },

  methods: {

    // ====== Task buttons ======

    finishThisTask() {
      Meteor.call('tasks.setIsFinished', this.task._id);
      this.stopInterval()
    },

    deleteThisTask() {
      Meteor.call('tasks.remove', this.task._id);
      this.stopInterval()
    },

    // ====== Timer buttons ======

    runThisTimer() {
      Meteor.call('tasks.startTimer', this.task._id);
      this.startInterval()
    },

    pauseThisTimer() {
      Meteor.call('tasks.pauseTimer', this.task._id)
      this.stopInterval()
    },

    // ====== Interval Timer ======

    startInterval() {
      this.intervalId = setInterval(() => {
        this.virtualDuration += 1000;
      }, 1000);
    },

    stopInterval() {
      clearInterval(this.intervalId);
    },

    // ====== Other ======

    convertMsToTimer(ms) {
      const padStartTwo = (number) => number.toString().padStart(2, '0')

      const duration = ms / 1000
      const hours = Math.floor(duration / 3600)
      const minutes = Math.floor((duration - hours * 3600) / 60)
      const seconds = Math.floor(duration - hours * 3600 - minutes * 60)

      return `${padStartTwo(hours)}:${padStartTwo(minutes)}:${padStartTwo(seconds)}`
    }
  }
};
</script>

<style scoped>
.text-container { 
  display: flex;
  flex-direction: column;
  width: 100%;
}

.description {
  font-size: 0.8em;
  color: #999;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.button-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: flex-end;
}

.pause-button {
  background-color: #f1c40f;
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 0.8em;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
}

.run-button {
  background-color: #2ecc71;
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 0.8em;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
}

</style>