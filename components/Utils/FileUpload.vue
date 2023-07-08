<template>
	<div class="file-upload d-flex flex-column align-center">
		<div
			class="drop-zone"
			:style="`border: 1px dashed ${
				size_error ? $vuetify.theme.themes.light.error : 'grey'
			}`"
			@dragenter="handleDragEnter"
			@dragover="handleDragOver"
			@dragleave="handleDragLeave"
			@drop="handleDrop"
			@click="handleBrowse"
		>
			<input
				ref="fileInput"
				type="file"
				style="display: none"
				accept="image/*"
				@change="handleFileInputChange"
			/>
			<div v-if="!file" class="pa-4">
				<span class="filepond--label-action">Tippe hier</span><br />oder ziehe
				ein Foto einfach in den Kreis.
			</div>
			<div v-else style="position: relative">
				<img :src="file.name ? filePreview : file" alt="Preview" />
				<div v-if="file" class="input--button d-flex align-end justify-center">
					<v-btn fab x-small @click="deleteImage"
						><v-icon small>mdi-reload</v-icon></v-btn
					>
				</div>
			</div>
		</div>
		<v-alert
			v-if="size_error"
			type="error"
			outlined
			color="error"
			class="caption mt-2"
			dense
		>
			Das ausgewählte Foto ist leider zu groß. Bitte wählen Sie ein Foto mit
			max. 2MB aus.
		</v-alert>
	</div>
</template>

<script>
	export default {
		props: {
			file: null,
		},
		data() {
			return {
				filePreview: '',
				size_error: false,
			};
		},
		methods: {
			handleDragEnter(event) {
				event.preventDefault();
				event.stopPropagation();
			},
			handleDragOver(event) {
				event.preventDefault();
				event.stopPropagation();
			},
			handleDragLeave(event) {
				event.preventDefault();
				event.stopPropagation();
			},
			handleDrop(event) {
				event.preventDefault();
				event.stopPropagation();

				const fileList = event.dataTransfer.files;
				if (fileList.length > 0) {
					this.handleFile(fileList[0]);
				}
			},
			handleBrowse() {
				this.$refs.fileInput.click();
			},
			handleFileInputChange(event) {
				const fileList = event.target.files;
				if (fileList.length > 0) {
					this.handleFile(fileList[0]);
				}
			},
			handleFile(file) {
				if (file.type.startsWith('image/')) {
					if (file.size <= 2 * 1024 * 1024) {
						// Maximum size of 2MB
						const reader = new FileReader();
						reader.onload = () => {
							this.file = file;
							this.filePreview = reader.result;
							this.$func.updateAvatar(file);
						};
						reader.readAsDataURL(file);
						this.size_error = false;
					} else {
						this.size_error = true;
					}
				} else {
					this.file = file;
				}
			},
			deleteImage() {
				//this.file = null;
				//this.filePreview = '';
			},
		},
	};
</script>

<style scoped>
	.drop-zone {
		width: 200px;
		height: 200px;
		padding-top: 4px;
		text-align: center;
		display: flex;
		align-items: center;
		justify-items: center;
		border-radius: 50%;
		background-color: rgb(235, 235, 235);
		overflow: hidden;
	}

	.drop-zone img {
		max-width: 200px;
		max-height: 200px;
	}
	.drop-zone .input--button {
		width: 200px;
		height: 200px;
		position: absolute;
		top: 0;
		left: 0;
		padding-bottom: 15px;
	}
</style>
