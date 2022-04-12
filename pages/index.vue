<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline">
          Testing
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col  v-for="(u, n) in userList" :key="n" class="text-center">
              {{u.username}}
            </v-col>
          </v-row>
        </v-card-text>
        <p v-if="meetings">{{meetings}}</p>
        <v-card-actions>
          <v-btn @click="login">login</v-btn>
          <v-spacer />
          <v-btn :disabled="user ? false : true" @click="load">load</v-btn>
          <v-btn :disabled="user ? false : true" @click="create">create</v-btn>
          <SendEmailBtn to="bene-groovy@web.de" :template="mailTemplate(user.email)" />
        </v-card-actions>
        
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
// https://www.youtube.com/watch?v=vcopLqUq594
export default {
  name: 'IndexPage',
  data(){
    return{
      meetings: '',
      user: '',
      userList:'',
      jwt: null,
      mailTemplate(email) {
        return {
          subject: "Hello Nuxt Template",
          text: 
`Welcome on mywebsite.fr!
Your account is now linked with: ${email}.`,
          html: 
`<h1>Welcome on mywebsite.fr!</h1>
<p>Your account is now linked with: ${email}.<p>`,
        }
      }
    }
  },
  async fetch() {
    this.userList = await this.$axios.$get('users')
  },
  methods: {
    async login(){
      /*this.$store.dispatch('login', {
        email: 'random@random.com',
        password: 'password!',
      })*/
      await this.$axios.$post('/auth/local', {
        identifier: 'random@random.com',
        password: 'password!',
      }).then((response)=>{
        this.$store.commit('setUserData', response.user)
        this.$store.commit('setJWT', response.jwt)
        console.log('logged in as: ', response.user)
        this.user = response.user
        this.jwt = response.jwt
      }).catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      })
    },
    load(){
      this.$axios.$get('meetings',{
        headers: {
          Authorization: `Bearer ${this.$store.state.jwt}`
        },
      })
      .then((response)=>{
        console.log('meetings: ',response.data)
        this.meetings = response.data
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      })
    },
    create(){
      const data = {
        message: "Test API",
      }
      this.$axios.$post('/meetings', {data}, {
        headers: {
          Authorization: `Bearer ${this.$store.state.jwt}`
        },
      })
      .then(async()=>{
        this.load()
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      })
    },
    
  }
}

</script>
