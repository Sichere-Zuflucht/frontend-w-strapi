<template>
  <v-btn @click="sendEmail" :disabled="submitDisabled">{{submitText}}</v-btn>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
    },
    template: {
      type: Object,
    }
  },
  data(){
    return {
      submitText: 'send email',
      submitDisabled: false,
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
          this.submitText = "sended"
          
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