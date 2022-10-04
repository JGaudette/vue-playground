<template>
  <div class="home-container">
    👋 Welcome Home

    <div class="tasks">
      <div class="header">Action</div>
      <div class="header">Value</div>
      <div class="header">Notes</div>
      <template :key="task.id" v-for="task in tasks">
        <input type="checkbox" v-model="task.checked" />
        <span>${{task.creditValue}}</span>
        <span>{{task.label}}</span>
      </template>
    </div>

    <div class="danger" v-if="error">{{error}}</div>

    <button @click="submitForm">Submit</button>
  </div>
</template>

<script>
import axios from "axios";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
  name: "Home",
  data() {
    return {
      tasks: [],
      error: ""
    };
  },
  async mounted() {
    let resp = await axios.get("https://jsonplaceholder.typicode.com/todos");
    this.tasks = resp.data.slice(0, 5).map((e) => {
      return { label: e.title, checked: false, creditValue: getRandomInt(0, 10000000) };
    });
  },
  components: {},
  methods: {
    submitForm() {
      this.error = "";

      if (this.tasks.filter((e) => !e.checked).length > 0) {
        this.error = "Please complete all tasks and then submit your work";
        return;
      }

      this.$router.push({ name: "Success" });
    },
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  .tasks {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    .header{
      background-color: lightblue;
    }
  }
}
</style>
