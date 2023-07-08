<template>
	<div class="inner-steps">
		<v-expand-transition class="px-0">
			<v-stepper v-model="step" vertical="false" class="mx-auto" elevation="0">
				<v-stepper-step
					:complete="step > 1"
					:editable="step > 1"
					:color="step > 1 ? 'success' : 'secondary'"
					step="1"
					><h2
						class="text-h5 text-uppercase secondary--text"
						style="text-shadow: none"
					>
						{{ coach.helpTitle }}
					</h2>
					<small>{{ coach.helpSubtitle }}</small>
				</v-stepper-step>
				<v-stepper-content step="1">
					<v-form v-model="selectedTopic" @submit.prevent="step++">
						<v-chip-group v-model="selectedTopic" column>
							<v-chip
								v-for="(t, i) in topics"
								:key="i"
								:value="t"
								active-class="primary primary--text"
								outlined
								filter
								>{{ t }}
							</v-chip>
						</v-chip-group>
						<v-btn
							color="primary"
							block
							:disabled="!selectedTopic"
							type="submit"
						>
							<v-icon class="pr-1">mdi-arrow-down</v-icon>
							Weiter
						</v-btn>
					</v-form>
				</v-stepper-content>
				<v-stepper-step
					:complete="step > 2"
					:editable="step > 2"
					:color="step > 2 ? 'success' : 'secondary'"
					step="2"
				>
					<h2
						class="text-h5 text-uppercase secondary--text"
						style="text-shadow: none"
					>
						{{ coach.bioTitle }}
					</h2>
					<small>{{ coach.bioSubtitle }}</small>
				</v-stepper-step>
				<v-stepper-content step="2">
					<v-form v-model="valid.additional" @submit.prevent="step++">
						<v-text-field
							v-model="changeProfession"
							outlined
							class="pt-2"
							label="Beruf:"
							:rules="rules.obligatory"
							placeholder="Jobbezeichnung"
						></v-text-field>
						<v-textarea
							v-model="changeCitation"
							outlined
							label="Persönliches Zitat:"
							:rules="rules.obligatory"
							placeholder="Ein Zitat, mit dem Sie Ihre Weltsicht oder Arbeitweise umschreiben."
							height="100"
						></v-textarea>
						<v-textarea
							v-model="changeProfessionalBackground"
							outlined
							label="Beruflicher Hintergrund / Schwerpunkte:"
							placeholder="z.B. was Sie vorher gemacht haben oder was Sie bewegt"
							counter="600"
							:rules="rules.to_long"
						></v-textarea>
						<v-textarea
							v-model="changePersonalBackground"
							outlined
							label="Eisbrecher (etwas persönliches über Sie)"
							placeholder="Schreiben Sie etwas persönliches über sich, das ein Eisbrecher sein könnte. Gern einfach in Form von Stichpunkten. z.B. 
- Hobbies 
- Interessen 
- Lebenstationen 
- Familie 

… was Sie wollen"
							counter="600"
							:rules="rules.to_long"
						></v-textarea>
						<v-btn
							color="primary"
							:disabled="!valid.additional"
							block
							type="submit"
						>
							<v-icon class="pr-1">mdi-arrow-down</v-icon>
							weiter
						</v-btn>
					</v-form>
				</v-stepper-content>
				<v-stepper-step
					:complete="step > 3"
					:editable="step > 3"
					step="3"
					:color="step > 3 ? 'success' : 'secondary'"
					><h2
						class="text-h5 text-uppercase secondary--text"
						style="text-shadow: none"
					>
						{{ coach.picTitle }}
					</h2>
					<small>{{ coach.picSubtitle }}</small>
				</v-stepper-step>
				<v-stepper-content step="3">
					<v-form @submit.prevent="finish">
						<div class="mb-4 d-flex flex-column align-center">
							<UtilsFileUpload :file="avatar" />
						</div>
						<!----
						## crop image
						<v-overlay
						v-if="cropImage"
						:absolute="true"
						:value="overlay"
						color="white"
					>
						<v-card width="300" light>
							<vue-cropper
								ref="cropper"
								:aspect-ratio="1 / 1"
								alt="Source Image"
								:src="avatar.url"
								:zoomable="false"
							></vue-cropper>
							<div class="d-flex align-center">
								<v-btn
									color="grey"
									small
									icon
									class="my-2 mx-1"
									@click="overlay = !overlay"
									><v-icon small>mdi-close</v-icon></v-btn
								>
								<v-btn
									color="success"
									small
									class="my-2 mx-1 ml-auto"
									@click="croppingImage"
									><v-icon small class="mr-1">mdi-crop</v-icon
									>Zuschneiden</v-btn
								>
							</div>
						</v-card>
					</v-overlay>-->
						<v-btn color="primary" block type="submit">
							<v-icon class="pr-1">mdi-content-save</v-icon> Profil speichern
						</v-btn>
					</v-form>
				</v-stepper-content>
			</v-stepper>
		</v-expand-transition>
	</div>
</template>

<script>
	export default {
		name: 'CoachingSelection',
		data() {
			return {
				coach: {
					helpTitle: 'Ihre Fachgebiete',
					helpSubtitle:
						'Bitte wählen Sie ein Fachgebiet aus, zu dem Sie Beratung anbieten möchten.',
					picTitle: 'Foto',
					picSubtitle: 'Sammeln Sie Sympathiepunkte',
					bioTitle: 'Kurzbeschreibung',
					bioSubtitle:
						'Damit die Frauen Ihr Angebot besser einschätzen können.',
				},
				topics: ['psychosoziale Beratung', 'Coaching', 'Rechtsberatung'],
				valid: {
					additional: false,
				},
				avatar: [],
				selectedTopic: null,
				changeProfession: null,
				changeCitation: null,
				changePersonalBackground: null,
				changeProfessionalBackground: null,
				step: 1,
				cropImage: false,
				cropData: null,
				isLoading: false,
				overlay: false,
				rules: {
					to_long: [
						this.$rules.obligatory,
						(v) => (v && v.length) <= 600 || 'Zu viele Buchstaben',
					],
					obligatory: [this.$rules.obligatory],
				},
			};
		},
		mounted() {
			const user = this.$store.getters['getCurrentUser'];
			console.log('a length', user.avatar_content_url.length);
			if (user.avatar_content_url.length > 0)
				this.avatar = user.avatar_content_url;
			this.selectedTopic = user.topic_areas;
			this.changeProfession = user.profession_line;
			this.changePersonalBackground = user.personal_background;
			this.changeProfessionalBackground = user.professional_background;
			this.changeCitation = user.citation;
		},
		//fetchOnServer: false,
		methods: {
			async uploadDone(error, file) {
				this.$func.updateAvatar(file);
				this.avatar = file;
				//const b64 = await file.getFileEncodeBase64String;
				//console.log('b64', b64);
				//const { data } = await file.getFileEncodeDataURL();
				//console.log('url', data);
				//const user = this.$store.getters['getCurrentUser'];
				//this.$func.me();
				//this.cropImage = true;
				//this.$func.updateAvatar(file);
			},
			removeImage() {
				this.avatar = [];
			},
			/*croppingImage() {
				this.removeImage();
				this.cropData = JSON.stringify(
					this.$refs.cropper.getCropBoxData(),
					null,
					4
				);
				this.$refs.cropper.getCroppedCanvas(this.cropData).toBlob((blob) => {
					this.upload(blob, true);
				});
			},*/
			finish() {
				const data = {
					...this.$store.getters['getCurrentUser'],
					topic_areas: this.selectedTopic,
					personal_background: this.changePersonalBackground,
					citation: this.changeCitation,
					professional_background: this.changeProfessionalBackground,
					profession_line: this.changeProfession,
					avatar_content_url: this.avatar,
				};
				this.$store.dispatch('changeData', data);
				this.$emit('selection', data);
			},
		},
	};
</script>
<style>
	.v-expansion-panel-content__wrap {
		padding: 0;
	}
	.inner-steps .v-stepper__step {
		display: flex !important;
	}
	.inner-steps .v-stepper__step__step {
		margin-right: 12px !important;
	}
	.inner-steps .v-stepper__label {
		display: block !important;
	}
</style>
