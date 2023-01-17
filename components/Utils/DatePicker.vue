<template>
  <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
    <template #activator="{ on, attrs }">
      <v-btn v-bind="attrs" :color="item.attributes.suggestions.length < 3 ? 'success' : null"
        prepend-icon="mdi-calendar" v-on="on">Datum/Uhrzeit auswählen</v-btn>
    </template>
    <v-date-picker v-if="isSelectDate" v-model="date" :min="today.toISOString().substr(0, 10)" scrollable locale="de-de"
      :first-day-of-week="1" :allowed-dates="allowed.dates">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="
        () => {
          modal = false
          date = ''
        }
      ">
        Abbrechen
      </v-btn>
      <v-btn :disabled="!date" color="primary" @click="isSelectDate = !isSelectDate">
        Uhrzeit wählen
      </v-btn>
    </v-date-picker>
    <v-sheet v-else-if="test" color="white">
      <v-sheet color="primary" class="pa-4 white--text v-date-picker-title" style="font-size: 1rem">
        <div class="v-date-picker-title__year ">
          <p class="mb-0">Uhrzeit</p>
        </div>
        <div class="v-time-picker-title__time">
          <div class="v-picker__title__btn v-picker__title__btn--active">{{ time }}</div>
        </div>
      </v-sheet>
      <v-row class="pa-4"><v-col><v-select v-model="selHour" outlined :items="hourRate" suffix="Uhr" @change="newTime()"></v-select></v-col>
        <v-col><v-select v-model="selMin" outlined :items="minuteRate" suffix="Min" @change="newTime()">
          </v-select></v-col></v-row>
      <v-spacer></v-spacer>
      <div class="pa-4">
        <v-btn text color="primary" @click="isSelectDate = !isSelectDate">
          Zurück
        </v-btn>
        <v-btn text color="primary" @click="
          () => {
            modal = false
            date = ''
            isSelectDate = true
          }
        ">
          Abbrechen
        </v-btn>
        <v-btn :disabled="!time" color="primary" @click="addDates(item.attributes.suggestions)">
          Fertig
        </v-btn>
      </div>
    </v-sheet>
    <v-time-picker v-else v-model="time" min="7:00" max="20:00" format="24hr" :allowed-hours="allowed.hours"
      :allowed-minutes="allowed.minutes">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="
        () => {
          modal = false
          date = ''
          isSelectDate = true
        }
      ">
        Abbrechen
      </v-btn>
      <v-btn :disabled="!time" color="primary" @click="addDates(item.attributes.suggestions)">
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
      test: true,
      hourRate: ['07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
      minuteRate: ['00', '15', '30', '45'],
      selHour: '07',
      selMin: '00',
      menu: false,
      isSelectDate: true,
      allowed: {
        dates: (d) => {
          return new Date(d).getUTCDay() > 0 && new Date(d).getUTCDay() < 6
        },
        hours: (h) => {
          return (
            h >= 7 &&
            h <= 19 &&
            (this.date === this.today.toString().substr(0, 10)
              ? h >= this.today.getUTCHours()
              : true)
          )
        },
        minutes: (m) => {
          return m === 0 || m === 15 || m === 30 || m === 45
        },
      },
      date: '',
      //time: '',
      modal: false,
      today: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
    }
  },
  computed: {
    dateRangeText() {
      return this.dates.join(' – ')
    },
    time(){
      return this.selHour + ':' + this.selMin
    }
  },
  methods: {
    addDates(d) {
      // $refs.dialog.save(date)
      //const date = new Date(this.date +' '+this.time)
      const date = (new Date(this.date + ' ' + this.time)).toISOString()
      d.push({
        date: date//this.date+'T'+this.time+':00.000Z'
      })
      this.date = ''
      this.time = ''
      this.selHour = '07'
      this.selMin = '00'
      this.isSelectDate = true
      // this.menu = false
      this.$refs.dialog.save()
    },
    newTime(){
      this.time = this.selHour + ':'+this.selMin
    }
  },

}
</script>
