import Vue from 'vue';
// import VueScrollTo from 'vue-scrollto'

// Vue.use(VueScrollTo, {
// 	duration: 500,
// 	easing: "ease",
// 	offset: 200
// })

import RoundMenu from './RoundMenu.vue';

const Components = {
	RoundMenu
}

Object.keys(Components).forEach(name => {
	Vue.component(name, Components[name])
})

export default Components;