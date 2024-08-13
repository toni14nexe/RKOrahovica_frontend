<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useDebtStore } from '../stores/debts';
import Layout from './Layout.vue';
import { storeToRefs } from 'pinia';

const store = useDebtStore();
const { isLogged, debtsLoading } = storeToRefs(store);
const createDialogOpened = ref(false);
const setOrDeleteDialogOpened = ref(false);
const deleteOrSet = ref();
const name = ref('');
const description = ref('');
const selectedDebt = ref();
const activeNames = ref([]);
const pagination = ref({
  page: 1,
  perPage: 10,
});
const perPageSizes = [
  { value: 10, label: '10 rezultata' },
  { value: 25, label: '25 rezultata' },
  { value: 50, label: '50 rezultata' },
];
const sorting = ref({
  sort: 'desc',
  sortBy: 'relevant',
  sortOption: 'Datum & Status',
});
const sortingOptions = ['Datum & Status', 'Naziv silazno', 'Naziv uzlazno'];
const searchValue = ref('');

onMounted(() => getDebts());

function getDebts() {
  store.getDebts(
    pagination.value.page,
    pagination.value.perPage,
    sorting.value.sort,
    sorting.value.sortBy,
    searchValue.value
  );
}

function createDebt() {
  if (!btnDisabled.value) {
    const date = new Date().toLocaleDateString('hrv-hr');

    store.createNewDebt({
      name: name.value,
      date: date,
      description: description.value,
    });
    setTimeout(() => {
      activeNames.value = [];
      handleClose();
      pagination.value.page = 1;
      getDebts();
    }, 500);
  }
}

function handleClose() {
  name.value = '';
  description.value = '';
  createDialogOpened.value = false;
  setOrDeleteDialogOpened.value = false;
  deleteOrSet.value = undefined;
}

const btnDisabled = computed(() => {
  if (name.value.length < 3 || description.value.length < 3) return true;
  return false;
});

function patchDebt() {
  store.setDebtAsDone(selectedDebt.value._id);
  setTimeout(() => {
    activeNames.value = [];
    handleClose();
    getDebts();
  }, 500);
}

function deleteDebt() {
  store.deleteDebt(selectedDebt.value._id);
  setTimeout(() => {
    activeNames.value = [];
    pagination.value.page = 1;
    handleClose();
    getDebts();
  }, 500);
}

function openSetDeleteDialog(debt, option) {
  selectedDebt.value = debt;
  if (option === 'set') deleteOrSet.value = 'set';
  else deleteOrSet.value = 'delete';
  setOrDeleteDialogOpened.value = true;
}

function handlePageChange(page) {
  activeNames.value = [];
  pagination.value.page = page;
  getDebts();
}

function handlePerPageChange(perPage) {
  activeNames.value = [];
  pagination.value = {
    page: 1,
    perPage: perPage,
  };
  getDebts();
}

function handleSortChange(sort) {
  pagination.value.page = 1;

  if (sort === 'Naziv uzlazno') {
    sorting.value.sort = 'desc';
    sorting.value.sortBy = 'name';
  } else if (sort === 'Naziv silazno') {
    sorting.value.sort = 'asc';
    sorting.value.sortBy = 'name';
  } else {
    sorting.value.sort = 'desc';
    sorting.value.sortBy = 'relevant';
  }
  getDebts();
}

function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const handleSearchInput = debounce(() => {
  pagination.value.page = 1;
  getDebts();
});
</script>

<template>
  <Layout>
    <h2>Dugovanja</h2>

    <div
      v-if="debtsLoading"
      class="loading-container"
      v-loading="debtsLoading"
    />

    <div v-else class="dashboard-container">
      <ElButton
        v-if="isLogged"
        type="primary"
        plain
        @click="createDialogOpened = true"
        ><ElIcon class="margin-right-8" :size="20">
          <CirclePlusFilled />
        </ElIcon>
        Dugovanje
      </ElButton>

      <div
        class="sort-search-container"
        :style="isLogged ? 'margin-top: 22px' : undefined"
      >
        <ElInput
          v-model="searchValue"
          class="search-sort-input"
          placeholder="Pretraži..."
          @input="handleSearchInput"
        />
        <ElSelect
          v-model="sorting.sortOption"
          class="search-sort-input"
          @change="handleSortChange"
        >
          <ElOption v-for="sort in sortingOptions" :label="sort" :value="sort">
          </ElOption>
        </ElSelect>
      </div>

      <ElCollapse v-for="debt in store?.debts?.debts" v-model="activeNames">
        <ElCollapseItem>
          <template #title>
            <p class="margin-right-8">{{ debt.name }}</p>
            <ElTag v-if="debt.done" type="success">Razduženo</ElTag>
            <ElTag v-else type="danger">Dužan</ElTag>
          </template>
          <div>
            <p>
              {{ debt.date }}
              <br />
              {{ debt.description }}
            </p>
            <ElButton
              v-if="isLogged"
              plain
              type="danger"
              @click="openSetDeleteDialog(debt, 'delete')"
            >
              <ElIcon class="margin-right-8" :size="20">
                <DeleteFilled />
              </ElIcon>
              Obriši
            </ElButton>
            <ElButton
              v-if="isLogged && !debt.done"
              plain
              type="success"
              @click="openSetDeleteDialog(debt, 'set')"
            >
              <ElIcon class="margin-right-8" :size="20">
                <SuccessFilled />
              </ElIcon>
              Razduži
            </ElButton>
          </div>
        </ElCollapseItem>
      </ElCollapse>

      <div
        v-if="store?.debts?.total > pagination.perPage"
        class="pagination-container"
      >
        <ElSelect
          v-model="pagination.perPage"
          @change="handlePerPageChange"
          style="width: 130px"
        >
          <ElOption
            v-for="perPage in perPageSizes"
            :value="perPage.value"
            :label="perPage.label"
          />
        </ElSelect>
        <ElPagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.perPage"
          :background="true"
          layout="prev, pager, next"
          :total="store?.debts?.total"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </Layout>

  <ElDialog
    v-model="createDialogOpened"
    title="Novo dugovanje"
    fullscreen
    :before-close="handleClose"
  >
    <ElRow>Dužnik</ElRow>
    <ElRow>
      <ElInput v-model="name" placeholder="Dužnik" @keyup.enter="createDebt" />
    </ElRow>
    <ElRow class="mt-1"><span>Opis dugovanja</span></ElRow>
    <ElRow>
      <ElInput
        v-model="description"
        placeholder="Opis dugovanja"
        @keyup.enter="createDebt"
        type="textarea"
        :autosize="{ minRows: 2 }"
      />
    </ElRow>
    <template #footer>
      <span class="dialog-footer">
        <ElButton plain type="danger" @click="handleClose">Odustani</ElButton>
        <ElButton
          type="primary"
          plain
          @click="createDebt"
          :disabled="btnDisabled"
          >Novo dugovanje
        </ElButton>
      </span>
    </template>
  </ElDialog>

  <ElDialog
    v-model="setOrDeleteDialogOpened"
    :title="deleteOrSet === 'set' ? 'Označi kao razduženo' : 'Obriši dugovanje'"
    fullscreen
    :before-close="handleClose"
  >
    <ElRow>Dužnik: {{ selectedDebt.name }}</ElRow>
    <ElRow>Opis: {{ selectedDebt.description }}</ElRow>
    <ElRow>Datum: {{ selectedDebt.date }}</ElRow>
    <ElRow>
      <span
        :class="{
          'color-green': selectedDebt.done,
          'color-red': !selectedDebt.done,
        }"
      >
        Stanje: {{ selectedDebt.done ? 'Razduženo' : 'Nije razduženo' }}
      </span>
    </ElRow>
    <template #footer>
      <span class="dialog-footer">
        <ElButton
          plain
          :type="deleteOrSet === 'set' ? 'danger' : 'primary'"
          @click="handleClose"
          >Odustani</ElButton
        >
        <ElButton
          v-if="deleteOrSet === 'set'"
          type="primary"
          plain
          @click="patchDebt"
          >Razduži
        </ElButton>
        <ElButton v-else type="danger" plain @click="deleteDebt"
          >Obriši
        </ElButton>
      </span>
    </template>
  </ElDialog>
</template>

<style scoped>
.loading-container {
  height: 90vh;
}
.dashboard-container {
  display: flex;
  flex-direction: column;
  align-content: center;
  margin: auto;
  width: 90%;
  padding-bottom: 60px;
}
.sort-search-container {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  row-gap: 8px;
  flex-wrap: wrap;
  margin: 0 auto 22px auto;
}
.search-sort-input {
  width: 150px;
}
.pagination-container {
  display: flex;
  align-content: center;
  align-items: center;
  justify-items: center;
  justify-content: center;
  gap: 8px;
  row-gap: 22px;
  flex-wrap: wrap;
  margin: 22px auto 0 auto;
}
.color-green {
  color: green;
}
.color-red {
  color: red;
}
.margin-right-8 {
  margin-right: 8px;
}
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
