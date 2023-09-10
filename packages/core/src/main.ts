import { createApp } from 'vue';
import '@/style/global.less';
import '@/style/index.less';
import 'tippy.js/dist/tippy.css'; 
import 'tippy.js/themes/light.css';

import App from './App.vue';

const app = createApp(App)
app.mount('#app');