<template>
  <v-form 
    ref="register"
    v-model="valid"
    lazy-validation>
    <v-text-field v-model="username" label="Name"></v-text-field>
    <v-text-field v-model="email" label="Email" type="email"></v-text-field>
    <v-text-field v-model="password" label="Passwort" type="password"></v-text-field>
    <v-btn @click="register" :disabled="submitDisabled">{{submitText}}</v-btn>
    <v-alert v-if="alert.on" type="error" color="red">{{alert.text}}</v-alert>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      valid: true,
      username: null,
      email: null,
      password: null,
      submitText: "registrieren",
      submitDisabled: false,
      alert: {
        on: false,
        text: '',
      }
    };
  },
  methods: {
    async register() {
      // this.$refs.register.validate()
      this.submitDisabled = true
      await this.$axios
        .$post('auth/local/register', {
          username: this.username,
          email: this.email,
          password: this.password,
        })
        .then((response)=>{
          this.submitText = "sended"
          console.log('Well done!', response);
          console.log('User profile', response.user);
          console.log('User token', response.jwt);

          this.$store.commit('changeUser', response.user)
          this.$store.commit('changeJWT', response.jwt)
          
        })
        .catch((error)=>{
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);

            this.alert.on = true
            this.alert.text = error.response.data.error.message

          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    },
  },
};
</script>