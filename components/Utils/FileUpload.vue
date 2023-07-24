<template>
	<v-form @submit.prevent="saveCropImage">
		<div class="d-flex flex-column align-center justify-center">
			<croppa
				v-model="croppa"
				:initial-image="initialImage"
				:show-remove-button="true"
				:show-loading="true"
				:prevent-white-space="true"
				:zoom-speed="8"
				accept="image/*, .heic"
				class="mb-4"
				:file-size-limit="2000000"
				@file-size-exceed="
					() => {
						error = 'Bild ist zu groß. Das Bild muss kleinter als 2MB sein.';
					}
				"
			/>
			<div v-if="isImage" class="mb-4">
				<v-icon @click="croppa.moveUpwards(10)">mdi-arrow-up</v-icon>
				<v-icon @click="croppa.moveDownwards(10)">mdi-arrow-down</v-icon>
				<v-icon @click="croppa.moveLeftwards(10)">mdi-arrow-left</v-icon>
				<v-icon @click="croppa.moveRightwards(10)">mdi-arrow-right</v-icon>
				<v-icon @click="croppa.zoomIn()">mdi-magnify-plus-outline</v-icon>
				<v-icon @click="croppa.zoomOut()">mdi-magnify-minus-outline</v-icon>
			</div>
			<v-alert
				v-if="error"
				type="error"
				outlined
				color="error"
				class="caption my-2"
				dense
			>
				{{ error }}
			</v-alert>
			<v-btn color="primary" block :disabled="!isImage" type="submit">
				<v-icon class="pr-1">mdi-content-save</v-icon> Profil speichern
			</v-btn>
		</div>
	</v-form>
</template>

<script>
	export default {
		props: {
			file: {
				type: String,
				default: '',
			},
		},
		data() {
			return {
				filePreview: '',
				error: false,
				croppa: {},
			};
		},
		computed: {
			isImage() {
				return this.croppa.imageSet;
			},
			initialImage() {
				return this.file;
			},
		},
		methods: {
			async saveCropImage() {
				this.croppa.generateBlob(async (blob) => {
					await this.$func
						.updateAvatar(blob)
						.then(() => {
							this.$emit('done');
						})
						.catch((err) => {
							this.error = err;
						});
				});
			},
		},
	};
</script>

<style>
	.croppa-container {
		background-color: lightgrey;
		border: 2px solid grey;
		border-radius: 100%;
		width: 204px;
		height: 204px;
		overflow: hidden;
		align-self: center !important;
	}
	.croppa-container svg.icon-remove {
		margin-top: calc(89% - 5px);
		margin-right: calc(50% - 5px);
		box-shadow: 0px -3px 20px 10px white;
	}
</style>
