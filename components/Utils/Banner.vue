<template>
	<v-img v-if="url" :src="url" height="300" :position="pos" />
	<v-sheet v-else color="secondary d-flex justify-center">
		<v-icon size="60" class="pa-12" color="white">{{ icon }}</v-icon>
	</v-sheet>
</template>

<script>
	export default {
		props: {
			url: {
				type: String,
				default: null,
			},
			icon: {
				type: String,
				default: null,
			},
			pos: {
				type: String,
				default: 'center center',
			},
		},
	};
</script>
