import { createApp } from 'vue';
import '../../core/dist/style.css';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

import App from './App.vue';

const app = createApp(App);
app.mount('#app');
