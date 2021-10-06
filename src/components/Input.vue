<template>
  <section>
    <b-sidebar
      type="is-light"
      :fullheight="fullheight"
      :fullwidth="fullwidth"
      :overlay="overlay"
      :right="right"
      :expand-on-hover="expandOnHover"
      :reduce="reduce"
      v-model="open"
    >
    <b-field label="Select datetime">
            <b-datetimepicker
                v-model="selected"
                rounded
                placeholder="Click to select..."
                icon="calendar-today"
                icon-right-clickable
                locale="en-GB"
                datepicker="{ false }"
                timepicker="{ false, 24 }"
                horizontal-time-picker>
            </b-datetimepicker>
        </b-field>
    <div>
        nice

    </div>
    </b-sidebar>
  </section>
</template>

<script>
import Vue from 'vue'
import { Datetimepicker} from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Datetimepicker)

export default {
  data() {
    return {
      open: true,
      overlay: false,
      fullheight: true,
      fullwidth: false,
      right: false,
      expandOnHover: true,
      reduce: true

    };
  }
};
</script>

<style>
.p-1 {
  padding: 1em;
}
</style>