<template>
  <v-row class="ma-0">
    <v-col cols="12" md="6" height="100%" class="pa-0">
      <v-sheet color="secondary" dark height="100%">
        <v-container
          style="max-width: 450px; position: sticky; top: 100px"
          class="ma-auto"
        >
          <h1 class="text-h2 white--text text-uppercase pb-8">
            SCHÖN, DASS DU DA BIST! <br />DU KANNST DIREKT LOSLEGEN.
          </h1>
          <p>{{ email }}</p>
          <p>Bitte schließe als erstes deine Registrierung ab.</p>
          <v-icon large>mdi-arrow-right-thin</v-icon></v-container
        ></v-sheet
      ></v-col
    ><v-col cols="12" md="6" class="pa-0">
      <v-container>
        <v-stepper v-if="memberships" v-model="stepper" elevation="0">
          <v-stepper-header style="box-shadow: none">
            <v-stepper-step
              step="1"
              :complete="stepper > 1"
              :editable="stepper > 1 && stepper < 3"
              :color="stepper > 1 ? 'success' : 'primary'"
            >
              Anliegen
            </v-stepper-step>
            <v-divider
              v-if="membership ? membership.id === 'Coach' : false"
            ></v-divider>
            <v-stepper-step
              v-if="membership ? membership.id === 'Coach' : false"
              step="2"
              :complete="stepper > 2"
              :editable="stepper > 2 && stepper < 3"
              :color="stepper > 2 ? 'success' : 'primary'"
            >
              Benutzername
            </v-stepper-step>
            <v-divider
              v-if="membership ? membership.id === 'Coach' : false"
            ></v-divider>
            <v-stepper-step
              v-if="membership ? membership.id === 'Coach' : false"
              step="3"
              :complete="stepper > 3"
            >
              Verifizierung
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items class="pb-4">
            <v-stepper-content step="1">
              <h2 class="text-h2 secondary--text pb-4">Dein/Ihr Anliegen</h2>
              <p class="caption">Bitte wähle zwischen</p>
              <v-item-group mandatory v-model="membership">
                <v-row>
                  <v-col v-for="(n, i) in memberships" :key="i" cols="12" sm="6">
                    <v-item v-slot="{ active, toggle }" :value="n">
                      <v-card
                        :color="active ? 'primary' : 'grey'"
                        class="
                          d-flex
                          flex-column
                          justify-center
                          align-center
                          pa-8
                        "
                        dark
                        height="200"
                        @click="toggle"
                      >
                        <v-icon large class="pr-2">{{ n.icon }}</v-icon>
                        <p class="ma-0 text-center" style="padding-top: 2px">
                          {{ n.description }}
                        </p>
                      </v-card></v-item
                    ></v-col
                  ></v-row
                ></v-item-group
              >
              <v-btn
                v-if="membership ? membership.id === 'Coach' : false"
                color="secondary"
                class="mt-4"
                style="float: right"
                @click="stepper++"
                >Weiter</v-btn
              >
              <v-btn
                v-else
                color="secondary"
                class="mt-4"
                style="float: right"
                :loading="loading"
                exact
                @click="updateProfile"
                >Fertig</v-btn
              >
            </v-stepper-content>
          </v-stepper-items>
          <v-stepper-items>
            <v-stepper-content step="2">
              <h2 class="text-h2 secondary--text pb-4">Anmeldung</h2>
              <p>
                Ihr Vor- und Nachname werden in Ihrem Profil öffentlich sichtbar
                sein.
              </p>
              <v-form ref="form" v-model="validMem" class="pt-8" autocomplete="on">
                <v-text-field
                  v-model="firstName"
                  class="secondary--text font-weight-bold"
                  :rules="rules.textRules"
                  label="Vorname"
                  type="name"
                  name="fname"
                  autocomplete="given-name"
                ></v-text-field>
                <v-text-field
                  v-model="lastName"
                  class="secondary--text font-weight-bold"
                  :rules="rules.textRules"
                  label="Nachname"
                  type="name"
                  name="lname"
                  autocomplete="family-name"
                ></v-text-field>
                <v-btn
                  color="secondary"
                  class="mt-4"
                  style="float: right"
                  :loading="loading"
                  :disabled="!validMem"
                  @click="updateProfile"
                  >Weiter</v-btn
                ></v-form
              >
            </v-stepper-content></v-stepper-items
          >
          <v-stepper-items>
            <v-stepper-content step="3">
              <SharedVerificationPage
                editprofile
                :userdata="userdata"
              /> </v-stepper-content
          ></v-stepper-items>
        </v-stepper>
        <v-alert v-if="alert.isActive" type="alert" color="error">{{
          alert.message
        }}</v-alert>
      </v-container></v-col
    ></v-row
  >
</template>

<script>
export default {
  name: "UpdateProfile",
  middleware: "authNew",
  data() {
    return {
      validMem: false,
      stepper: 1,
      email: null, //this.$store.getters['modules/user/user'].claims.email,
      lastName: null,
      firstName: null,
      rules: {
        textRules: [
          // (v) => !!v || 'Bitte ausfüllen',
          (v) => (v && v.length >= 3) || "mind. 3 Zeichen lang",
        ],
        passwordRules: [
          (v) =>
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(
              v
            ) || "Ihr Passwort erfüllt nicht alle Vorgaben.",
        ],
        passwordRules2: [
          (v) => !!v || "Passwortüberprüfung nicht vergessen",
          (v) =>
            (!!v && v === this.password) || "Passwörter müssen übereinstimmen",
        ],
      },
      password: "",
      hidePassword: true,
      password2: "",
      showError: false,
      loading: false,
      roleTypes: [],
      memberships: [
        {
          description: "Ich suche Beratung",
          icon: "mdi-face-woman",
          id: "Woman",
          name: "Frau",
        },
        {
          description: "Ich möchte Beratung anbieten",
          icon: "mdi-message",
          id: "Coach",
          name: "Beratung",
        },
      ],
      membership: null,
      userdata: null,
      alert: {
        isActive: false,
        message: "",
      },
    };
  },
  async mounted() {
    this.membership = this.memberships[0];
    this.email = window.localStorage.getItem("emailForSignIn");

    const res = (await this.$strapi.find("users-permissions/roles")).roles;
    res.forEach((role) => {
      if (role.type == "coach") this.roleTypes.push(role);
      if (role.type == "woman") this.roleTypes.push(role);
    });
    // on the register function its not possible (any more?!) to add the variable roleName -> maybe change to role: authenticated
    if (this.$strapi.user.roleName != "authenticated") {
      if (this.$strapi.user.roleName == "woman") this.$router.push("/frauen");
      this.userdata = this.$store.getters["getActiveUser"];
      this.membership = this.memberships[1];
      this.stepper = 3;
    }
  },
  methods: {
    updateProfile() {
      this.loading = true;
      const d = new Date();

      var username = this.firstName
        ? this.firstName.toLowerCase() + "-" + this.lastName.toLowerCase()
        : "FR-" +
          d.getMilliseconds().toString().slice(0, 1) +
          d.getSeconds().toString() +
          d.getDay().toString() +
          d.getMonth().toString() +
          d.getFullYear().toString().slice(2);

      this.$strapi
        .count("users", {
          username: username,
        })
        .then((res) => {
          this.$console('res', res)
          username = res == 0 ? username : username + "-" + res++;

          const data = {
            role: this.roleTypes.find(
              (r) => r.type == this.membership.id.toLowerCase()
            ).id,
            roleName: this.membership.id.toLowerCase(),
            displayName: this.firstName+' '+this.lastName,
            username: username,
          };

          this.$console(this.roleTypes[0])

          this.$strapi.$users.update(this.$strapi.user.id, data)
            .then((newU) => {
              this.$console("newU", newU);
              this.alert.isActive = false;
              this.$store.dispatch("changeData",newU).then(() => {
                window.localStorage.removeItem("emailForSignIn");
                this.loading = false;
                this.userdata = this.$store.getters["getActiveUser"];
                this.$console('new UserData', this.$strapi.user.roleName);
                this.membership.id === "Coach"
                  ? this.stepper++
                  : this.$router.push("/frauen");
              });
            })
            .catch((err) => {
              this.alert.isActive = true;
              this.alert.message = err.response.data.error.message;
              this.loading = false;
              this.$store.dispatch("errorhandling", err);
            });
        });
    },
  },
};
</script>
