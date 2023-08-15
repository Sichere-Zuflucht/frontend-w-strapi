<template>
	<v-container>
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
						v-for="(tag, id) in tagList"
						:key="id"
						:value="tag"
						outlined
						small
						filter
						active-class="primary primary--text"
					>
						{{ tag }}</v-chip
					>
				</v-chip-group>
			</div>
			<v-alert v-if="error">{{ error }}</v-alert>
			<v-row v-else-if="!error && allArticles" class="pt-8" style="z-index: 1">
				<v-col
					v-for="article in allArticles.filter((singleArticle) =>
						tagsSelected != null
							? tagsSelected == singleArticle.attributes.category
								? true
								: false
							: true
					)"
					:key="article.id"
					cols="12"
					sm="6"
					md="4"
					class="pb-4"
				>
					<MagazineTeaserBox :article="article.attributes" />
				</v-col>
			</v-row>
		</div>
	</v-container>
</template>

<script>
	export default {
		data() {
			return {
				allArticles: null,
				tagList: ['sehen', 'hören', 'lesen'],
				tagsSelected: null,
				error: null,
			};
		},
		async mounted() {
			this.allArticles = await this.$func.loadAllArticles();
		},
	};
</script>
