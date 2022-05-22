<template>
  <div>
    <v-expand-transition>
      <v-stepper v-model="e6" vertical class="mx-auto">
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
          <v-row class="mb-4">
            <v-col class="d-flex align-center justify-center">
              <v-avatar size="80">
                <v-img
                  v-if="changeAvatar"
                  :src="'http://localhost:1337'+changeAvatar"
                />
                <SharedCoachIcon
                  v-else
                  color="#b3b3b3"
                  style="border: 1px solid #b3b3b3"
                  class="pa-2"
                />
              </v-avatar>
            </v-col>
            <v-col class="d-flex align-center justify-center">
              <v-btn color="secondary" @click="overlay = !overlay"
                >Foto auswählen
              </v-btn>
              <v-overlay :absolute="true" :opacity="1" :value="overlay">
                <v-form ref="uploadForm" v-model="uploadRef">
                  <v-file-input
                    v-model="imageFile"
                    :rules="rules"
                    accept="image/png, image/jpeg, image/png"
                    placeholder="Foto hochladen"
                    prepend-icon="mdi-camera"
                    label="Foto auswählen"
                    :show-size="1000"
                    style="width: 220px"
                    required
                  ></v-file-input>
                  <v-btn text @click="overlay = !overlay"> Abbrechen</v-btn>
                  <v-btn
                    :loading="isLoading"
                    color="success"
                    :disabled="!uploadRef"
                    @click="upload(imageFile)"
                  >
                    Foto hochladen
                  </v-btn>
                </v-form>
              </v-overlay>
            </v-col>
          </v-row>

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
  name: 'CoachingSelection',
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
        helpTitle: 'Ihre Fachgebiete',
        helpSubtitle:
          'Bitte wählen Sie die Fachgebiete aus, zu denen Sie Beratung anbieten möchten.',
        picTitle: 'Foto',
        picSubtitle: 'Sammeln Sie Sympathiepunkte',
        bioTitle: 'Kurzbeschreibung',
        bioSubtitle: 'Damit die Frauen Ihr Angebot besser einschätzen können.',
      },
      topics: ["Beratung","Coaching", "Supervision",
      ],
      selectedTopic: null,
      changeProfession: this.info.profession,
      changeQuote: this.info.quote,
      changeDescription: this.info.description,
      changeHistory: this.info.history,
      e6: 1,
      panel: [0],
      uploadRef: true,
      changeAvatar: null,
      imageFile: [],
      isLoading: false,
      overlay: false,
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          'Fotogröße sollte kleiner als 2 MB sein.',
        (value) => !!value || 'Lade ein Foto hoch.',
      ],
      yearsAgo: new Date().getFullYear() - 100,
    }
  },
  async fetch() {
    /*this.topics = (
      await this.$fire.firestore.collection('coachingTypes').get()
    ).docs.map((doc) => doc.data())*/
  },
  mounted() {
    /*for (const v in this.info.topicArea) {
      this.selectedTopic = this.info.topicArea[v]
    }*/
    console.log('info',this.info)
    this.changeAvatar = this.avatar ? this.avatar.url : null
    this.selectedTopic = this.info.topicArea
  },
  computed: {
    test() {
      console.log('info2',this.info)
      return "test"
    }
  },
  fetchOnServer: false,
  /*watch: {
    changeAvatar: function (newValue, oldValue) {
      console.log("newValue: %s, previousValue: %s", newValue, oldValue);
    },
  },*/
  methods: {
    finish() {
      const data = {
        ...this.$store.getters['getActiveUser'],
        topicArea: this.selectedTopic,
        description: this.changeDescription,
        quote: this.changeQuote,
        history: this.changeHistory,
        profession: this.changeProfession,
      }
      console.log('data',data)
      this.$store.dispatch('changeData',data)
      this.$emit('selection',data)
    },
    upload(file){
      console.log("file", file)
      const form = new FormData()
      form.append("files", file)
      console.log(this.$strapi.user.roleName)
      this.$strapi.$http.$post('upload', form).then((res)=>{
        this.changeAvatar = res[0].url
        this.$store.dispatch('changeAvatar',res[0])
        this.imageFile = ''
        this.isLoading = false
        this.overlay = false
      })
    }
    /*upload(file) {
      this.isLoading = true
      const uploadTask = this.$fire.storage
        .ref()
        .child('profiles/' + this.$store.getters['getActiveUser'].id)
        .put(file)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // eslint-disable-next-line no-console
          console.log('Upload is ' + progress + '% done')

          switch (snapshot.state) {
            case 'paused':
              // eslint-disable-next-line no-console
              console.log('Upload is paused')
              break
            case 'running':
              // eslint-disable-next-line no-console
              console.log('Upload is running')
              break
          }
          // return (this.progress[i] = { loaded: progress })
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case 'storage/unauthorized':
              // User doesn't have permission to access the object
              break

            case 'storage/canceled':
              // User canceled the upload
              break

            case 'storage/unknown':
              // Unknown error occurred, inspect error.serverResponse
              break
          }
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            this.changeAvatar = downloadURL
            this.$store.dispatch('modules/user/setAvatar', downloadURL)
          })
          this.imageFile = ''
          this.isLoading = false
          this.overlay = false
        }
      )
    },*/
  },
}
</script>
<style scoped>
.v-expansion-panel-content__wrap {
  padding: 0;
}
</style>
