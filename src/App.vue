<template>
  <router-view />
</template>

<style>
* {
  box-sizing: border-box;
}
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #f4f5f7;
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, 'Microsoft YaHei', sans-serif;
}

/* 防止横向滚动条 */
#app {
  width: 100%;
  overflow-x: hidden;
}
</style>