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
        :color="item.attributes.suggestions.length < 3 ? 'success' : null"
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
    <v-sheet v-else color="white">
      <div class="d-flex justify-start primary pa-4">
        <p style="line-height: 1;font-size: 70px" class="white--text ma-0 pa-0">{{h}}:{{m}}</p>
      </div>
      <p class="text-center font-weight-bold pt-4">Uhrzeit</p>
      <div class="px-4 d-flex">
        <v-select
          v-model="h"
          :items="['07', '08', '09','10', '11', '12', '13', '14','15', '16', '17', '18', '19']"
          label="00"
          class="mr-2"
          suffix="Uhr"
          solo
        >
          <template #item="{item}">
            {{item}} Uhr
          </template>
        </v-select>
        <v-select
          v-model="m"
          :items="['00', '15', '30', '45']"
          label="00"
          suffix="min"
          solo
        ></v-select>
      </div>
      <v-spacer></v-spacer>
      <div class="d-flex justify-end pa-4">
        <v-btn
          text
          color="primary"
          @click="
            () => {
              modal = false
              //date = ''
              resetTimeData()
              isSelectDate = true
            }
          "
        >
          Abbrechen
        </v-btn>
        <v-btn
          :disabled="h == '--' || m == '--'"
          color="primary"
          @click="addDates(item.attributes.suggestions)"
        >
          Fertig
        </v-btn>
      </div>
      <!--<v-time-picker
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
        @click="addDates(item.attributes.suggestions)"
      >
        Fertig
      </v-btn>
    </v-time-picker>-->
    </v-sheet>
    
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
      time: '',
      h:'--',
      m:'--',
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
      //const date = new Date(this.date +' '+this.time)
      const date = (new Date(this.date +' '+this.h+':'+this.m)).toISOString()
      d.push({
        date: date//this.date+'T'+this.time+':00.000Z'
      })
      //console.log('d', d)
      //this.date = ''
      //this.time = ''
      this.resetTimeData()
      this.isSelectDate = true
      // this.menu = false
      this.$refs.dialog.save()
    },
    resetTimeData(){
      this.date = ''
      this.m = '--'
      this.h = '--'
    }
    /*addDates(d) {
      // $refs.dialog.save(date)
      //const date = new Date(this.date +' '+this.time)
      const date = (new Date(this.date +' '+this.time)).toISOString()
      d.push({
        date: date//this.date+'T'+this.time+':00.000Z'
      })
      console.log('d', d)
      this.date = ''
      this.time = ''
      this.isSelectDate = true
      // this.menu = false
      this.$refs.dialog.save()
    }*/
  },
  
}
</script>
