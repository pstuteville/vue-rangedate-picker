// /** Lines below are already loaded in /test/helpers/entry.js
// import Vue from 'vue'
// import plugin from './index'
// import 'babel-polyfill' // promise and etc ...
//
// Vue.config.productionTip = false
// Vue.use(plugin)
//
// window.Vue = Vue
// Vue.config.debug = true
// */

import VueRangeDatePicker from './RangedatePicker.vue'

new window.Vue({
  el: 'app',
  template: `<div id="demo" style="margin-left: 600px">
<div>
<strong>Full form</strong>
<vue-rangedate-picker i18n='EN'></vue-rangedate-picker>
</div>
<div style="height: 300px">
<strong>Compact (mobile)</strong>
<vue-rangedate-picker compact="true" i18n="EN"></vue-rangedate-picker>
</div>
</div>`,
  components: { VueRangeDatePicker }
})
