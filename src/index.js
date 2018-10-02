import Vue from 'vue';
import RoundMenu from './RoundMenu.vue';

const Components = {
	RoundMenu
}

Object.keys(Components).forEach(name => {
	Vue.component(name, Components[name])
})

export default Components;