<script setup>
import { ref } from 'vue';
import { useDebtStore } from '../stores/debts';
import { storeToRefs } from 'pinia';
import router from '../router/index';
import cookie from 'vue-cookies';

const store = useDebtStore();
const { isLogged } = storeToRefs(store);

function handleButton() {
  if (isLogged.value) logout();
  else router.push('/login');
}

function logout() {
  cookie.remove('authorization');
  isLogged.value = false;
  router.push('/');
}
</script>

<template>
  <ElRow class="header" justify="center" align="middle">
    <ElCol :span="12" align="start">
      <ElRow align="middle">
        <div class="dashboard-link-wrapper" @click="router.push('/')">
          <img class="image" src="/rk-orahovica.ico" />
          <p>Sveta Knjiga</p>
        </div>
      </ElRow>
    </ElCol>
    <ElCol :span="12" align="end">
      <ElButton
        @click="handleButton"
        plain
        :type="!isLogged ? 'primary' : 'danger'"
      >
        {{ !isLogged ? 'Prijavi se' : 'Odjavi se' }}
      </ElButton>
    </ElCol>
  </ElRow>
</template>

<style scoped>
.header {
  width: 100%;
  padding: 10px 5%;
  background-color: rgba(0, 0, 0, 0.333);
}
.dashboard-link-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.image {
  width: 28px;
  height: 28px;
  margin-right: 8px;
}
</style>
