<template>
  <div v-if="requests != null">
    <v-expansion-panels v-if="requests.length != 0">
      <v-expansion-panel v-for="(item, i) in requests" :key="i">
        <div v-if="!oldlist">
          <div
            v-if="
              item.attributes.acceptedDate
                ? new Date(item.attributes.acceptedDate) >= newDate
                : true
            "
          >
            <v-expansion-panel-header
              color="grey lighten-5"
              class="d-flex align-center justify-start"
            >
              <v-avatar
                class="mr-2 flex-shrink-1 flex-grow-0"
                style="border: 1px solid lightgrey"
              >
                <SharedWomanIcon color="black" class="pa-2" />
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
                  KryptoNr.
                </p>
                <p class="font-weight-bold mb-0">
                  {{
                    item.attributes.users_permissions_users.data[0].attributes
                      .username
                  }}
                </p>
              </div>

              <div v-if="item.attributes.acceptedDate">
                <v-chip
                  v-if="new Date(item.attributes.acceptedDate) <= new Date()"
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

              <div v-else-if="item.attributes.coachAnswered">
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
                    v-if="item.attributes.message"
                    color="grey lighten-5 pa-3 my-4"
                  >
                    <p
                      class="caption ma-0 grey--text"
                      style="transform: translateY(-22px); position: absolute"
                    >
                      Nachricht
                    </p>
                    <p class="mb-0">
                      {{ item.attributes.message }}
                    </p></v-sheet
                  >
                  <div v-if="!item.attributes.coachAnswered" class="pt-4">
                    
                    <v-select
                      v-model="selectedVideoType"
                      :hint="selectedVideoType == 'normal' ? descrNormal : descrSecure"
                      :items="videoTypes"
                      outlined
                      label="Videoanbieter auswählen"
                      persistent-hint
                      class="mb-4"
                    ></v-select>
                    <v-list>
                      <v-list-item-group>
                        <v-list-item
                          v-for="(d, di) in item.attributes.suggestions"
                          :key="di"
                        >
                          <v-list-item-content>
                            <v-list-item-title
                              class="font-weight-bold"
                              style="font-size: 1em"
                              >{{ formatDate(d.date) }}
                            </v-list-item-title>
                            <p class="caption">{{ formatTime(d.date) }} Uhr</p>
                          </v-list-item-content>
                          <v-list-item-icon>
                            <v-icon
                              @click="
                                eraseDate(di, item.attributes.suggestions)
                              "
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

                  <div v-else-if="item.attributes.acceptedDate">
                    <p class="caption">Bestätigter Termin</p>
                    <b
                      >{{ formatDate(item.attributes.acceptedDate) }} |
                      {{ formatTime(item.attributes.acceptedDate) }}
                      <span class="caption">(50min)</span>
                    </b>
                    <v-divider></v-divider>
                    <v-btn
                      class="my-2"
                      color="success"
                      target="_blank"
                      :href="
                        item.attributes.videoType === 'normal'
                          ? getCodeQuery(item.attributes.videoCoach)
                          : item.attributes.videoCoach
                      "
                      >zum Videocall
                    </v-btn>
                    ({{
                      item.attributes.videoType == "normal"
                        ? "standard Videoanbieter "
                        : "zertifizierter Videoanbieter"
                    }})
                  </div>

                  <v-banner v-else>
                    Es wurde noch kein Termin bestätigt. Ihre vorgeschlagenen
                    Termine sind:<br /><br />
                    <span
                      v-for="(d, di) in item.attributes.suggestions"
                      :key="di"
                      class="pt-4"
                      ><b>{{ formatDate(d.date) }}</b
                      ><br />
                      {{ formatTime(d.date) }} Uhr<br /><br
                    /></span> </v-banner
                ></v-card-text>
                <v-card-actions class="d-flex justify-end">
                  <v-btn
                    v-if="!item.attributes.coachAnswered"
                    :loading="loading"
                    :disabled="item.attributes.suggestions.length < 3"
                    color="success"
                    @click="addSuggestions(item)"
                    >Termine vorschlagen
                  </v-btn>
                  <v-dialog v-model="isDelete" persistent max-width="290">
                    <template #activator="{ on, attrs }">
                      <v-btn small text color="grey" v-bind="attrs" v-on="on"
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
        </div>
        <div v-else-if="oldlist && showold">
          <div
            v-if="
              item.attributes.acceptedDate
                ? new Date(item.attributes.acceptedDate) < newDate
                : true
            "
          >
            <v-expansion-panel-header
              color="grey lighten-5"
              class="d-flex align-center justify-start"
            >
              <v-avatar
                class="mr-2 flex-shrink-1 flex-grow-0"
                style="border: 1px solid lightgrey"
              >
                <SharedWomanIcon class="pa-2" />
              </v-avatar>
              <div
                class="d-flex flex-column flex-grow-0 flex-shrink-0"
                style="position: relative"
              >
                <p
                  class="mb-0"
                  style="position: absolute;
                    top: -50%;
                    font-size: 0.5em !important;
                  "
                >
                  KryptoNr.
                </p>
                <p class="font-weight-bold mb-0">
                  {{
                    item.attributes.users_permissions_users.data[0].attributes
                      .username
                  }}
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
                    v-if="item.attributes.message"
                    color="grey lighten-5 pa-3 my-4"
                  >
                    <p
                      class="caption ma-0 grey--text"
                      style="transform: translateY(-22px); position: absolute"
                    >
                      Nachricht
                    </p>
                    <p class="mb-0">
                      {{ item.attributes.message }}
                    </p></v-sheet
                  >
                  <div v-if="item.attributes.acceptedDate">
                    <p class="caption">Stattgefunden am</p>
                    <b
                      >{{ formatDate(item.attributes.acceptedDate) }} |
                      {{ formatTime(item.attributes.acceptedDate) }}
                      <span class="caption">(50min)</span>
                    </b>
                  </div>
                </v-card-text>
                <v-card-actions class="d-flex justify-end">
                  <v-dialog v-model="isDelete" persistent max-width="290">
                    <template #activator="{ on, attrs }">
                      <v-btn small text color="grey" v-bind="attrs" v-on="on"
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
        </div>
      </v-expansion-panel>
    </v-expansion-panels>
    <p v-else-if="requests.length == 0 && !oldlist" class="caption">
      <b>Noch keine existierenden Anfragen.</b><br />
      Sobald eine Frau eine Anfrage an Sie stellt, wird diese hier angezeigt.
    </p>
  </div>
  <v-sheet v-else-if="requests == null && !oldlist" elevation="2" class="pa-2"
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
    user: {
      type: Object,
      default: {},
    },
    oldlist: {
      type: Boolean,
      default: false,
    },
    showold: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      requests: null,
      newDate: new Date(new Date().setHours(new Date().getHours() - 1)),
      selectedVideoType: "normal",
      videoTypes: [
        {
          text: "sicherer Anbieter",
          value: "normal",
        },
        {
          text: "zertifizierter Anbieter",
          value: "secure",
        },
      ],
      descrNormal: 'Als sicheren Anbieter nutzen wir Jitsi. Viele Gespräche können hierüber abgewickelt werden, solange keine sensiblen Daten ausgetauscht werden.',
      descrSecure: 'In seltenen Fällen lohnt es sich, unseren zertifizierten Anbieter RED zu nutzen. So zum Beispiel bei sensiblen ärztlichen Informationen.',
      loading: false,
      eraseLoading: false,
      isDelete: false,
      roleTypes: [],
    };
  },
  async mounted() {
    const res = (await this.$strapi.find("users-permissions/roles")).roles;
    res.forEach((role) => {
      if (role.type == "coach") this.roleTypes.push(role);
      if (role.type == "woman") this.roleTypes.push(role);
    });

    this.$strapi.$meetings
      .find({
        populate: "*",
        "filters[users_permissions_users]": this.$strapi.user.id,
      })
      .then((meetings) => {
        this.requests = meetings.data;
        console.log(this.requests);
      });
  },
  methods: {
    addSuggestions(request) {
      this.loading = true;
      console.log("request", request);
      const data = {
        coachAnswered: true,
        suggestions: request.attributes.suggestions,
        updatedAt: new Date().toISOString(),
        videoType: this.selectedVideoType,
      };
      console.log("data", data);
      this.$strapi.$meetings
        .update(request.id, {
          data,
        })
        .then(() => {
          request.attributes.coachAnswered = true;
          request.attributes.updatedAt = new Date();
          this.loading = false;
        });
    },
    cancel(doc) {
      this.$axios
        .get(
          `${this.$config.strapi.url}/deletemeeting?email=${this.user.email}&id=${doc.id}&acceptedDate=${doc.attributes.acceptedDate}`,
          {
            headers: {
              Authorization:
                "Bearer " +
                JSON.parse(window.localStorage.getItem("strapi_jwt")).token,
            },
          }
        )
        .then((r) => {
          this.isDelete = false;
          this.eraseLoading = false;
          this.requests = this.requests.filter((request) => request.id !== r.data.data.id);
        });
    },
    eraseDate(d, list) {
      const d2 = d + 1;
      list.splice(d, d2);
    },
    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString("de-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    formatTime(date) {
      const d = new Date(date);
      return d.toLocaleTimeString("de-DE", {
        hour: "numeric",
        minute: "numeric",
      });
    },
    getCodeQuery(d){
      const n = d.replace('//','').split('/')
      return window.location.origin + '/videomeeting/' + n[1]
    }
  },
};
</script>