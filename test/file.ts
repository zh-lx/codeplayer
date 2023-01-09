export const defaultMainFile = 'App.vue';
export const ifile = 'ok.ts';

export const ifileCode = `console.log(111, 'ok');
export const ok = 111;`;

export const welcomeCode = `
<script setup>
import { ref } from 'vue'
import {ok} from './ok.ts'

console.log(ok);

const msg = ref('Hello World!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>
`.trim();
