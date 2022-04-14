<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="date"
    persistent
    width="290px"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        :color="item.suggestions.length < 3 ? 'success' : null"
        prepend-icon="mdi-calendar"
        v-on="on"
        >Datum/Uhrzeit auswählen</v-btn
      >
    </template>
    <v-date-picker
      v-if="isSelectDate"
      v-model="date"
      :min="today.toISOString().substr(0, 10)"
      scrollable
      locale="de-de"
      :first-day-of-week="1"
      :allowed-dates="allowed.dates"
    >
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        @click="
          () => {
            modal = false
            date = ''
          }
        "
      >
        Abbrechen
      </v-btn>
      <v-btn
        :disabled="!date"
        color="primary"
        @click="isSelectDate = !isSelectDate"
      >
        Uhrzeit wählen
      </v-btn>
    </v-date-picker>
    <v-time-picker
      v-else
      v-model="time"
      min="7:00"
      max="20:00"
      format="24hr"
      :allowed-hours="allowed.hours"
      :allowed-minutes="allowed.minutes"
    >
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        @click="
          () => {
            modal = false
            date = ''
            isSelectDate = true
          }
        "
      >
        Abbrechen
      </v-btn>
      <v-btn
        :disabled="!time"
        color="primary"
        @click="addDates(item.suggestions)"
      >
        Fertig
      </v-btn>
    </v-time-picker>
  </v-dialog>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      menu: false,
      isSelectDate: true,
      allowed: {
        dates: (d) => {
          return new Date(d).getDay() > 0 && new Date(d).getDay() < 6
        },
        hours: (h) => {
          return (
            h >= 7 &&
            h <= 19 &&
            (this.date === this.today.toISOString().substr(0, 10)
              ? h >= this.today.getHours()
              : true)
          )
        },
        minutes: (m) => {
          return m === 0 || m === 15 || m === 30 || m === 45
        },
      },
      date: '',
      time: '',
      modal: false,
      today: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
    }
  },
  computed: {
    dateRangeText() {
      return this.dates.join(' – ')
    },
  },
  methods: {
    addDates(d) {
      // $refs.dialog.save(date)
      d.push({
        date: this.date,
        time: this.time,
      })
      this.date = ''
      this.time = ''
      this.isSelectDate = true
      // this.menu = false
      this.$refs.dialog.save()
    },
    formatDate(date) {
      const d = new Date(date)
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year, month, day].join('-')
    },
  },
}
</script>
