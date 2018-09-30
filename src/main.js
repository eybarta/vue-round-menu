import Vue from 'vue';
import RoundMenu from './RoundMenu.vue';

Vue.config.productionTip = false;

new Vue({
	render: (h) => h(RoundMenu)
}).$mount('#app');

