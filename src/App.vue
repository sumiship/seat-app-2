<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">EditName</router-link>
      <router-link to="/create">Create</router-link>
      <router-link to="/EditGroup">EditGroup</router-link>
    </div>
    <router-view />
  </div>
</template>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  user-select: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  display: flex;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  display: block;
  width: 50%;
  padding: 30px 0;
  text-decoration: none;
  font-size: 1.4rem;
  border: #42b983 solid 1px;
}

#nav a:hover {
  background-color: #9bd4bb;
  transition: 0.7s;
}

#nav a.router-link-exact-active {
  background-color: #42b983;
}
</style>
