<script setup>
import { computed, ref, onMounted } from 'vue';
import { useDebtStore } from '../stores/debts';
import router from '../router/index';
import Layout from './Layout.vue';
import cookie from 'vue-cookies';
import { storeToRefs } from 'pinia';

const store = useDebtStore();
const { isLogged } = storeToRefs(store);
const username = ref('');
const password = ref('');

onMounted(() => logout());

function logout() {
  cookie.remove('authorization');
  isLogged.value = false;
}

function login() {
  if (!btnDisabled.value) store.login(username.value, password.value);
}

const btnDisabled = computed(() => {
  if (username.value.length < 4 || password.value.length < 4) return true;
  return false;
});
</script>

<template>
  <Layout>
    <div class="login-container">
      <ElRow justify="center" align="middle"> Administratorska prijava </ElRow>
      <ElRow class="mt-1" justify="center" align="middle">
        <ElInput
          v-model="username"
          class="input"
          placeholder="Username"
          @keyup.enter="login"
        />
      </ElRow>
      <ElRow class="mt-1" justify="center" align="middle">
        <ElInput
          v-model="password"
          class="input"
          type="password"
          placeholder="Password"
          @keyup.enter="login"
        />
      </ElRow>
      <ElRow class="mt-1" justify="center" align="middle">
        <ElButton type="danger" plain @click="router.push('/')">
          <ElIcon class="margin-right-8" :size="20">
            <Back />
          </ElIcon>
          Nazad
        </ElButton>
        <ElButton type="primary" plain @click="login" :disabled="btnDisabled">
          Prijava
          <ElIcon class="margin-left-8" :size="20">
            <Right />
          </ElIcon>
        </ElButton>
      </ElRow>
    </div>
  </Layout>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  margin: auto;
  width: 90%;
  margin-top: 22px;
}
.input {
  min-width: auto;
  max-width: 300px;
}
.margin-right-8 {
  margin-right: 8px;
}
.margin-left-8 {
  margin-left: 8px;
}
</style>
