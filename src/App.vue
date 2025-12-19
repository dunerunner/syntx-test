<template>
  <el-container style="height: 100vh">
    <el-aside width="260px">
      <SidebarComponent />
    </el-aside>
    <el-container>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import SidebarComponent from './components/SidebarComponent.vue';
</script>
