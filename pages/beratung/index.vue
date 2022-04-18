<template>
  <v-container v-if="user">
    <client-only>
      <p class="caption mb-0 font-weight-bold">Hallo</p>
      <h1 v-if="user && user.public" class="text-h1 secondary--text">
        {{ user.public.firstName }} {{ user.public.lastName }}
      </h1>
    </client-only>
    <CoachFulfilRegistration />
    <div
      v-if="
        !!this.private &&
        this.private.stripe &&
        this.private.verifySetting.verified
      "
    >
      <h2 class="primary--text mb-2">Anfragen</h2>

      <div v-if="requests != null">
        <div v-if="requests.length !== 0">
          <v-expansion-panels>
            <v-expansion-panel v-for="(item, i) in requests" :key="i">
              <div
                v-if="
                  item.acceptedDate
                    ? new Date(
                        item.acceptedDate.date + ' ' + item.acceptedDate.time
                      ) >= newDate
                    : true
                "
              >
                <v-expansion-panel-header
                  color="grey lighten-5"
                  class="d-flex align-center justify-start"
                >
                  <v-avatar
                    class="mr-2 flex-shrink-1 flex-grow-0"
                    :style="'border: 1px solid ' + item.womanColor"
                  >
                    <!-- <v-img
                    lazy-src="woman-icon-sichere-zuflucht.svg"
                    src="woman-icon-sichere-zuflucht.svg"
                    :style="'border: 1px solid ' + item.womanColor"
                    :color="item.womanColor"
                    max-height="40"
                    max-width="40"
                  ></v-img> -->
                    <SharedWomanIcon :color="item.womanColor" class="pa-2" />
                  </v-avatar>
                  <div
                    class="d-flex flex-column flex-grow-0 flex-shrink-0"
                    style="position: relative"
                  >
                    <p
                      class="mb-0"
                      style="
                        position: absolute;
                        top: -50%;
                        font-size: 0.5em !important;
                      "
                    >
                      KryptoNr. Frau
                    </p>
                    <p
                      class="font-weight-bold mb-0"
                      :style="'color: ' + item.womanColor"
                    >
                      {{ item.womanUserName }}
                    </p>
                  </div>

                  <div v-if="item.acceptedDate">
                    <v-chip
                      v-if="
                        new Date(
                          item.acceptedDate.date + ' ' + item.acceptedDate.time
                        ) <= new Date()
                      "
                      class="ma-2 flex-shrink-0 flex-grow-1"
                      color="success"
                      text-color="white"
                    >
                      laufend...
                    </v-chip>
                    <v-chip
                      v-else
                      class="ma-2 flex-shrink-0 flex-grow-1"
                      color="success"
                      text-color="white"
                    >
                      bereit
                    </v-chip>
                  </div>

                  <div v-else-if="item.coachAnswered">
                    <v-chip
                      class="ma-2 flex-shrink-0 flex-grow-1"
                      color="orange"
                      text-color="white"
                    >
                      Antwort abwarten
                    </v-chip>
                  </div>
                  <div v-else>
                    <v-chip
                      class="ma-2 flex-shrink-0 flex-grow-1"
                      color="red"
                      text-color="white"
                    >
                      unbearbeitet
                    </v-chip>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card elevation="0">
                    <v-card-text
                      ><v-sheet
                        v-if="item.message"
                        color="grey lighten-5 pa-3 my-4"
                      >
                        <p
                          class="caption ma-0 grey--text"
                          style="
                            transform: translateY(-22px);
                            position: absolute;
                          "
                        >
                          Nachricht
                        </p>
                        <p class="mb-0">{{ item.message }}</p></v-sheet
                      >
                      <div v-if="!item.coachAnswered" class="pt-4">
                        <v-select
                          v-model="selectedVideoType"
                          :items="videoTypes"
                          outlined
                          hide-details
                          label="Videoanbieter auswählen"
                          class="mb-4"
                        ></v-select>
                        <v-list>
                          <v-list-item-group>
                            <v-list-item
                              v-for="(d, di) in item.suggestions"
                              :key="di"
                            >
                              <v-list-item-content>
                                <v-list-item-title
                                  class="font-weight-bold"
                                  style="font-size: 1em"
                                  >{{ formatDate(d.date) }}
                                </v-list-item-title>
                                <p class="caption">{{ d.time }} Uhr</p>
                              </v-list-item-content>
                              <v-list-item-icon>
                                <v-icon @click="eraseDate(di, item.suggestions)"
                                  >mdi-close
                                </v-icon>
                              </v-list-item-icon>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                        <UtilsDatePicker :item="item" />
                        <p class="mt-2 mb-0 pa-2 caption">
                          Bitte füge mind. 3 Termine hinzu.
                        </p>
                      </div>

                      <div v-else-if="item.acceptedDate">
                        <p class="caption">Bestätigter Termin</p>
                        <b
                          >{{ formatDate(item.acceptedDate.date) }} |
                          {{ item.acceptedDate.time }}
                          <span class="caption">(50min)</span>
                        </b>
                        <v-divider></v-divider>
                        <v-btn
                          class="my-2"
                          color="success"
                          target="_blank"
                          :href="
                            item.videoType === 'sicherer Anbieter'
                              ? item.video
                              : item.video.codeArzt
                          "
                          >zum Videocall ({{ item.videoType }})
                        </v-btn>
                      </div>

                      <v-banner v-else>
                        Es wurde noch kein Termin bestätigt. Ihre
                        vorgeschlagenen Termine sind:<br /><br />
                        <span
                          v-for="(d, di) in item.suggestions"
                          :key="di"
                          class="pt-4"
                          ><b>{{ formatDate(d.date) }}</b
                          ><br />
                          {{ d.time }} Uhr<br /><br
                        /></span> </v-banner
                    ></v-card-text>
                    <v-card-actions class="d-flex justify-end">
                      <v-btn
                        v-if="!item.coachAnswered"
                        :loading="loading"
                        :disabled="item.suggestions.length < 3"
                        color="success"
                        @click="addSuggestions(item)"
                        >Termine vorschlagen
                      </v-btn>
                      <v-dialog v-model="isDelete" persistent max-width="290">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            small
                            text
                            color="grey"
                            v-bind="attrs"
                            v-on="on"
                            >Termin absagen
                          </v-btn>
                        </template>
                        <v-alert type="error" color="error" class="mt-2 ma-2"
                          ><p>Wirklich absagen?</p>

                          <v-btn
                            light
                            class="mr-1"
                            :loading="eraseLoading"
                            @click="cancel(item)"
                            >Ja, absagen
                          </v-btn>
                          <v-btn light @click="isDelete = false"> nein</v-btn>
                        </v-alert>
                      </v-dialog>
                    </v-card-actions>
                  </v-card>
                </v-expansion-panel-content>
              </div>
            </v-expansion-panel>
          </v-expansion-panels>
          <div class="my-8 d-flex justify-center">
            <v-btn text color="grey" @click="showOld = !showOld"
              >vergangene Termine
              {{ showOld ? 'verbergen' : 'anzeigen' }}</v-btn
            >
          </div>
          <v-expansion-panels v-if="showOld">
            <v-expansion-panel v-for="(item, i) in requests" :key="i">
              <div
                v-if="
                  item.acceptedDate
                    ? new Date(
                        item.acceptedDate.date + ' ' + item.acceptedDate.time
                      ) < newDate
                    : false
                "
              >
                <v-expansion-panel-header
                  color="grey lighten-5"
                  class="d-flex align-center justify-start"
                >
                  <v-avatar
                    class="mr-2 flex-shrink-1 flex-grow-0"
                    :style="'border: 1px solid ' + item.womanColor"
                  >
                    <SharedWomanIcon :color="item.womanColor" class="pa-2" />
                  </v-avatar>
                  <div
                    class="d-flex flex-column flex-grow-0 flex-shrink-0"
                    style="position: relative"
                  >
                    <p
                      class="mb-0"
                      style="
                        position: absolute;
                        top: -50%;
                        font-size: 0.5em !important;
                      "
                    >
                      KryptoNr. Frau
                    </p>
                    <p
                      class="font-weight-bold mb-0"
                      :style="'color: ' + item.womanColor"
                    >
                      {{ item.womanUserName }}
                    </p>
                  </div>

                  <div>
                    <v-chip
                      class="ma-2 flex-shrink-0 flex-grow-1"
                      color="grey"
                      text-color="white"
                    >
                      vergangen
                    </v-chip>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-card elevation="0">
                    <v-card-text
                      ><v-sheet
                        v-if="item.message"
                        color="grey lighten-5 pa-3 my-4"
                      >
                        <p
                          class="caption ma-0 grey--text"
                          style="
                            transform: translateY(-22px);
                            position: absolute;
                          "
                        >
                          Nachricht
                        </p>
                        <p class="mb-0">{{ item.message }}</p></v-sheet
                      >
                      <div v-if="item.acceptedDate">
                        <p class="caption">Stattgefunden am</p>
                        <b
                          >{{ formatDate(item.acceptedDate.date) }} |
                          {{ item.acceptedDate.time }}
                          <span class="caption">(50min)</span>
                        </b>
                      </div>
                    </v-card-text>
                    <v-card-actions class="d-flex justify-end">
                      <v-dialog v-model="isDelete" persistent max-width="290">
                        <template #activator="{ on, attrs }">
                          <v-btn
                            small
                            text
                            color="grey"
                            v-bind="attrs"
                            v-on="on"
                            >Termin löschen
                          </v-btn>
                        </template>
                        <v-alert type="error" color="error" class="mt-2 ma-2"
                          ><p>Wirklich löschen?</p>

                          <v-btn
                            light
                            class="mr-1"
                            :loading="eraseLoading"
                            @click="cancel(item)"
                            >Ja, löschen
                          </v-btn>
                          <v-btn light @click="isDelete = false"> nein</v-btn>
                        </v-alert>
                      </v-dialog>
                    </v-card-actions>
                  </v-card>
                </v-expansion-panel-content>
              </div>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        <p v-else class="caption">
          <b>Noch keine existierenden Anfragen.</b><br />
          Sobald eine Frau eine Anfrage an Sie stellt, wird diese hier
          angezeigt.
        </p>
      </div>
      <v-sheet v-else elevation="2" class="pa-2"
        ><v-skeleton-loader
          class="mx-auto"
          max-width="300"
          type="text, text, text, text"
        ></v-skeleton-loader
      ></v-sheet>
    </div>
  </v-container>
</template>

<script>
export default {
  middleware: 'authCoach',
  data() {
    return {
      requests: null,
      videoTypes: ['sicherer Anbieter', 'zertifizierter Anbieter'],
      selectedVideoType: 'sicherer Anbieter',
      loading: false,
      isDelete: false,
      eraseLoading: false,
      showOld: false,
      newDate: new Date(new Date().setHours(new Date().getHours() - 1)),
    }
  },
  async fetch() {
    const req = (
      await this.$fire.functions.httpsCallable('request-getRequests')()
    ).data

    this.requests = req.sort((a, b) => {
      return a.createdAt._seconds - b.createdAt._seconds
    })
  },
  fetchOnServer: false,
  computed: {
    coachName() {
      return this.user.public.firstName + ' ' + this.user.public.lastName
    },
    user() {
      return this.$store.getters['getActiveUser']
    },
    private() {
      return this.$store.getters['modules/user/private']
    },
  },
  methods: {
    cancel(doc) {
      this.eraseLoading = true
      this.$fire.functions
        .httpsCallable('request-delete')({
          docId: doc.id,
          email: this.user.private.email,
        })
        .then(() => {
          this.isDelete = false
          this.eraseLoading = false
          this.$emit('cancel')
        })
    },
    addSuggestions(request) {
      this.loading = true
      this.$fire.functions
        .httpsCallable('request-addSuggestions')({
          coachName: this.coachName,
          suggestions: request.suggestions,
          requestId: request.id,
          videoType: this.selectedVideoType,
        })
        .then(() => {
          request.coachAnswered = true
          request.updatedAt = new Date()
          this.loading = false
        })
    },
    eraseDate(d, list) {
      const d2 = d + 1
      list.splice(d, d2)
    },
    formatDate(date) {
      const d = new Date(date)
      return d.toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
  },
}
</script>
