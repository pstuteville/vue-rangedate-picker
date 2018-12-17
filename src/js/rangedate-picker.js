import fecha from 'fecha'

const defaultConfig = {}
const defaultI18n = 'EN'
const availableMonths = {
  EN: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November',
    'December'],
  ID: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November',
    'Desember']
}

const availableShortDays = {
  EN: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ID: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
}

const presetRangeLabel = {
  EN: {
    today: 'Today',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    lastSevenSays: 'Last 7 Days',
    lastThirtyDays: 'Last 30 Days'
  },
  ID: {
    today: 'Hari ini',
    thisMonth: 'Bulan ini',
    lastMonth: 'Bulan lalu',
    lastSevenDays: '7 Hari Terakhir',
    lastThirtyDays: '30 Hari Terakhir'
  }
}

const defaultCaptions = {
  'ok_button': 'Select Dates',
  'drop_down': 'All Time'
}

const defaultStyle = {
  daysWeeks: 'calendar_weeks',
  days: 'calendar_days',
  daysSelected: 'calendar_days_selected',
  daysInRange: 'calendar_days_in-range',
  firstDate: 'calendar_month_left',
  secondDate: 'calendar_month_right',
  presetRanges: 'calendar_preset-ranges',
  dateDisabled: 'calendar_days--disabled'
}

const defaultPresets = function (i18n = defaultI18n) {
  return {
    today: function () {
      const n = new Date()
      const startToday = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 0, 0)
      const endToday = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 23, 59)
      return {
        label: presetRangeLabel[i18n].today,
        active: false,
        dateRange: {
          start: startToday,
          end: endToday
        }
      }
    },
    thisMonth: function () {
      const n = new Date()
      const startMonth = new Date(n.getFullYear(), n.getMonth(), 2)
      const endMonth = new Date(n.getFullYear(), n.getMonth() + 1, 1)
      return {
        label: presetRangeLabel[i18n].thisMonth,
        active: false,
        dateRange: {
          start: startMonth,
          end: endMonth
        }
      }
    },
    lastMonth: function () {
      const n = new Date()
      const startMonth = new Date(n.getFullYear(), n.getMonth() - 1, 2)
      const endMonth = new Date(n.getFullYear(), n.getMonth(), 1)
      return {
        label: presetRangeLabel[i18n].lastMonth,
        active: false,
        dateRange: {
          start: startMonth,
          end: endMonth
        }
      }
    },
    last7days: function () {
      const n = new Date()
      const start = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 5)
      const end = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1)
      return {
        label: presetRangeLabel[i18n].lastSevenDays,
        active: false,
        dateRange: {
          start: start,
          end: end
        }
      }
    },
    last30days: function () {
      const n = new Date()
      const start = new Date(n.getFullYear(), n.getMonth(), n.getDate() - 29)
      const end = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1)
      return {
        label: presetRangeLabel[i18n].lastThirtyDays,
        active: false,
        dateRange: {
          start: start,
          end: end
        }
      }
    }
  }
}


export default {
  name: 'vue-rangedate-picker',
  props: {
    configs: {
      type: Object,
      default: () => defaultConfig
    },
    i18n: {
      type: String,
      default: defaultI18n
    },
    months: {
      type: Array,
      default: () => null
    },
    shortDays: {
      type: Array,
      default: () => null
    },
    // options for captions are: title, ok_button
    captions: {
      type: Object,
      default: () => defaultCaptions
    },
    format: {
      type: String,
      default: 'DD MMM YYYY'
    },
    styles: {
      type: Object,
      default: () => {}
    },
    initRange: {
      type: Object,
      default: () => null
    },
    startActiveMonth: {
      type: Number,
      default: new Date().getMonth()
    },
    startActiveYear: {
      type: Number,
      default: new Date().getFullYear()
    },
    presetRanges: {
      type: Object,
      default: () => null
    },
    compact: {
      type: String,
      default: 'false'
    },
    righttoleft: {
      type: String,
      default: 'false'
    },
    minDate: {
      type: Date,
      default: null
    },
    maxDate: {
      type: Date,
      default: null
    }
  },
  data () {
    return {
      dateRange: {},
      numOfDays: 7,
      isFirstChoice: true,
      isOpen: false,
      presetActive: '',
      showMonth: false,
      activeMonthStart: this.startActiveMonth,
      activeYearStart: this.startActiveYear,
      activeYearEnd: this.startActiveYear
    }
  },
  created () {
    if (this.isCompact) {
      this.isOpen = true
    }
    if (this.activeMonthStart === 11) this.activeYearEnd = this.activeYearStart + 1
  },
  watch: {
    startNextActiveMonth: function (value) {
      if (value === 0) this.activeYearEnd = this.activeYearStart + 1
    }
  },
  computed: {
    monthsLocale: function () {
      return this.months || availableMonths[this.i18n]
    },
    shortDaysLocale: function () {
      return this.shortDays || availableShortDays[this.i18n]
    },
    s: function () {
      return Object.assign({}, defaultStyle, this.style)
    },
    startMonthDay: function () {
      return new Date(this.activeYearStart, this.activeMonthStart, 1).getDay()
    },
    startNextMonthDay: function () {
      return new Date(this.activeYearStart, this.startNextActiveMonth, 1).getDay()
    },
    endMonthDate: function () {
      return new Date(this.activeYearEnd, this.startNextActiveMonth, 0).getDate()
    },
    endNextMonthDate: function () {
      return new Date(this.activeYearEnd, this.activeMonthStart + 2, 0).getDate()
    },
    startNextActiveMonth: function () {
      return this.activeMonthStart >= 11 ? 0 : this.activeMonthStart + 1
    },
    finalPresetRanges: function () {
      const tmp = {}
      const presets = this.presetRanges || defaultPresets(this.i18n)
      for (const i in presets) {
        const item = presets[i]
        let plainItem = item
        if (typeof item === 'function') {
          plainItem = item()
        }
        tmp[i] = plainItem
      }
      return tmp
    },
    isCompact: function () {
      return this.compact === 'true'
    },
    isRighttoLeft: function () {
      return this.righttoleft === 'true'
    },
    hasRangeSelected: function () {
      if (this.daterange === {}) {
        return false
      }
      return this.dateRange.start && this.dateRange.end && !this.isOpen
    },
    canGoPrevMonth: function () {
      const prevMonth = new Date(this.activeYearStart, this.activeMonthStart, 0)
      var notTooEarly = true
      var notTooLate = true

      console.log('prev check: ' + prevMonth)

      if (this.minDate) {
        notTooEarly = prevMonth >= this.minDate
      }

      if (this.maxDate) {
        notTooLate = prevMonth <= this.maxDate
      }

      return notTooEarly && notTooLate
    },
    canGoNextMonth: function () {
      const nextMonth = new Date(this.activeYearEnd, this.startNextActiveMonth, 1)
      var notTooEarly = true
      var notTooLate = true

      console.log('next check: ' + nextMonth)

      if (this.minDate) {
        notTooEarly = nextMonth >= this.minDate
      }

      if (this.maxDate) {
        notTooLate = nextMonth <= this.maxDate
      }

      return notTooEarly && notTooLate
    }
  },
  methods: {
    cancel: function () {
      this.clear()
      this.toggleCalendar()
    },
    clear: function () {
      this.dateRange.start = null
      this.dateRange.end = null
      this.setDateValue()
    },
    toggleCalendar: function () {
      if (this.isCompact) {
        this.showMonth = !this.showMonth
        return
      }
      this.isOpen = !this.isOpen
      this.showMonth = !this.showMonth
      return
    },
    getDateString: function (date, format = this.format) {
      if (!date) {
        return null
      }
      const dateparse = new Date(Date.parse(date))
      return fecha.format(new Date(dateparse.getFullYear(), dateparse.getMonth(), dateparse.getDate() - 1), format)
    },
    getDayIndexInMonth: function (r, i, startMonthDay) {
      const date = (this.numOfDays * (r - 1)) + i
      return date - startMonthDay
    },
    getDayCell (r, i, key, startMonthDay, endMonthDate) {
      const result = this.getDayIndexInMonth(r, i, startMonthDay)
      if (result > 0 && result <= endMonthDate && this.dateInMinMaxRange(r, i, key, startMonthDay, endMonthDate)) {
        return result
      } else {
        return '&nbsp;'
      }
    },
    dateInMinMaxRange (r, i, key, startMonthDay, endMonthDate) {
      const result = this.getDayIndexInMonth(r, i, startMonthDay)
      var notTooEarly = true
      var notTooLate = true
      var currMonth = this.activeMonthStart
      var currYear = this.activeYearStart

      if (key === 'second') {
        currMonth = this.startNextActiveMonth
        currYear = this.activeYearEnd
      }

      var d = new Date(currYear, currMonth, result)

      if (this.minDate) {
        notTooEarly = d >= this.minDate
      }

      if (this.maxDate) {
        notTooLate = d <= this.maxDate
      }

      return notTooEarly && notTooLate
    },
    getNewDateRange (result, activeMonth, activeYear) {
      const newData = {}
      let key = 'start'
      if (!this.isFirstChoice) {
        key = 'end'
      } else {
        newData['end'] = null
      }
      const resultDate = new Date(activeYear, activeMonth, result)
      if (!this.isFirstChoice && resultDate < this.dateRange.start) {
        this.isFirstChoice = false
        return { start: resultDate }
      }

      // toggle first choice
      this.isFirstChoice = !this.isFirstChoice
      newData[key] = resultDate
      return newData
    },
    selectFirstItem (r, i) {
      const result = this.getDayIndexInMonth(r, i, this.startMonthDay) + 1
      this.dateRange = Object.assign({}, this.dateRange, this.getNewDateRange(result, this.activeMonthStart,
      this.activeYearStart))
      if (this.dateRange.start && this.dateRange.end) {
        this.presetActive = ''
        if (this.isCompact) {
          this.showMonth = false
        }
      }
    },
    selectSecondItem (r, i) {
      const result = this.getDayIndexInMonth(r, i, this.startNextMonthDay) + 1
      this.dateRange = Object.assign({}, this.dateRange, this.getNewDateRange(result, this.startNextActiveMonth,
      this.activeYearEnd))
      if (this.dateRange.start && this.dateRange.end) {
        this.presetActive = ''
      }
    },
    isDateSelected (r, i, key, startMonthDay, endMonthDate) {
      const result = this.getDayIndexInMonth(r, i, startMonthDay) + 1
      if (result < 2 || result > endMonthDate + 1) return false

      let currDate = null
      if (key === 'first') {
        currDate = new Date(this.activeYearStart, this.activeMonthStart, result)
      } else {
        currDate = new Date(this.activeYearEnd, this.startNextActiveMonth, result)
      }
      return (this.dateRange.start && this.dateRange.start.getTime() === currDate.getTime()) ||
        (this.dateRange.end && this.dateRange.end.getTime() === currDate.getTime())
    },
    isDateInRange (r, i, key, startMonthDay, endMonthDate) {
      const result = this.getDayIndexInMonth(r, i, startMonthDay) + 1
      if (result < 2 || result > endMonthDate + 1) return false

      let currDate = null
      if (key === 'first') {
        currDate = new Date(this.activeYearStart, this.activeMonthStart, result)
      } else {
        currDate = new Date(this.activeYearEnd, this.startNextActiveMonth, result)
      }
      return (this.dateRange.start && this.dateRange.start.getTime() < currDate.getTime()) &&
        (this.dateRange.end && this.dateRange.end.getTime() > currDate.getTime())
    },
    isDateDisabled (r, i, key, startMonthDay, endMonthDate) {
      const result = this.getDayIndexInMonth(r, i, startMonthDay)

      if (!(result > 0 && result <= endMonthDate)) {
        return true
      }

      return !this.dateInMinMaxRange(r, i, key, startMonthDay, endMonthDate)
    },
    goPrevMonth () {
      const prevMonth = new Date(this.activeYearStart, this.activeMonthStart, 0)
      this.activeMonthStart = prevMonth.getMonth()
      this.activeYearStart = prevMonth.getFullYear()
      this.activeYearEnd = prevMonth.getFullYear()
    },
    goNextMonth () {
      const nextMonth = new Date(this.activeYearEnd, this.startNextActiveMonth, 1)
      this.activeMonthStart = nextMonth.getMonth()
      this.activeYearStart = nextMonth.getFullYear()
      this.activeYearEnd = nextMonth.getFullYear()
    },
    updatePreset (item) {
      this.presetActive = item.label
      this.dateRange = item.dateRange
      // update start active month
      this.activeMonthStart = this.dateRange.start.getMonth()
      this.activeYearStart = this.dateRange.start.getFullYear()
      this.activeYearEnd = this.dateRange.end.getFullYear()
    },
    updateCaptions: function () {
      if (this.dateRange.start === null && this.dateRange.end === null) {
        this.captions.drop_down = 'All Time'
      } else {
        this.captions.drop_down = this.getDateString(this.dateRange.start) + ' - ' + this.getDateString(this.dateRange.end)
      }
    },
    setDateValue: function () {
      this.updateCaptions()

      // hack, i think days are kept +1 because of indexing - and would take a lot of refactoring
      var result = this.dateRange
      if (this.dateRange.start !== undefined && this.dateRange.start !== null) {
        result.start.setDate(this.dateRange.start.getDate() - 1)
      } else { result.start = null }
      if (this.dateRange.end !== undefined && this.dateRange.end !== null) {
        result.end.setDate(this.dateRange.end.getDate() - 1)
      } else { result.end = null }

      this.$emit('selected', result)

      this.isOpen = false
      this.showMonth = false
    }
  }
}
