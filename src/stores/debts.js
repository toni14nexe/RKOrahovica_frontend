import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import cookie from 'vue-cookies';
import { ElNotification } from 'element-plus';

const apiLink = import.meta.env.VITE_API_LINK;

export const useDebtStore = defineStore('debts', () => {
  const debts = ref([]);
  const debtsLoading = ref(true);
  const isLogged = ref(false);

  function getDebts() {
    axios
      .get(`${apiLink}/debts`)
      .then((response) => {
        debts.value = response.data;
        debtsLoading.value = false;
        if (cookie.get('authorization')) isLogged.value = true;
        else isLogged.value = false;
      })
      .catch((error) => {
        console.error(error);
        errorNotification(error?.message);
      });
  }

  function login(username, password) {
    axios
      .post(`${apiLink}/users/login`, {
        username: username,
        password: password,
      })
      .then((response) => {
        cookie.set('authorization', response.data.user.token, '1h');
        isLogged.value = true;
      })
      .catch((error) => {
        console.error(error);
        errorNotification(error?.message);
      });
  }

  function createNewDebt(debtData) {
    const token = cookie.get('authorization');

    axios
      .post(`${apiLink}/debts`, debtData, {
        headers: {
          Authorization: `token ${token}`,
        },
      })
      .then((response) => {
        getDebts();
        successNotification('Dugovanje uspješno kreirano');
      })
      .catch((error) => {
        console.error(error);
        errorNotification(error?.message);
      });
  }

  function setDebtAsDone(debtId) {
    const token = cookie.get('authorization');

    axios
      .patch(`${apiLink}/debts/${debtId}`, undefined, {
        headers: {
          Authorization: `token ${token}`,
        },
      })
      .then((response) => {
        getDebts();
        successNotification('Dugovanje uspješno razduženo');
      })
      .catch((error) => {
        console.error(error);
        errorNotification(error?.message);
      });
  }

  function deleteDebt(debtId) {
    const token = cookie.get('authorization');

    axios
      .delete(`${apiLink}/debts/${debtId}`, {
        headers: {
          Authorization: `token ${token}`,
        },
      })
      .then((response) => {
        getDebts();
        successNotification('Dugovanje uspješno obrisano');
      })
      .catch((error) => {
        console.error(error);
        errorNotification(error?.message);
      });
  }

  function successNotification(message) {
    ElNotification({
      type: 'success',
      message: message,
      duration: 2500,
    });
  }

  function errorNotification(message) {
    ElNotification({
      type: 'error',
      message: message || 'Something went wrong',
      duration: 4000,
    });
  }

  return {
    debts,
    debtsLoading,
    isLogged,
    getDebts,
    login,
    createNewDebt,
    setDebtAsDone,
    deleteDebt,
  };
});
