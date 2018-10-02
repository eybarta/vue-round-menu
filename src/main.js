import Vue from 'vue';
import App from './App.vue';
import VueScrollTo from 'vue-scrollto'

Vue.use(VueScrollTo, {
	duration: 500,
	easing: "ease",
	offset: 200
})
Vue.config.productionTip = false;

new Vue({
	render: (h) => h(App)
}).$mount('#app');