
require('./bootstrap');
//import the vue
window.Vue = require('vue');

//import the gate for ACL ( Access control list === multi auth for front end)

import Gate from "./Gate";
//make instance of gate to use it in all vue.js files
//the value that pass to the Gate Class came from the master.blade.php
Vue.prototype.$gate = new Gate(window.user);

//for vue-router
import VueRouter from 'vue-router'
Vue.use(VueRouter)

//for v-form
import { Form, HasError, AlertError } from 'vform'

window.Form = Form; //this to use in other component

Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

//for moment.js
import moment from 'moment'

// this for the progressBar
import VueProgressBar from 'vue-progressbar'

Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '10px'
})

//this for the alert
import Swal from 'sweetalert2'

window.swal = Swal//this to use any where in thr application

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
})

window.toast = Toast//this to use any where in thr application


//filters
//make the first letter upper case
Vue.filter('upper', function(text){
    return text.charAt(0).toUpperCase() + text.slice(1)
});
//display date
Vue.filter('myDate', function(date){
    return moment(date).format('MMMM Do YYYY');
});

//this for passport
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);
//////////////

//this component for not found page
Vue.component(
    'notFound',
    require('./components/NotFound.vue').default
);

//this for adding the new data after creating new user
window.Fire = new Vue();


//this for laravel vue paginate
Vue.component('pagination', require('laravel-vue-pagination'));
let routes = [{
    path: '/dashboard',
    component: require('./components/Dashboard.vue').default
  },
  {
    path: '/profile',
    component: require('./components/Profile.vue').default
  },
  {
    path: '/users',
    component: require('./components/Users.vue').default
  },
  {
    path: '/developer',
    component: require('./components/Developer.vue').default
  },
  { path: '*', component: require('./components/NotFound.vue').default }
]

const router = new VueRouter({
    mode:'history',
    routes // short for `routes: routes`
})


const app = new Vue({
    el: '#app',
    router,
    data:{
        search: ''
    },
    methods:{
        searchit: _.debounce(() => {
            Fire.$emit('searching');
        },1000),
    }
});
