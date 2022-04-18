<template>
  <v-btn 
    @click="sendEmail" 
    :disabled="submitDisabled"
    :loading="loading"
    :color="color"
  >{{text}}</v-btn>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
    },
    template: {
      type: Object,
    },
    color: {
      type: String,
      defualt: 'secondary',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      defualt: 'secondary',
    },
  },
  data(){
    return {
      submitDisabled: this.disabled,
    }
  },
  methods: {
    async sendEmail() {
      this.submitDisabled = true
      await this.$axios
        .$post("email", {
          to: this.to,
          from: "Sichere Zuflucht <kontakt@sichere-zuflucht.de>",
          replyTo: "kontakt@sichere-zuflucht.de",
          subject: this.template.subject,
          text: this.template.text,
          html: this.template.html
        })
        .then(()=>{
          // this.text = "sended"
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
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    },
  },
};
</script>