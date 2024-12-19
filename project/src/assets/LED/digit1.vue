<script setup lang='ts'>
import { ref } from 'vue';
	const number = 10;
    const segament = ref([
		//-
		{
			rightBottom: false, rightUpper: false, leftBottom: false, leftUpper: false, bottom: false, middle: true, upper: false
		},//0
		{
			rightBottom: true, rightUpper: true, leftBottom: true, leftUpper: true, bottom: true, middle: false, upper: true
		},//1
		{
			rightBottom: true, rightUpper: true, leftBottom: false, leftUpper: false, bottom: false, middle: false, upper: false
		},//2
		{
			rightBottom: false, rightUpper: true, leftBottom: true, leftUpper: false, bottom: true, middle: true, upper: true
		},//3
		{
			rightBottom: true, rightUpper: true, leftBottom: false, leftUpper: false, bottom: true, middle: true, upper: true
		},//4
		{
			rightBottom: true, rightUpper: true, leftBottom: false, leftUpper: true, bottom: false, middle: true, upper: false
		},//5
		{
			rightBottom: true, rightUpper: false, leftBottom: false, leftUpper: true, bottom: true, middle: true, upper: true
		},//6
		{
			rightBottom: true, rightUpper: false, leftBottom: true, leftUpper: true, bottom: true, middle: true, upper: true
		},//7
		{
			rightBottom: true, rightUpper: true, leftBottom: false, leftUpper: false, bottom: false, middle: false, upper: true
		},//8
		{
			rightBottom: true, rightUpper: true, leftBottom: true, leftUpper: true, bottom: true, middle: true, upper: true
		},//9
		{
			rightBottom: true, rightUpper: true, leftBottom: false, leftUpper: true, bottom: true, middle: true, upper: true
		}
	])
</script>

<template>
<svg width="30.000122" height="53.000000" viewBox="0 0 30.0001 53" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
	<desc>
			Created with Pixso.
	</desc>
	<defs/>
	<path class="rightBottom" :class="{ on: segament[number].rightBottom }" d="M23.4783 31.7998L25.4348 29.8123L27.9938 29.8123L30 31.954L30 44.896L27.9942 47.0373L25.4346 47.0373L23.4783 45.0499L23.4783 31.7998Z" clip-rule="evenodd" fill-rule="evenodd"/>
	<path class="rightUpper" :class="{ on: segament[number].rightUpper }" d="M23.4783 7.94968L25.4348 5.96225L27.9939 5.96225L30 8.10391L30 21.0459L27.9942 23.1873L25.4344 23.1873L23.4783 21.2002L23.4783 7.94968Z" clip-rule="evenodd" fill-rule="evenodd"/>
	<path class="leftBottom" :class="{ on: segament[number].leftBottom }" d="M1.95673 29.8123L0.00012207 31.7999L0 31.7998L0 45.05L1.9563 47.0373L4.51599 47.0373L6.52173 44.896L6.52173 31.9537L4.51581 29.8123L1.95673 29.8123Z" clip-rule="evenodd" fill-rule="evenodd"/>
	<path class="leftUpper" :class="{ on: segament[number].leftUpper }" d="M1.95673 5.96225L6.10352e-05 7.94989L0 7.94986L0 21.2001L1.95618 23.1873L4.51599 23.1873L6.52173 21.046L6.52173 8.10379L4.51575 5.96225L1.95673 5.96225Z" clip-rule="evenodd" fill-rule="evenodd"/>
	<g opacity="0.900000">
		<path class="bottom" :class="{ on: segament[number].bottom }" d="M6.52197 51.0122L8.47876 52.9999L8.4787 53L21.5219 53L23.4785 51.0124L23.4785 51.0125L23.4785 48.4127L21.3704 46.375L8.63025 46.375L6.52197 48.4128L6.52197 51.0122Z" clip-rule="evenodd" fill-rule="evenodd"/>
	</g>
	<g opacity="0.900000">
		<path class="middle" :class="{ on: segament[number].middle }" d="M6.52197 27.8247L8.47876 29.8124L8.4787 29.8125L21.5219 29.8125L23.4785 27.8249L23.4785 27.825L23.4785 25.2252L21.3704 23.1875L8.63025 23.1875L6.52197 25.2254L6.52197 27.8247Z" clip-rule="evenodd"  fill-rule="evenodd"/>
	</g>
	<g opacity="0.900000">
		<path class="upper" :class="{ on: segament[number].upper }" d="M6.52197 4.63721L8.47876 6.62494L8.4787 6.625L21.5219 6.625L23.4785 4.63745L23.4785 4.63748L23.4785 2.03772L21.3704 0L8.63025 0L6.52197 2.03787L6.52197 4.63721Z" clip-rule="evenodd" fill-rule="evenodd"/>
	</g>
</svg>

</template>
    
<style lang="scss" scoped>
    svg{
		width: 10%;
		height: auto;
	}
	path {
  		fill: #C4C4C4; /* 默认灰色 */
		fill-opacity: 0.150000;
  		transition: fill 0.2s ease;
	}

	path.on {
  	fill: #FF3D3D; /* 点亮的颜色 */
	fill-opacity: 1.000000;
	}
</style>