import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Toast, { POSITION } from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

let app = createApp(App);
app.use(router).use(store).use(Toast, { position: POSITION.BOTTOM_LEFT });

app.mount("#app");
