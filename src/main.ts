import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import router from './router'

const app = createApp(App).use(router);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(Toast);
app.mount('#app');
