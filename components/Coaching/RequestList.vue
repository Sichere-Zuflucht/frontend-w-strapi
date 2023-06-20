<template>
	<div v-if="list != null">
		<v-expansion-panels v-if="list.length != 0">
			<v-expansion-panel v-for="(item, i) in list" :key="i">
				<CoachingRequestSingleTab :item="item.attributes" :id="item.id" />
			</v-expansion-panel>
		</v-expansion-panels>
		<p v-else-if="list.length == 0" class="caption">
			<b>Noch existieren keine Anfragen.</b><br />
			Sobald eine Frau eine Anfrage an Sie stellt, wird diese hier angezeigt.
		</p>
	</div>
	<v-sheet v-else-if="list == null" elevation="2" class="pa-2"
		><v-skeleton-loader
			class="mx-auto"
			max-width="300"
			type="text, text, text, text"
		></v-skeleton-loader
	></v-sheet>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: null,
			},
			showold: {
				type: Boolean,
				default: false,
			},
		},
	};
</script>
