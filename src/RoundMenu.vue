<template>
	<div @click="toggleMenu" :class="['menu', mode]">
		<span v-if="isDesktop" class="menu--half"></span>
		<!-- <transition-group class="menu--mid" tag="div" name="fade-down" appear> -->
			<div class="menu--mid">
			<div v-if="true" key="hamburger" ref="hamb" :class="['hamburger', showHamburger ? 'show' : '']"></div>
			<img
			v-if="!!logo && mode==='open'"
			v-scroll-to="{el:'#home', onDone: anchorScrollCB, offset:1}"
			key="logo"
			:class="['logo', showLogo ? 'show' : '']"
			:src="logo"
			:alt="menu.label"
			:title="menu.label" />
		<transition-group v-if="showMenuItems" key="menu" tag="ul" name="stag-down" appear>
				<li
					
					v-for="item in menu"
					:key="item.label || item"
					v-text="item.label || item"
					v-scroll-to="{el:`#${anchorify(item)}`, onStart: anchorScrollStart, onDone: anchorScrollCB, offset: item.offset || 1}"
					:class="[activeitem===(item.anchor||trimify(item)) ? 'active' : '']"
					>
				</li>
			</transition-group>
		<!-- </div> -->
</div>
		<!-- </transition-group> -->
		<span v-if="isDesktop" class="menu--half"></span>
	</div>
</template>
<script>
import Vue from 'vue';
import VueScrollTo from 'vue-scrollto'

Vue.use(VueScrollTo, {
	duration: 500,
	easing: "ease",
	offset: 200
})

const throttle = function(func, wait = 100) {
	let timer = null;
	return function(...args) {
		if (timer === null) {
			timer = setTimeout(() => {
				func.apply(this, args);
				timer = null;
			}, wait);
		}
	};
};

import anime from 'animejs'
import cssVars from 'css-vars-ponyfill';
export default {
	props: {
			menu: {
				type: Array,
				required: true
			},
			autoOpenTop: {
				type: Boolean,
				default: true
			},
			bgColorClosed: {
				type: String,
				default: "#0e75bb"
			},
			bgColorOpen: {
				type: String,
				default: "#222935"
			},
			logo: {
				type: String,
				default: '/img/logo.svg'
			},
			itemColor: {
				type: String,
				default: "#727272"
			},
			itemActiveColor: {
				type: String,
				default: "#0e75bb"
			},
			itemBorderColor: {
				type: String,
				default: "#727272"
			}
	},
	data() {
		return {
			mode: 'closed',
			menuanim: null,
			menuopen: null,
			activeitem: 'home',
			scrollTrig: -1,
			resizeTrig: -1,
			showHamburger: true,
			showMenuItems: false,
			showLogo: false,
			inAnchorscroll: false,
			closing: false,
			timers: {
				openmenu: -1,
				closemenu: -1,
				hamburger: -1,
				anim: -1,
			}
		}
	},
	destroyed() {
		window.removeEventListener('scroll', this.scrollHandler);
		window.removeEventListener('resize', this.resizeHandler);
	},
	mounted() {
		window.addEventListener('scroll', this.scrollHandler);
		window.addEventListener('resize', this.resizeHandler);
		this.initAnime();
		this.stylusizeJSVariables()
		this.checkPosition();
	},
	methods: {
		stylusizeJSVariables() {
			cssVars({
				shadowDOM  : true,
				updateDOM    : true,
				updateURLs   : true,
				preserve: true,
				variables: {
					'item-color': this.itemColor,
					'item-active-color': this.itemActiveColor,
					'item-border-color': this.itemBorderColor,
					'bg-color-closed': this.bgColorClosed,
					'bg-color-open': this.bgColorOpen,
				},
			})
		},
		clearAllTimers() {
			// console.log('clear timers');
			let timers = this.timers;
			clearTimeout(timers.openmenu);
			clearTimeout(timers.closemenu);
			clearTimeout(timers.hamburger);
			clearTimeout(timers.anim);
		},
		setAnimeProps() {
			this.$el.style.left = '100%';
			this.$el.style.top = '0%';
			this.$el.style.height = `${this.menuSize}px`;
			this.$el.style.borderRadius = `${this.menuSize/2}px`;
			this.$el.style.transform = !this.isDesktop && !this.isPortrait ? 'translateX(-125%) translateY(25%)' : 'translateX(-150%) translateY(50%)';
			this.menuanim = anime.timeline({
				easing: 'easeOutCubic',
				autoplay: false,
				direction: "normal"
			})
			this.menuanim.complete = this.animComplete;
			this.menuanim.begin = this.animeBegan;
		},
		animeBegan(anim) {
			console.log("ANIM BEGAN > ", anim);
		},
		animComplete(anim) {
			console.log("ANIM COMPLETE > ", anim);
			this.openMenuAfter();
		},
		initAnime() {
			this.setAnimeProps();
			let _toheight = this.isDesktop ? this.$el.style.height : this.isPortrait ? this.viewportHeight*1.2 : this.viewportWidth*1.2,
			_towidth = this.isDesktop ? this.viewportWidth :  this.isPortrait ? this.viewportHeight*1.2 : this.viewportWidth*1.2;
			let _toradius = _towidth/2;
			if (this.isDesktop) {
				this.menuanim
				.add({
					targets: this.$el,
					left: {
						value: [this.$el.style.left, '50%'],
						duration: 500
					},
					top: {
						value: [this.$el.style.top, '0%'],
						duration: 400
					},
					translateY: [
						{
							value: "0%",
							delay: 500,
							easing: "easeInOutQuad",
							duration: 300
						}
					],
					width: {
						value: [this.$el.style.height, `${_towidth}px`],
						delay: 1000,
						duration: 400
					},
					translateX: "-50%"
				})
				.add({
					targets: this.$el.querySelectorAll('.menu--half:first-child'),
					borderTopLeftRadius: {
						value: [23,0]
					},
					borderBottomLeftRadius: {
						value: [23,0]
					},
					offset: 1100
				})
				.add({
					targets: this.$el.querySelectorAll('.menu--half:nth-child(3)'),
					borderTopRightRadius: {
						value: [23,0]
					},
					borderBottomRightRadius: {
						value: [23,0]
					},
					offset: 1100
				})
			}
			else {
				// IS DEVICES...
				console.log("VIEWPORT HEIGHT>> ", this.viewportHeight);
				this.menuanim
				.add({
					targets: this.$el,
					left: {
						value: [this.$el.style.left, '50%'],
						duration: 400,
						easing: 'easeOutQuad'
					},
					top: [
						{
							value: [this.$el.style.top, '50%'],
							duration: 400,
							easing: 'easeOutQuad'
						},
						{
							value: 0,
							delay: 400,
							duration: 100,
							easing: 'easeOutQuad'
						}
					],
					borderRadius: [
						{
							value: [this.$el.style.borderRadius, `${_toradius}px`],
							duration: 400
						},
						{
							value: [`${_toradius}px`, `0px`],
							delay: 400,
							duration: 200
						}
					],
					height: [
						{
							value: [this.$el.style.height, `${_toheight}px`],
							duration: 300,
							delay: 450
						},
						{
							value: [`${_toheight}px`, `${this.viewportHeight}px`],
							duration: 300,
							delay: 450
						}
					],
					width: [
						{
							value: [this.$el.style.height, `${_towidth}px`],
							delay: 450,
							duration: 300
						},
						{
							value: [`${_towidth}px`, `${this.viewportWidth}px`],
							delay: 750,
							duration: 100
						}
					],
					translateY: [
						{
							value: '-50%',
							duration: 400,
							easing: 'easeOutQuad'
						},
						{
							value: 0,
							delay: 400,
							duration: 100,
							easing: 'easeOutQuad'
						}
					],
					translateX: {
						value: '-50%',
						duration: 400,
						easing: 'easeOutQuad'
					},
					// translateY: "-50%",
					// translateX: "-50%"
				})
			}
		},
		toggleMenu(close) {
			if ((typeof close === 'boolean' && !!close) || this.mode!=='closed') {
				this.closeMenu();
			}
			else {
				this.openMenu();
			}
		},
		openMenu() {
			if (this.mode!=='open') {
				this.clearAllTimers();
				this.mode = "open"
				if(!this.isDesktop) {
					this.showHamburger = false;
				}
				this.menuanim.restart()
			}
		},
		openMenuAfter() {
			if (this.mode==='open' && !this.closing) {
				this.showHamburger = true;
				this.showMenuItems = true;
				this.showLogo = true;
			}
		},
		closeMenu() {
			if (this.mode!=='closed') {
				this.clearAllTimers();
				this.closing = true;
				this.showMenuItems = false;
				this.showHamburger = false;
				this.timers.closemenu = setTimeout(function() {
					this.mode = "closed"
					this.showLogo = false;
					this.menuanim.seek(this.isDesktop ? 1200 : 800);
					this.menuanim.play()
					this.menuanim.reverse()
					this.timers.hamburger = setTimeout(function() {
						this.closing = false;
						this.showHamburger = true;
					}.bind(this), 750)

				}.bind(this), 200)
				if (!!this.isMobile && !this.isPortait && !this.inAnchorscroll) {
					console.log("scroll to show menu");
					setTimeout(function() {
						this.$scrollTo(this.$el, 200, {offset:-20})
					}.bind(this), 1450)
				}
			}
		},
		anchorScrollCB(el) {
			this.activeitem = el.id;
			this.inAnchorscroll = false;
		},
		anchorScrollStart() {
			this.inAnchorscroll = true;
		},
		checkPosition() {
			if (this.autoOpenTop && this.isDesktop && this.scrollPosition<200) {
				this.openMenu();
			}
			else {
				this.closeMenu();
			}
		},
		scrollHandler: throttle(function() {
			console.log("SCROOL HANDLER >> ");
			this.scrollTrig = new Date().getTime()
			if (this.scrollTrig-this.resizeTrig>500) {
				let sections = this.sectionOffsets;
				let mid = this.viewportMid;
				let filtered = sections.filter(section=> {
					return section.bottom > mid && section.top < mid
				})
				// use last filtered section
				if (!!filtered.length) {
					this.activeitem = filtered.slice(-1)[0].id
				}
				this.checkPosition()
			}
		}, 300),
		resizeHandler: throttle(function() {
			this.resizeTrig = new Date().getTime()
			this.closeMenu();
			this.$nextTick(function() {
				this.timers.anim = setTimeout(function() {
					this.initAnime();
				}.bind(this), 33)
			})
		}, 300),
		trimify(item) {
			if (typeof item === 'string') {
				return item.toLowerCase().replace(/\s/g, '_')
			}
			return ''
		},
		anchorify(item) {
			return typeof item === 'string' ? this.trimify(item) : item.anchor;
		}
	},
	computed: {
		isDesktop() {
			let trig = this.resizeTrig;
			let maxSize = Math.max(document.documentElement.clientWidth, document.documentElement.clientHeight),
				minSize = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight);
				return maxSize>1024 && minSize>450
		},
		isPortrait() {
			let trig = this.resizeTrig;
			return document.documentElement.clientHeight > document.documentElement.clientWidth
		},
		sectionOffsets() {
			let trig = this.resizeTrig + this.scrollTrig;
			return Array.prototype.map.call(this.sectionsToObserve, section =>  {
				return {id:section.id, top:section.getBoundingClientRect().top,bottom:section.getBoundingClientRect().bottom}
			})
		},
		sectionsToObserve() {
			return document.querySelectorAll('.observe');
		},
		viewportMid() {
			let trig = this.resizeTrig;
			return window.innerHeight/2
		},
		viewportWidth() {
			let trig = this.resizeTrig;
			return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		},
		viewportHeight() {
			let trig = this.resizeTrig;
			return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
		},
		scrollPosition() {
			let trig = this.resizeTrig + this.scrollTrig;
			return window.scrollY || document.documentElement.scrollTop
		},
		menuSize() {
			let w = this.viewportWidth,
			h = this.viewportHeight,
			m = Math.max(w,h)
			return m<815 && w>h ? 36 : 46;
		}
	}
}
</script>
<style lang="stylus">
@import './mixins'

.fuck-you-down
	&-enter-active
		transition opacity 0.4s ease-out, transform 1.4s ease-out
		// &.logo
		// 	transition opacity 0.4s 1.65s ease-out, transform 0.4s 5s ease-out !important
	&-leave-active
		transition opacity 0s ease-out
	&-enter
	&-leave-to
		opacity 0
		transform translateY(-5520%)
	&-enter-to
	&-leave
		opacity 1
		transform translateY(0)
.stag-down
	&-enter-active
		for num in (1...10)
			&:nth-child({num})
				transition opacity 0.2s unit(num*80, 'ms'), transform 0.2s unit(num*80, 'ms')
	&-leave-active
		for num in (1...10)
			&:nth-child({num})
				transition opacity 0.1s unit(num*20, 'ms') ease-out, transform 0.1s unit(num*20, 'ms') ease-out
	&-enter
	&-leave-to
		opacity 0
		transform translateY(-50%)
	&-leave-to
		transform translateY(0)
	&-enter-to
	&-leave
		opacity 1
		transform translateY(0)


size = 46px
+below(1024px)
	size = 26px
rad = unit(size/2, 'px')

ul
li
	list-style none
	margin 0
	padding 0
.menu
	position fixed
	z-index 9999
	cursor pointer
	width size
	height size
	font-family Helvetica, arial
	opacity 0.9
	tap-highlight-color transparent
	user-select none
	touch-callout none
	*
		touch-callout none
		user-select none
		tap-highlight-color transparent
	.logo
		opacity 0
		transform translateY(-200%)
		height 25px
		transition opacity 0.4s 0.6s ease-out, transform 0.4s 0.6s ease-out
		&.show
			opacity 1
			transform translateY(0)
	+below(1025px)
		border-radius rad
		background: var(--bg-color-closed);
		.logo
			position absolute
			bottom 2vh
			transition opacity 0.1s
			max-height 8vmin
			+portrait()
				max-height 5vh
				min-width initial
		&.open
			transition background 0.5s ease-out
			background: var(--bg-color-open);
			.logo
				transition opacity 0.2s 1.6s ease-out, transform 0.2s 1.5s ease-out !important

	.hamburger
		opacity 0
		center()

		background: linear-gradient(
			to bottom,
			white, white 14%,
			transparent 14%, transparent 45%,
			white 45%, white 55%,
			transparent 55%, transparent 90%,
			white 90%, white 100%
		);
		backface-visibility hidden
		transition opacity 0.2s ease-out
		&.show
			opacity 1
	&.closed .hamburger
		width 48%
		height 35%
	&.open .hamburger
		width 22px
		height 16px


	&--mid
		user-select none
		margin auto
		height 32%
		width 50%
		z-index 2
		min-width 0
		transition opacity 0.5s 1.2s ease-out, border 0.5s 1.2s ease-out
		& > *
			z-index 10
	&--half
		center(vertical)
		background: var(--bg-color-closed);
		height 100%
		width 51%
		transition background 0s ease-out
		&:first-child
			left 0.5px
			border-radius rad 0 0 rad
		&:nth-child(3)
			right 0.5px
			border-radius 0 rad rad 0
			width 50%
			&:before
				left 0
	&.open
		opacity 1
		mix-blend-mode initial
		.hamburger
			will-change opacity, left, top, transform
			+above(1024px)
				center()
				left 97%
				transition left 0.4s 1s ease
			+below(1025px)
				position absolute
				top 27vh
				left 100vw
				transform translate(-50%, 100%)
				+portrait()
					top 3vh
					left 94vw
				+landscape()
					top 0vw
					left 96vw
			// transition left 0.2s 1.2s ease-out,  top 0.2s 1.2s ease-out,  transform 0.2s 1.2s ease-out
		.menu--half
			background: var(--bg-color-open);
			transition background 0.2s 1s ease-out
			&:before
				opacity 0
				transition opacity 0.5s 0.2s ease-out
		.menu--mid
			width 50%
			min-width 900px
			height 100%
			display flex
			align-items center
			justify-content space-between
			border-color #272a33
			transition border 0.5s 0.2s ease-out, min-width 0.5s 1.5s ease-out, height 0.5s 1.5s ease-out
			+below(1025px)
				min-width auto
				width 100%
				flex-direction column-reverse
				justify-content space-evenly

			ul
				display flex
				align-items center
				justify-content flex-end
				+below(1025px)
					flex-direction column
					justify-content flex-start

				li
					flex 1
					flex-basis auto
					padding 0 10px 4px
					font-size 14px
					position relative
					text-transform capitalize
					color: var(--item-color);
					+below(1025px)
						font-size 20px
						text-align center
						text-transform uppercase
						margin-bottom 2vh
					+below(815px, orientation: landscape)
						font-size 5vh
					&:after
						content ''
						center(horizontal)
						bottom 0
						height 1px
						width 0
						background: var(--item-border-color);
						transition width 0.2s ease-out
					&.active
						color: var(--item-active-color);
						&:after
							width 100%

	/*
		// MENU ITEMS
	*/
	.menu-items
		width 50%
		min-width 900px
		margin auto
		position relative
		height 100%
		display flex
		align-items center
</style>
