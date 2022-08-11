<template>
  <div>
    <v-expand-transition>
      <v-stepper v-model="e6" vertical class="mx-auto" elevation="0">
        <v-stepper-step
          :complete="e6 > 1"
          :editable="e6 > 1"
          :color="e6 > 1 ? 'success' : 'secondary'"
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
          <v-btn color="primary" block :disabled="!selectedTopic" @click="e6++">
            <v-icon class="pr-1">mdi-arrow-down</v-icon>
            Weiter
          </v-btn>
        </v-stepper-content>
        <v-stepper-step
          :complete="e6 > 2"
          :editable="e6 > 2"
          :color="e6 > 2 ? 'success' : 'secondary'"
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
          <v-text-field
            v-model="changeProfession"
            outlined
            class="pt-2"
            label="Beruf:"
            :rules="[(v) => !!v || 'Bitte ausfüllen']"
            placeholder="Jobbezeichnung"
          ></v-text-field>
          <v-textarea
            v-model="changeQuote"
            outlined
            label="Persönliches Zitat:"
            :rules="[(v) => !!v || 'Bitte ausfüllen']"
            placeholder="Ein Zitat, mit dem Sie Ihre Weltsicht oder Arbeitweise umschreiben."
            height="100"
          ></v-textarea>
          <v-textarea
            v-model="changeHistory"
            outlined
            label="Beruflicher Hintergrund / Schwerpunkte:"
            placeholder="z.B. was Sie vorher gemacht haben oder was Sie bewegt"
            counter="600"
            :rules="[
              (v) => !!v || 'Bitte ausfüllen',
              (v) => (v && v.length) <= 600 || 'Zu viele Buchstaben',
            ]"
          ></v-textarea>
          <v-textarea
            v-model="changeDescription"
            outlined
            label="Eisbrecher (etwas persönliches über Sie)"
            placeholder="Schreiben Sie etwas persönliches über sich, das ein Eisbrecher sein könnte. Gern einfach in Form von Stichpunkten. z.B. 
- Hobbies 
- Interessen 
- Lebenstationen 
- Familie 

… was Sie wollen"
            counter="600"
            :rules="[
              (v) => !!v || 'Bitte ausfüllen',
              (v) => (v && v.length) <= 600 || 'Zu viele Buchstaben',
            ]"
          ></v-textarea>
          <v-btn color="primary" block @click="e6++">
            <v-icon class="pr-1">mdi-arrow-down</v-icon>
            weiter
          </v-btn>
        </v-stepper-content>
        <v-stepper-step
          :complete="e6 > 3"
          :editable="e6 > 3"
          step="3"
          :color="e6 > 3 ? 'success' : 'secondary'"
          ><h2
            class="text-h5 text-uppercase secondary--text"
            style="text-shadow: none"
          >
            {{ coach.picTitle }}
          </h2>
          <small>{{ coach.picSubtitle }}</small>
        </v-stepper-step>
        <v-stepper-content step="3">
          <div class="mb-4 d-flex flex-column align-center">
            <v-avatar v-if="avatar && !changeImg" size="200">
              <v-img :src="$config.strapi.url + avatar.url"
                ><div
                  class="d-flex justify-center align-end pb-2"
                  style="width: 100%"
                >
                  <v-btn
                    fab
                    x-small
                    class="mx-1"
                    @click="changeImg = !changeImg"
                    ><v-icon>mdi-cached</v-icon></v-btn
                  >
                  <v-btn fab x-small class="mx-1" @click="removeImage"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </div></v-img
              >
            </v-avatar>
            <file-pond
              v-else-if="!avatar || changeImg"
              v-model="imageFile"
              labelIdle='Ziehe eine Datei per Drag & Drop hierher oder <span class="filepond--label-action"> durchsuche den Computer </span>'
              server="/api"
              :src="avatar ? this.$config.strapi.url + avatar.url : null"
              imagePreviewHeight="200"
              imageCropAspectRatio="1:1"
              imageResizeTargetWidth="200"
              imageResizeTargetHeight="200"
              stylePanelLayout="compact circle"
              styleButtonRemoveItemPosition="left bottom"
              styleProgressIndicatorPosition="center"
              styleButtonProcessItemPosition="center"
              styleLoadIndicatorPosition="center bottom"
              style="width: 200px; height: 200px"
              @processfile="upload(imageFile[0].file)"
            ></file-pond>
          </div>
          <v-overlay
            v-if="avatar"
            :absolute="true"
            :value="overlay"
            color="white"
          >
            <v-card width="300" light>
              <vue-cropper
                ref="cropper"
                :aspect-ratio="1 / 1"
                alt="Source Image"
                :src="this.$config.strapi.url + avatar.url"
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
                  @click="cropImage"
                  ><v-icon small class="mr-1">mdi-crop</v-icon
                  >Beschneiden</v-btn
                >
              </div>
            </v-card>
          </v-overlay>
          <v-btn color="primary" block @click="finish">
            <v-icon class="pr-1">mdi-content-save</v-icon> Profil speichern
          </v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-expand-transition>
  </div>
</template>

<script>
export default {
  name: "CoachingSelection",
  props: {
    info: {
      type: Object,
      default: () => {},
    },
    avatar: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      coach: {
        helpTitle: "Ihre Fachgebiete",
        helpSubtitle:
          "Bitte wählen Sie die Fachgebiete aus, zu denen Sie Beratung anbieten möchten.",
        picTitle: "Foto",
        picSubtitle: "Sammeln Sie Sympathiepunkte",
        bioTitle: "Kurzbeschreibung",
        bioSubtitle: "Damit die Frauen Ihr Angebot besser einschätzen können.",
      },
      topics: ["Beratung", "Coaching", "Supervision"],
      selectedTopic: null,
      changeProfession: this.info.profession,
      changeQuote: this.info.quote,
      changeDescription: this.info.description,
      changeHistory: this.info.history,
      e6: 1,
      panel: [0],
      imageFile: null,
      changeImg: false,
      cropImg: "",
      cropData: null,
      isLoading: false,
      overlay: false,
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Fotogröße sollte kleiner als 2 MB sein.",
        (value) => !!value || "Lade ein Foto hoch.",
      ],
      yearsAgo: new Date().getFullYear() - 100,
    };
  },
  mounted() {
    this.selectedTopic = this.info.topicArea;
  },
  fetchOnServer: false,
  methods: {
    removeImage() {
      console.log("avatar id", this.avatar.id);
      this.$strapi.$http.$delete("upload/files/" + this.avatar.id).then(() => {
        this.$store.dispatch("changeAvatar", null);
        this.$emit("changeAvatarPreview", null);
      });
    },
    cropImage() {
      this.removeImage();
      this.cropData = JSON.stringify(
        this.$refs.cropper.getCropBoxData(),
        null,
        4
      );
      this.$refs.cropper.getCroppedCanvas(this.cropData).toBlob((blob) => {
        console.log("blob", blob);
        this.upload(blob, true);
      });
    },
    finish() {
      const data = {
        ...this.$store.getters["getActiveUser"],
        topicArea: this.selectedTopic,
        description: this.changeDescription,
        quote: this.changeQuote,
        history: this.changeHistory,
        profession: this.changeProfession,
      };
      console.log("data", data);
      this.$store.dispatch("changeData", data);
      this.$emit("selection", data);
    },
    upload(file, close = false) {
      console.log("file", file);
      const form = new FormData();
      form.append("files", file);
      this.$strapi.$http.$post("upload", form).then((res) => {
        this.$strapi.$users
          .update(this.info.id, {
            avatar: res[0],
          })
          .then((r) => {
            console.log("updated", r);
          })
          .catch((e) => {
            this.$store.dispatch("errorhandling", e);
          });
        this.$store.dispatch("changeAvatar", res[0]);
        this.$emit("changeAvatarPreview", res[0]);
        this.isLoading = false;
        this.changeImg = false;
        this.overlay = !close;
      });
    },
  },
};
</script>
<style scoped>
.v-expansion-panel-content__wrap {
  padding: 0;
}
</style>
