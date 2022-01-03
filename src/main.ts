import { createApp } from 'vue';
import App from './App.vue'
import store from './store'
import { Slider,Field,Sidebar,Switch,Datetimepicker, Datepicker,Timepicker,Input,Button,Select  } from '@oruga-ui/oruga-next'
import '@oruga-ui/oruga-next/dist/oruga.css'

import VueGtag from "vue-gtag";

const app = createApp(App)
    .use(store)
    .use(VueGtag, {
        config: { id: "G-00K6EYE0VE" }
    })    
    .use(Slider)
    .use(Field)
    .use(Sidebar)
    .use(Switch)
    .use(Datetimepicker)
    .use(Datepicker)
    .use(Timepicker)
    .use(Input)
    .use(Button)
    .use(Select)
    .mount('#app');
