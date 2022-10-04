import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia'

import Toast, { POSITION } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

let app = createApp(App);
const pinia = createPinia();
app.use(router).use(pinia).use(Toast, { position: POSITION.BOTTOM_LEFT });

app.mount("#app");
