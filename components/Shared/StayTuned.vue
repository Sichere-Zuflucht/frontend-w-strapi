<template>
	<div>
		<h3 class="text-h3 secondary--text mt-10 pb-4">BLEIB’ AUF DEM LAUFENDEN</h3>
		<p>
			Wir erzählen in den sozialen Medien, wie unser Projekt voranschreitet,
			wenn wir jemandem helfen konnten – klären auf und erzählen Geschichten aus
			dem Leben der Frauen, denen wir helfen wollen.
		</p>
		<p class="mb-0 mt-10 text-center">
			<b>Sei dabei und behalte uns in deinem Herzen</b>
		</p>
		<SharedShare color />
	</div>
</template>

<script>
	export default {
		props: {
			justify: {
				type: String,
				default: 'center',
			},
			color: {
				type: Boolean,
				default: false,
			},
		},
	};
</script>
