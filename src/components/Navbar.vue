<template>
  <nav>
    <h1>My Vue</h1>
    <ul class="nav-link">
        <li><router-link to="/users/home">Home</router-link></li>
        <li><router-link to="/users/form">Form</router-link></li>
        <li><router-link to="/users/detail">About</router-link></li>
    </ul>
  </nav>
  
</template>

<script>
export default {
    name: 'Navbar'
}
</script>

<style  scoped>
nav {
    background-color: #333;
    color: #fff;
    padding: 20px;
    height: 100px;
    
    
}

nav ul.nav-link {
    display: flex;
    justify-content: space-around;
    align-items: center;
    list-style: none;
    padding: 0;
}

nav ul.nav-link a {
    color: #ffffff;
    text-decoration: none;

}

nav ul.nav-link a:hover {
   color: #fffdb6;
}

</style>