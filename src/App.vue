<template>
  <el-container class="layout">
    <el-header style="font-size: 40px; background-color: rgb(238, 241, 246)">Quiz后台管理</el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu default-active="1-1">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>系统信息管理</template>
            <el-menu-item index="1-1">
              <router-link to="/user">用户管理</router-link>
            </el-menu-item>
            <el-menu-item index="1-2">
              <router-link to="/question">题目管理</router-link>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}
.layout {
  height: 100%;
}
.el-header {
  display: flex;
  align-items: center;
}
</style>
