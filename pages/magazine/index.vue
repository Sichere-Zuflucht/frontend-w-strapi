<template>
	<v-container v-if="magazineList">
		<h1 class="text-h1 primary--text text-center">Sichere Zuflucht</h1>
		<h2 class="subtitle-1 secondary--text text-center">Magazin</h2>
		<p class="pt-8 mb-8">
			Wir wollen euch helfen, eure Situation besser einschätzen zu können.
			Deshalb bieten wir euch hier ganz viel Material zum Thema häusliche
			Gewalt.
		</p>
		<div style="position: relative; z-index: 0">
			<div
				style="
					position: sticky;
					top: 50px;
					width: calc(100% + 10px);
					margin-left: -5px;
					padding: 5px;
					padding-top: 15px;
					z-index: 5;
					background-color: white;
				"
			>
				<p class="caption mb-0">Filtern:</p>
				<v-chip-group v-model="tagsSelected" column class="pt-0">
					<v-chip
						v-for="tag in tagList"
						:key="tag.id"
						:value="tag.attributes.name"
						outlined
						small
						filter
						active-class="primary primary--text"
					>
						{{ tag.attributes.name }}</v-chip
					>
				</v-chip-group>
			</div>
			<v-alert v-if="error">{{ error }}</v-alert>
			<v-row v-else class="pt-8" style="z-index: 1">
				<v-col
					v-for="magazine in magazineList.filter((m) =>
						tagsSelected != null
							? tagsSelected == m.attributes.tags.data[0].attributes.name
								? true
								: false
							: true
					)"
					:key="magazine.id"
					cols="12"
					sm="6"
					md="4"
					class="pb-4"
				>
					<MagazineTeaserBox :magazine-data="magazine" :append-url="true" />
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script>
	export default {
		data() {
			return {
				magazineList: null,
				tagList: [],
				tagsSelected: null,
				error: null,
			};
		},
		async mounted() {
			this.magazineList = (
				await this.$strapi.$magazines.find({ populate: '*' })
			).data;
			this.tagList = (await this.$strapi.$tags.find({ populate: '*' })).data;
		},
	};
</script>
