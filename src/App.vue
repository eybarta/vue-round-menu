<template>
	<div>
		<round-menu :menu="menuArr" bg-color-closed="#ff0000"></round-menu>
		<section v-for="item in menuArr" :key="item" :id="itemId(item)">
			<h4 v-text="item"></h4>
		</section>
	</div>
</template>

<script>
import RoundMenu from './RoundMenu.vue';
export default {
	data() {
		return {
			menuArr:[
				"first item", "Second Item", "About", "Products", "Media Gallery"]
				// {"label":"Home","anchor":"home"},
				// {"label":"Basitleştir","anchor":"video"},
				// {"label":"Genel Bakış","anchor":"overview"},
				// {"label":"Ürünler","anchor":"features"},
				// {"label":"Araştırma","anchor":"research"},
				// {"label":"Galeri","anchor":"gallery"},
				// {"label":"Yalnızca Daha Fazla Bilgi","anchor":"moreinfo"}]
		}
	},
	components: {
		RoundMenu
	},
	methods: {
		itemId(item) {
			return item.toLowerCase().replace(/\s/g, '_');
		}
	}
}
</script>
<style lang="stylus">
section
	height 80vh
	width 100%
	border-bottom 3px solid rgba(#ff6600, 0.3)
</style>

