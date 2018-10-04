<template>
	<div>
		<round-menu :menu="menuArr" bg-color-closed="#ff0ee0"></round-menu>
	</div>
</template>

<script>
import RoundMenu from './RoundMenu.vue';
export default {
	data() {
		return {
			menuArr:[{"label":"Home","anchor":"home"},{"label":"Basitleştir","anchor":"video"},{"label":"Genel Bakış","anchor":"overview"},{"label":"Ürünler","anchor":"features"},{"label":"Araştırma","anchor":"research"},{"label":"Galeri","anchor":"gallery"},{"label":"Yalnızca Daha Fazla Bilgi","anchor":"moreinfo"}]
		}
	},
	components: {
		RoundMenu
	}
}
</script>
<style lang="stylus">

</style>

