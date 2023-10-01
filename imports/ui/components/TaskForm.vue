<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <input
        type="text"
        placeholder="Name"
        v-model="name"
        
        v-bind:class="{ error: nameError }"
        @input="() => validate('name')"
    />

    <input
        type="text"
        placeholder="Description"
        v-model="description"
        
        v-bind:class="{ error: descriptionError }"
        @input="() => validate('description')"
    />

    <button type="submit">Add Task</button>
  </form>
</template>



<script>
import { Meteor } from 'meteor/meteor';

const isEmpty = (value) => value.trim().length === 0

export default {
  data() {
    return {
      name: "",
      nameError: false,
      description: "",
      descriptionError: false,
    }
  },

  methods: {
    handleSubmit(event) {
      if (isEmpty(this.name)) this.nameError = true
      if (isEmpty(this.description)) this.descriptionError = true
      if (this.nameError || this.descriptionError) return
  

      Meteor.call('tasks.insert', this.name.trim(), this.description.trim());

      this.name = "";
      this.description = "";
    },

    validate(field) {
      this[`${field}Error`] = isEmpty(this[field])
    }
  },
}
</script>