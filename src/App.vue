<template>
  <form>
    <Navbar/>
    <router-view />
  
  </form>
  
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,

  },
 

}
</script>

<style>

</style>
