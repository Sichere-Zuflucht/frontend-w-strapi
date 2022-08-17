<template>
  <div>
    <UtilsBanner icon="mdi-account-cog-outline" />
    <v-container>
      <h1 class="text-h1 primary--text mb-4">Einstellungen<br />einsehen</h1>
      <small>Name:</small>
      <p>
        {{ pubData.displayName }}
      </p>
      <small>NutzerID:</small>
      <p>{{ pubData.id }}</p>
      <small>E-Mail:</small>
      <p>{{ pubData.email }}</p>
      <small>Mitglied als:</small>
      <p v-if="pubData.roleName">{{ pubData.roleName == 'Woman' ? 'gewaltbetroffene Frau' : 'Berater:in' }}</p>

      <v-btn
        :disabled="btn.disabled"
        :loading="btn.loading"
        color="secondary"
        @click="resetPassword"
        >Passwort ändern</v-btn
      >
      <div v-if="btn.success">
        <v-alert type="success" color="success"
          >Es wurde eine E-Mail an {{ pubData.email }} geschickt. Bitte folgen
          Sie den dort beschriebenen Anweisungen.</v-alert
        >
      </div>
      <v-dialog v-model="overlay" width="300">
        <template #activator="{ on }">
          <v-btn color="error" text v-on="on">Account löschen</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <h2 class="text-h2 error--text">Achtung</h2>
          </v-card-title>
          <v-card-text>
            <p>
              Bist du dir sicher, dass du dein Profil löschen möchtest? Dieser
              Vorgang ist nicht wieder Rückgängig zu machen. Alle deine Daten und Termine
              werden unwiederuflich von unserer Datenbank gelöscht.
            </p>
            <p>
              Bitte füge "Löschen" ein, wenn du dein Profil wirklich
              löschen möchtest.
            </p>
          </v-card-text>
          <v-card-actions
            ><v-form
              ref="deleteForm"
              v-model="deleteVal"
              @submit.prevent="deleteUser"
            >
              <v-text-field
                v-model="userProvidedErase"
                outlined
                label="Löschen einfügen"
                :rules="rules.delete"
                color="grey"
                required
                placeholder="Löschen"
              ></v-text-field>
              <v-btn
                color="error"
                :disabled="!deleteVal"
                :loading="deleteLoading"
                type="submit"
                >wirklich löschen</v-btn
              >
              <v-btn @click="overlay = !overlay">abbrechen</v-btn></v-form
            ></v-card-actions
          ></v-card
        >
      </v-dialog>
      <v-alert
        v-if="err.status && !overlay"
        type="error"
        color="error"
        class="mt-4"
        >{{ err.msg }}</v-alert
      >
      <v-divider class="mt-8 pt-3"></v-divider>
      <p class="caption">
        Bei Änderungswünschen gerne eine E-Mail an
        <a href="mailto:kontakt@sichere-zuflucht.de"
          >kontakt@sichere-zuflucht.de</a
        >
      </p>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  middleware({ store, redirect }) {
    // If the user is not authenticated
    if (!store.getters['modules/user/isAuthenticated']) {
      return redirect('/')
    }
  },
  data() {
    return {
      btn: {
        disabled: false,
        loading: false,
        success: false,
      },
      err: {
        status: false,
        msg: '',
      },
      overlay: false,
      userProvidedErase: null,
      deleteVal: false,
      deleteLoading: false,
      rules: {
        delete: [
          (v) => !!v || 'Passwort einfügen.',
          (v) => v == 'Löschen' || 'Löschen schreiben',
        ],
      },
    }
  },
  computed: {
    pubData() {
      return this.$store.getters['getActiveUser']
    },
  },
  methods: {
    resetPassword() {
      this.btn.loading = true
      this.$strapi.forgotPassword({ email: this.$strapi.user.email })
        .then(() => {
          this.btn.loading = false
          this.btn.disabled = true
          this.btn.success = true
        })
        .catch((error) => {
          this.err.status = true
          this.err.msg = error.code + ': ' + error.message
          // ..
        })
    },
    async deleteUser() {
      this.deleteLoading = true
      this.$strapi.$users.delete(this.$strapi.user.id)
      .then((e)=>{
        //this.$router.push('/')
        window.location.reload()
        this.deleteLoading = false
      })
      .catch((err) => {
        this.deleteLoading = false
        this.err.status = true
        this.err.msg = 'Falsches Passwort eingegeben.'
        this.overlay = false
      })
    },
  },
}
</script>
