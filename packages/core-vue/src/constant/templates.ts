import { MapFile } from './index';

export const Vue3Template = {
  'index.ts': `import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);
app.mount('#app');
  `,
  'App.vue': `<script setup>
import { ref } from 'vue';

const msg = ref('Hello CS-Editor!');
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg" />
</template>`.trim(),
  [MapFile]: `
{
  "imports": {
    "vue": "https://esm.sh/vue@3.2.45"
  }
}`.trim(),
};

export const ReactTemplate = {
  'main.tsx': `import React from "react";
import { createRoot } from "react-dom/client";
import App from './App.tsx';

const root = createRoot(document.getElementById('app'));
root.render(<App />)
  `,
  'App.tsx': `import React, { useState } from 'react';

export default function App() {
  const [msg, setMsg] = useState('Hello CS-Editor!');
  return <div>
    <h1>{msg}</h1>
    <input value={msg} onInput={(e) => setMsg(e.target.value)} />
  </div>
}
  `.trim(),
  [MapFile]: `
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client"
  }
}
  `.trim(),
};

export const HtmlTemplate = {
  'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Code Sandbox</title>
  </head>
  <body>
    <div>
      <h1>Hello CS-Editor!</h1>
    </div>
  </body>
</html>
  `.trim(),
  [MapFile]: `
{
  "imports": {}
}
  `.trim(),
};

export const JavascriptTemplate = {
  'index.js': `const msg = 'Hello CS-Editor!';
console.log(msg);
    `,
  [MapFile]: `
  {
    "imports": {}
  }
    `.trim(),
};

export const TypescriptTemplate = {
  'index.ts': `
const msg = 'Hello CS-Editor!';
console.log(msg);
    `,
  [MapFile]: `
  {
    "imports": {}
  }
    `.trim(),
};
