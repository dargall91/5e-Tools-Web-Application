<template>
  <NavigationBar />
  <div class="container">
    <RouterView />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import NavigationBar from './components/NavigationBar.vue';
import LoginForm from './components/LoginForm.vue';

@Options({
  components: {
    NavigationBar,
    LoginForm
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
