import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import './assets/main.css'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'

const app = createApp(App)
app.use(PrimeVue)
app.mount('#app')