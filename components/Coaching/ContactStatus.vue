<template>
  <v-card
    elevation="2"
    nuxt
    :dark="coachingLiesInPast"
    :ripple="clickable"
    :to="clickable ? '/berater/' + coach.id : null"
    outlined
    :style="
      'border: 1px solid ' +
      (now
        ? $vuetify.theme.themes.light.success
        : $vuetify.theme.themes.light.primary)
    "
  >
    <v-sheet
      class="d-flex"
      :style="
        'border-bottom: 1px solid ' +
        (now
          ? $vuetify.theme.themes.light.success
          : $vuetify.theme.themes.light.primary) +
        ' !important'
      "
    >
      <v-avatar v-if="coach.avatar" color="primary ma-5" size="35%">
        <v-img
          :lazy-src="
            (coach.avatar.url.includes('https') ? '' : 'http://localhost:1337') +
            coach.avatar.url
          "
          :src="
            (coach.avatar.url.includes('https') ? '' : 'http://localhost:1337') +
            coach.avatar.url
          "
        />
      </v-avatar>
      <div class="ma-5 ml-2 d-flex flex-column justify-center">
        <h2 class="secondary--text text-h2">
          {{ coach.displayName }}
        </h2>
        <h3 class="mt-2 text-h5">
          {{ coach.profession }}
        </h3>
      </div>
    </v-sheet>
    <v-card-text v-if="response">
      <p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
        Vorschläge für einen Online-Beratungstermin
      </p>
      <div v-if="!response.coachAnswered">
        Der Coach hat auf deine Anfrage noch nicht reagiert.
      </div>
      <div v-else-if="!response.acceptedDate">
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="selectedDate"
              :items="response.suggestions"
              outlined
              dense
              hide-details
              color="primary"
              label="Bitte wählen"
              class="my-2"
            >
              <template #item="{ item, on }">
                <v-list-item v-on="on">
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-bold mb-0">
                      {{ formatDate(item.date) }}
                    </v-list-item-title>
                    <div class="caption">{{ formatTime(item.date) }} Uhr</div>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <template #selection="{ item }"
                >{{ formatDate(item.date) }} | {{ formatTime(item.date) }}
              </template>
            </v-select>
            <p class="font-weight-bold mb-0 my-4">Preis: 50€</p>
            <v-btn
              color="success"
              :loading="btn.payButtonLoading"
              :disabled="!selectedDate || btn.isDisabled"
              block
              @click="pay(selectedDate)"
              >{{ btn.acceptText }}
            </v-btn>
            <v-alert v-if="btn.error" type="error">{{ btn.errorMsg }}</v-alert>
            <p class="caption">
              Nach der Terminbestätigung wirst du direkt zu unserem
              Zahlungsanbieter „stripe“ weitergeleitet. Nach deiner Zahlung
              senden wir dir eine Termin-Bestätigung per E-Mail.
            </p>
          </v-col>
        </v-row>
      </div>

      <div v-else>
        <div v-if="response.payed">
          <v-btn
            class="my-2"
            color="success"
            target="_blank"
            :disabled="coachingLiesInPast"
            :href="
              response.videoType === 'sicherer Anbieter'
                ? response.videoCoach
                : response.videoWoman
            "
            >zum Videocall
          </v-btn>
          <v-alert dark text dense color="success"
            >Zugesagt für {{ formatDate(response.acceptedDate) }} um
            {{ formatTime(response.acceptedDate) }}
          </v-alert>
        </div>
        <div v-else>
          <v-alert dark color="error" type="error"
            ><p>
              Es liegt (noch) keine Bezahlung vor. Der Bezahlungsprozess kann
              einige Minuten dauern. Bitte warten Sie ein paar Minuten und laden
              Sie die Seite dann erneut. Sollte die Fehlermeldung trotzdem noch
              existieren,
            </p>
            <!-- <v-btn @click="pay(response.acceptedDate)"
              >Bezahlen erneut versuchen</v-btn
            > -->
            <p class="caption mt-2">
              kontaktieren Sie uns unter:
              <a href="mailto:technik@sichere-zuflucht.de">
                technik@sichere-zuflucht.de</a
              >
            </p>
          </v-alert>
        </div>
      </div>
    </v-card-text>
    <v-card-actions
      v-if="!now"
      style="border-top: 1px solid lightgrey"
      class="align-stretch pa-4"
    >
      <v-btn small color="primary" outlined nuxt :to="'/berater/' + coach.id"
        >Neue Anfrage stellen
      </v-btn>
      <v-dialog v-model="isDelete" persistent max-width="290">
        <template #activator="{ on, attrs }">
          <v-btn small text color="primary" v-bind="attrs" v-on="on"
            >Termin absagen
          </v-btn>
        </template>
        <v-alert type="error" color="error" class="mt-2 ma-2"
          ><p>Wirklich absagen?</p>

          <v-btn
            light
            class="mr-1"
            :loading="eraseLoading"
            @click="cancel(response)"
            >Ja, absagen
          </v-btn>
          <v-btn light @click="isDelete = false"> nein</v-btn>
        </v-alert>
      </v-dialog>
      <v-alert v-if="error" type="error" color="error">{{ error }}</v-alert>
    </v-card-actions>
    <v-overlay :value="redirectWarning" color="black" opacity="0.8">
      <p>
        Weiterleitung zu Stripe. Dies kann ein bisschen dauern. Bitte warten...
      </p>
    </v-overlay>
  </v-card>
</template>

<script>
export default {
  name: "Coaching",
  props: {
    coach: {
      type: Object,
      default: () => {},
    },
    response: {
      type: Object,
      default: () => {},
    },
    id: {
      type: Number,
      default: null,
    },
    clickable: {
      type: Boolean,
      default: true,
    },
    now: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedDate: null,
      isDelete: false,
      eraseLoading: false,
      btn: {
        error: false,
        errorMsg: "",
        acceptText: this.response
          ? this.response.acceptedDate
            ? "Bezahlt"
            : "Termin verbindlich buchen"
          : null,
        isDisabled: false,
        payButtonLoading: false,
      },
      redirectWarning: false,
      error: null,
    };
  },
  computed: {
    coachingLiesInPast() {
      const acceptedDate = new Date(this.response.acceptedDate?.date || "");
      acceptedDate.setDate(acceptedDate.getDate() + 1);
      return !!this.response.acceptedDate && acceptedDate <= new Date();
    },
  },
  methods: {
    cancel(doc) {
      this.eraseLoading = true;
      this.$axios
        .get(
          `${this.$config.strapi.url}/deletemeeting?email=${this.coach.email}&id=${this.id}&acceptedDate=${doc.acceptedDate}`,
          {
            headers: {
              Authorization:
                "Bearer " +
                JSON.parse(window.localStorage.getItem("strapi_jwt")).token,
            },
          }
        )
        .then(() => {
          this.isDelete = false;
          this.eraseLoading = false;
          this.error = null;
          this.$emit("cancel");
        })
        .catch((err) => {
          this.isDelete = false;
          this.eraseLoading = false;
          this.error = err;
          console.log("delete error: ", err);
        });
    },
    async pay(dateInput) {
      this.btn.payButtonLoading = true;
      let redReq, data, video;
      if (this.response.videoType === "secure") {
        data = {
          //method: 'getEntryCodes',
          //date: (dateInput.date.split('T'))[0],
          //token: this.$config.redAPI,
          method: "getEntryCodes",
          date: "2019-11-27",
          token: this.$config.redAPI,
        };
        console.log("data", data);
        this.$axios
          .$post("https://redclient.redmedical.de/service/video", {
            header: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
          .then((response) => {
            console.log(response);
            if (!response.success) return (this.error = response.error);
            console.log("after error");
            this.redirectWarning = true;
          });
        /*redReq = await fetch('https://redclient.redmedical.de/service/video', {
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        console.log("redReq", redReq)
        redReq
          .json()
          .then((redRes) => {
            console.log("redRes", redRes)
            video = {
              codeArzt:
                'https://video.redmedical.de/#/login?name=' +
                this.coach.username +
                '&code=' +
                redRes.codeArzt,
              codePatient:
                'https://video.redmedical.de/#/login?name=unbekannt&code=' +
                redRes.codePatient,
            }
            this.standardPayment(video, dateInput)
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log('err: ', error)
          })*/
      } else {
        video = {
          codeArzt:
            "https://meet.jit.si/" +
            this.coach.username +
            "-meetingid-" +
            this.id, // no ?:&'"%# symbols allowed
          codePatient:
            "https://meet.jit.si/" +
            this.coach.username +
            "-meetingid-" +
            this.id,
        };
        this.redirectWarning = true;
        this.standardPayment(video, dateInput);
      }
    },
    standardPayment(v, dI) {
      this.$axios
        .$get(
          `${this.$config.strapi.url}/paywithstripe?id=${this.id}&coachStripeId=${this.coach.stripe.id}`,
          {
            headers: {
              Authorization:
                "Bearer " +
                JSON.parse(window.localStorage.getItem("strapi_jwt")).token,
            },
          }
        )
        .then((paymentID) => {
          const data = {
            acceptedDate: dI.date,
            videoCoach: v.codeArzt,
            videoWoman: v.codePatient,
            paymentID: paymentID,
          };

          this.$strapi.$meetings
            .update(this.id, {
              data,
            })
            .then((r) => {
              console.log("result", r);
              this.btn.payButtonLoading = false;
              this.btn.isDisabled = true;
              this.response.acceptedDate = dI;
              this.response.video = v;
              window.localStorage.setItem("meetingID", this.id);
              window.localStorage.setItem("sessionID", paymentID);

              this.$stripe.redirectToCheckout({
                // Make the id field from the Checkout Session creation API response
                // available to this file, so you can provide it as argument here
                // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
                sessionId: paymentID,
              });
            })
            .catch((e) => {
              this.$store.dispatch("errorhandling", e);
            });
        })
        .catch((e) => {
          this.$store.dispatch("errorhandling", e);
        });
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
  },
};
</script>
