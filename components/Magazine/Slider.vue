<template>
	<v-slide-group v-if="list" show-arrows class="py-4">
		<v-slide-item v-for="(magazine, n) in list" :key="n" class="my-4">
			<MagazineTeaserBox
				:magazine-data="magazine"
				:class="
					(n == 0 ? 'ml-8 mr-2' : n == list.length - 1 ? 'ml-2 mr-8' : 'mx-2') +
					' my-2'
				"
			/>
		</v-slide-item>
	</v-slide-group>
	<v-row v-else>
		<v-col v-for="i in 3" :key="i">
			<v-skeleton-loader type="card" max-width="300"></v-skeleton-loader>
		</v-col>
	</v-row>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: null,
			},
		},
	};
</script>

<style>
	.v-slide-group__next,
	.v-slide-group__prev {
		position: absolute;
		z-index: 2;
		height: 100%;
	}
	.v-slide-group__next {
		right: 0;
	}
	.v-slide-group__prev {
		left: 0;
	}
</style>
