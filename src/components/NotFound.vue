<script setup></script>

<template>
  <el-row align="middle">
    <el-col class="not-found-margine">Stranica nije pronađena</el-col>
    <el-col><router-link to="/">Natrag na glavnu stranicu</router-link></el-col>
  </el-row>
</template>

<style scoped>
.not-found-margine {
  margin-top: 50px;
}
</style>
