<template>
	<div :class="'d-flex align-center justify-center ' + classname">
		<v-btn
			:to="!mailto ? link : null"
			:href="mailto ? link : null"
			color="secondary"
			>{{ text }}</v-btn
		>
	</div>
</template>

<script>
	export default {
		props: {
			text: {
				type: String,
				default: '',
			},
			classname: {
				type: String,
				default: 'pt-6 pb-12',
			},
			link: {
				type: String,
				default: '',
			},
			mailto: {
				type: Boolean,
				default: false,
			},
		},
	};
</script>
