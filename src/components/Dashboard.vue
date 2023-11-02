<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useDebtStore } from '../stores/debts'
import cookie from 'vue-cookies';
import Login from './Login.vue'
import { storeToRefs } from 'pinia';

const store = useDebtStore()
const { isLogged, debtsLoading } = storeToRefs(store)
const url = "https://media.beliefnet.com/~/media/photos-with-attribution/faith/faith-christian-bible-arms-sky-clouds_credit-shutterstock.jpg"
const createDialogOpened = ref(false)
const setOrDeleteDialogOpened = ref(false)
const deleteOrSet = ref()
const name = ref('')
const description = ref('')
const selectedDebt = ref()
const showDashboard = ref(true)

onMounted( () => store.getDebts())

watch(
  () => isLogged.value,
  (value) => {
    if(value) showDashboard.value = true
  }
)

function createDebt() {
  if (!btnDisabled.value) {
    const date = new Date().toLocaleDateString('hrv-hr')

    store.createNewDebt({
      name: name.value,
      date: date,
      description: description.value
    })

    handleClose()
  }
}

function handleClose() {
  name.value = ''
  description.value = ''
  createDialogOpened.value = false;
  setOrDeleteDialogOpened.value = false;
  deleteOrSet.value = undefined
}

const btnDisabled = computed(() => {
  if (name.value.length < 3 || description.value.length < 3)
    return true
  return false
})

function logout() {
  cookie.remove('authorization')
  isLogged.value = false;
  location.reload()
}

function patchDebt() {
  store.setDebtAsDone(selectedDebt.value._id)
  handleClose()
}

function deleteDebt() {
  store.deleteDebt(selectedDebt.value._id)
  handleClose()
}

function openSetDeleteDialog(debt, option) {
  selectedDebt.value = debt
  if(option === 'set') deleteOrSet.value = 'set'
  else deleteOrSet.value = 'delete'
  setOrDeleteDialogOpened.value = true
}
</script>

<template>
    <div v-if="showDashboard">
      <div>
        <el-image class="image" :src="url" />
        <div v-if="isLogged">
          <el-button
            class="btn-margin-fix"
            type="primary"
            plain
            @click="createDialogOpened = true"
            >Novo dugovanje
          </el-button>
          <el-button
            class="btn-margin-fix"
            type="danger"
            plain
            @click="logout"
            >Odjavi se
          </el-button>
        </div>
        <el-table
          class="mt-1"
          :data="store?.debts?.debts" border
          :default-sort="{ prop: 'date', order: 'ascending' }"
          v-loading="debtsLoading"
        >
          <el-table-column prop="name" label="Dužnik" sortable="" />
          <el-table-column prop="description" label="Opis" />
          <el-table-column prop="date" label="Datum" :width="110" align="center" sortable="" />
          <el-table-column prop="done" label="Status" :width="93" align="center" sortable="">
            <template #default="data">
              <el-icon :size="20">
                <SuccessFilled color="green" v-if="data?.row?.done" />
                <CircleCloseFilled color="red" v-else />
              </el-icon>
            </template>
          </el-table-column>
          <el-table-column v-if="isLogged" prop="date" label="Opcije" :width="70" align="center">
            <template #default="data">
              <el-row>
                <el-col :span="8">
                  <el-tooltip
                    v-if="!data.row.done"
                    content="Označi kao razduženo"
                    placement="top-start"
                  >
                    <el-icon class="hover-patch" :size="20" @click="openSetDeleteDialog(data.row, 'set')">
                      <SuccessFilled />
                    </el-icon>
                  </el-tooltip>
                  <div v-else />
                </el-col>
                <el-col :span="8" :offset="8">
                  <el-tooltip
                    content="Obriši dugovanje"
                    placement="top-start"
                  >
                    <el-icon class="hover-delete" :size="20" @click="openSetDeleteDialog(data.row, 'delete')">
                      <DeleteFilled />
                    </el-icon>
                  </el-tooltip>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <Login v-else />
    <el-row class="mt-3" justify="center" align="middle">
      <el-col v-if="!isLogged" @click="showDashboard = !showDashboard" class="link">
        {{ `Go to ${showDashboard ? 'login' : 'dashboard'}` }}
      </el-col>
    </el-row>

    <el-dialog
      v-model="createDialogOpened"
      title="Novo dugovanje"
      :before-close="handleClose"
    >
      <el-row><span>Dužnik</span></el-row>
      <el-row>
        <el-input v-model="name" placeholder="Dužnik" @keyup.enter="createDebt" />
      </el-row>
      <el-row class="mt-1"><span>Opis dugovanja</span></el-row>
      <el-row>
        <el-input v-model="description" placeholder="Opis dugovanja" @keyup.enter="createDebt" />
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button plain @click="handleClose">Odustani</el-button>
          <el-button
            class="btn-margin-fix"
            type="primary"
            plain
            @click="createDebt"
            :disabled="btnDisabled"
            >Stori dugovanje
          </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="setOrDeleteDialogOpened"
      :title="deleteOrSet === 'set' ? 'Označi kao razduženo' : 'Obriši dugovanje'"
      :before-close="handleClose"
    >
      <el-row>Dužnik: {{ selectedDebt.name }}</el-row>
      <el-row>Opis: {{ selectedDebt.description }}</el-row>
      <el-row>Datum: {{ selectedDebt.date }}</el-row>
      <el-row>
        <span :class="{ 'color-green': selectedDebt.done, 'color-red': !selectedDebt.done }">
          Stanje: {{ selectedDebt.done ? 'Razduženo' : 'Nije razduženo' }}
        </span>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button plain @click="handleClose">Odustani</el-button>
          <el-button
            v-if="deleteOrSet === 'set'"
            class="btn-margin-fix"
            type="primary"
            plain
            @click="patchDebt"
            >Razduži
          </el-button>
          <el-button
            v-else
            class="btn-margin-fix"
            type="danger"
            plain
            @click="deleteDebt"
            >Obriši
          </el-button>
        </span>
      </template>
    </el-dialog>
</template>

<style scoped>
.image {
  width: 800px;
}
.btn-margin-fix {
  margin-top: 20px;
  margin-bottom: 15px;
}
.hover-patch:hover {
  color: green;
  cursor: pointer;
}
.hover-delete:hover {
  color: red;
  cursor: pointer;
}
.color-green {
  color: green;
}

.color-red {
  color: red;
}

.link:hover {
  color: #ffffff;
  cursor: pointer;
  text-decoration: underline;
}
</style>
