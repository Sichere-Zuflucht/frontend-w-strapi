<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-row>
      <v-col v-for="(t,i) in test" :key="i" cols="4">
        <v-card v-if="t.attributes.users_permissions_users.data.length != 0">
          <v-card-text>
            <v-chip v-for="(c,j) in t.attributes.users_permissions_users.data" :key="j">
              {{c.attributes.username}}
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
      </v-row>
      <v-card>
        <v-card-title class="headline">
          Testing
          <v-btn to="meetings">meetings</v-btn>
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
          <v-btn @click="logout">logout</v-btn>
          
          <v-spacer />
          <v-btn :disabled="user ? false : false" @click="load">load</v-btn>
          <v-btn :disabled="user ? false : false" @click="create">create</v-btn>
          <SendEmailBtn to="bene-groovy@web.de" :template="mailTemplate(user.email)" />
        </v-card-actions>
        
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
// https://www.youtube.com/watch?v=vcopLqUq594
// (await this.$strapi.$meetings.find({'populate': '*'})).data

const qs = require('qs');
const query = qs.stringify({
  populate: '*', 
}, {
  encodeValuesOnly: true,
});

export default {
  data(){
    return{
      test: '',
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
    this.userList = await this.$strapi.$users.find() //this.$axios.$get('users')
    
    //await request(`${this.$strapi.options.url}/users?${query}`);//await this.$strapi.$users.find({'role': 'Coach'})
  },
  computed: {
    async test2(){
      const u = await this.$strapi.$users.find({'role': 'Coach'})
      
      return u
    }
  },
  methods: {
    async login(){
      this.$store.dispatch('login', {
        email: 'random@random.com',
        password: 'password!',
      })
      .catch((error)=>{
        this.$store.dispatch('errorhandling',error)
      })
    },
    async load(){
      const t = (await this.$strapi.$meetings.find({'populate': 'users_permissions_users'})).data// (await this.$strapi.find('meetings?populate=*')).data
      this.test = t
      //this.test = (await this.$axios.$get('meetings?populate=users_permissions_users')).data
      //this.test2 = (await this.$axios.$get('users/me')).data
      
      //this.meetings = this.$strapi.user
      /*this.$strapi.$meetings.find()
      .then((response)=>{
        this.meetings = response.data
      })
      .catch(function (error) {
        errorhandling(error)
      })*/
    },
    logout(){
      this.$store.dispatch('logout')
    },
    create(){
      const data = {
        message: "Test API",
      }
      this.$strapi.$meetings.create({data})
      .catch((error)=>{
        this.$store.dispatch('errorhandling',error) //errorhandling(error)
      })
    },
  }
}

</script>
