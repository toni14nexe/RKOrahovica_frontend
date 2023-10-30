<script setup>
import { computed, ref } from 'vue'
import { useDebtStore } from '../stores/debts'

const store = useDebtStore()
const username = ref('')
const password = ref('')

function login() {
  if (!btnDisabled.value)
    store.login(username.value, password.value)
}

const btnDisabled = computed(() => {
  if (username.value.length < 4 || password.value.length < 4)
    return true
  return false
})
</script>

<template>
  <el-row justify="center" align="middle">
    Administratorska prijava
  </el-row>
  <el-row class="mt-1"  justify="center" align="middle">
    <el-input v-model="username" placeholder="Username" @keyup.enter="login" />
  </el-row>
  <el-row class="mt-1"  justify="center" align="middle">
    <el-input v-model="password" type="password" placeholder="Password" @keyup.enter="login" />
  </el-row>
  <el-row class="mt-1" justify="center" align="middle">
    <el-button type="primary" plain @click="login" :disabled="btnDisabled">Prijava</el-button>
  </el-row>
</template>

<style scoped>
</style>