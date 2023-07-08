<template>
	<div v-if="list != null">
		<v-expansion-panels v-if="list.length != 0">
			<v-expansion-panel v-for="(meeting, i) in list" :key="i">
				<CoachingRequestSingleTab
					:meeting="meeting.attributes"
					:id="meeting.id"
				/>
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
			oldlist: {
				type: Boolean,
				default: false,
			},
		},
	};
</script>
