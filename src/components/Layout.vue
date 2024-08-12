<script setup>
import Header from './Header.vue';
import Footer from './Footer.vue';
import { ref } from 'vue';

const component = ref('dashboard');

function handleComponentChange(newComponent) {
  component.value = newComponent;
}
</script>

<template>
  <div>
    <Header @componentChanged="handleComponentChange" />
    <slot class="main" :component="component" />
    <Footer />
  </div>
</template>

<style scoped></style>
