import { MapFile } from './index';

export const Vue3Template = {
  'App.vue': `<script setup>
import { ref } from 'vue'

const msg = ref('Hello CodeSandbox!')
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg" />
</template>`.trim(),
  [MapFile]: `
{
  "imports": {
    "vue": "https://unpkg.com/vue@3.2.45/dist/vue.esm-browser.js"
  }
}`.trim(),
};

export const ReactTemplate = {
  'App.tsx': `import React, { useState } from 'react';

export default function App() {
  const [msg, setMsg] = useState('Hello CodeSandbox!');
  return <div>
    <h1>{msg}</h1>
    <input value={msg} onInput={(e) => setMsg(e.target.value)} />
  </div>
}
  `.trim(),
  [MapFile]: `
{
  "imports": {
    "react": "https://ga.jspm.io/npm:react@18.0.0-rc.0/index.js",
    "react-dom": "https://ga.jspm.io/npm:react-dom@18.0.0-rc.0/index.js",
    "object-assign": "https://ga.jspm.io/npm:object-assign@4.1.1/index.js",
    "scheduler": "https://ga.jspm.io/npm:scheduler@0.23.0/index.js"
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
      <h1>Hello CodeSandbox!</h1>
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
  'index.js': `const msg = 'Hello CodeSandbox!'
console.log(msg)
    `,
  [MapFile]: `
  {
    "imports": {}
  }
    `.trim(),
};

export const TypescriptTemplate = {
  'index.ts': `
const msg = 'Hello CodeSandbox!'
console.log(msg)
    `,
  [MapFile]: `
  {
    "imports": {}
  }
    `.trim(),
};
