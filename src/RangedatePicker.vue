<template>
  <div class="calendar-root" :class="{'range-selected': hasRangeSelected}">
    <div class="input-date" @click="toggleCalendar()">{{captions.drop_down}}</div>
    <div v-if="hasRangeSelected" class="clear-x" @click="clear()">x</div>
    <div v-if="!hasRangeSelected" class="blue-down-arrow" @click="toggleCalendar()"></div>
    <div class="calendar" :class="{'calendar-mobile ': isCompact, 'calendar-right-to-left': isRighttoLeft}" v-if="isOpen">
      <div class="calendar-wrap">
        <div class="calendar_month_left" :class="{'calendar-left-mobile': isCompact}" v-if="showMonth">
          <div class="months-text">
            <i class="left" v-if="canGoPrevMonth" @click="goPrevMonth"></i>
            <i class="right" @click="goNextMonth" v-if="isCompact && canGoNextMonth"></i>
            {{monthsLocale[activeMonthStart] +' '+ activeYearStart}}</div>
            <ul :class="s.daysWeeks">
              <li v-for="item in shortDaysLocale" :key="item">{{item}}</li>
            </ul>
            <ul v-for="r in 6" :class="[s.days]" :key="r">
              <li :class="[{[s.daysSelected]: isDateSelected(r, i, 'first', startMonthDay, endMonthDate),
                [s.daysInRange]: isDateInRange(r, i, 'first', startMonthDay, endMonthDate),
                [s.dateDisabled]: isDateDisabled(r, i, 'first', startMonthDay, endMonthDate)}]"
                v-for="i in numOfDays" :key="i" v-html="getDayCell(r, i, 'first', startMonthDay, endMonthDate)"
                @click="(r, i)">
              </li>
            </ul>
        </div>
        <div class="calendar_month_right" v-if="!isCompact">
          <div class="months-text">
            {{monthsLocale[startNextActiveMonth] +' '+ activeYearEnd}}
            <i class="right" v-if="canGoNextMonth" @click="goNextMonth"></i>
          </div>
          <ul :class="s.daysWeeks">
              <li v-for="item in shortDaysLocale" :key="item">{{item}}</li>
          </ul>
          <ul v-for="r in 6" :class="[s.days]" :key="r">
            <li :class="[{[s.daysSelected]: isDateSelected(r, i, 'second', startNextMonthDay, endNextMonthDate),
            [s.daysInRange]: isDateInRange(r, i, 'second', startNextMonthDay, endNextMonthDate),
            [s.dateDisabled]: isDateDisabled(r, i, 'second', startNextMonthDay, endNextMonthDate)}]"
                v-for="i in numOfDays" :key="i" v-html="getDayCell(r, i, 'second', startNextMonthDay, endNextMonthDate)"
                  @click="selectSecondItem(r, i)"></li>
          </ul>
        </div>
      </div>
      <div class="calendar-range" :class="{'calendar-range-mobile ': isCompact}" v-if="!showMonth || !isCompact">
        <div class="clear-btn"><a @click="clear()">Clear date selection</a></div>
        <div class="apply-btn"><button class="calendar-btn-apply" @click="setDateValue()">{{captions.ok_button}}</button></div>
        <div class="cancel-btn"><a @click="cancel()">Cancel</a></div>
      </div>

    </div>
  </div>
</template>

<script src="./js/rangedate-picker.js"></script>

<style lang="css" scoped>
  .input-date {
    font-size: 14px;
    cursor: pointer;
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    display: inline-block;
    vertical-align: middle;
    border: none;
    margin: 0;
    padding: 0;
  }

  .input-date::after {
    content: "▼";
    float: right;
    font-size: smaller;
    display: none;
  }

  .active-preset {
    border: 1px solid #0096d9;
    color: #0096d9;
    border-radius: 3px;
  }

  .months-text {
    text-align: center;
    font-weight: 700;
  }

  .months-text .left {
    float: left;
    cursor: pointer;
    width: 16px;
    height: 16px;
    background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMxLjQ5NCAzMS40OTQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMxLjQ5NCAzMS40OTQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPHBhdGggZD0iTTEwLjI3Myw1LjAwOWMwLjQ0NC0wLjQ0NCwxLjE0My0wLjQ0NCwxLjU4NywwYzAuNDI5LDAuNDI5LDAuNDI5LDEuMTQzLDAsMS41NzFsLTguMDQ3LDguMDQ3aDI2LjU1NCAgYzAuNjE5LDAsMS4xMjcsMC40OTIsMS4xMjcsMS4xMTFjMCwwLjYxOS0wLjUwOCwxLjEyNy0xLjEyNywxLjEyN0gzLjgxM2w4LjA0Nyw4LjAzMmMwLjQyOSwwLjQ0NCwwLjQyOSwxLjE1OSwwLDEuNTg3ICBjLTAuNDQ0LDAuNDQ0LTEuMTQzLDAuNDQ0LTEuNTg3LDBsLTkuOTUyLTkuOTUyYy0wLjQyOS0wLjQyOS0wLjQyOS0xLjE0MywwLTEuNTcxTDEwLjI3Myw1LjAwOXoiIGZpbGw9IiMwMDZERjAiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==);
  }

  .months-text .right {
    float: right;
    cursor: pointer;
    width: 16px;
    height: 16px;
    background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMxLjQ5IDMxLjQ5IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMS40OSAzMS40OTsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiPgo8cGF0aCBkPSJNMjEuMjA1LDUuMDA3Yy0wLjQyOS0wLjQ0NC0xLjE0My0wLjQ0NC0xLjU4NywwYy0wLjQyOSwwLjQyOS0wLjQyOSwxLjE0MywwLDEuNTcxbDguMDQ3LDguMDQ3SDEuMTExICBDMC40OTIsMTQuNjI2LDAsMTUuMTE4LDAsMTUuNzM3YzAsMC42MTksMC40OTIsMS4xMjcsMS4xMTEsMS4xMjdoMjYuNTU0bC04LjA0Nyw4LjAzMmMtMC40MjksMC40NDQtMC40MjksMS4xNTksMCwxLjU4NyAgYzAuNDQ0LDAuNDQ0LDEuMTU5LDAuNDQ0LDEuNTg3LDBsOS45NTItOS45NTJjMC40NDQtMC40MjksMC40NDQtMS4xNDMsMC0xLjU3MUwyMS4yMDUsNS4wMDd6IiBmaWxsPSIjMDA2REYwIi8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=);
  }

  .calendar-root {
    font-family: inherit;
    display: inline-block;
    width: 120px;
    vertical-align: middle;
    position: relative;
    font-size: 14px;
    border: 1px solid #d0d0d0;
    border-radius: 6px;
    height: 18px;
    line-height: 16px;
    background-color: #fff;
    margin: 0;
    padding: 8px 10px 8px 12px;
  }

  .range-selected {
    background-color: #0ebeff;
    color: #fff;
  }

  .calendar-title {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  .calendar-right-to-left {
    margin-left: -460px;
  }

  .calendar {
    display: block;
    font-size: 12px;
    box-shadow: -3px 4px 12px -1px #ccc;
    background: #fff;
    position: absolute;
    z-index: 9;
    font-family: inherit;
    width: 500px;
    height: auto;
    right: 0px;
    top: 50px;
  }

  .calendar-head h2 {
    margin: 0;
    padding: 20px 0 0 20px;
  }

  .close:hover {
    cursor: pointer;
  }

  .close {
    float: right;
    margin-top: -35px;
    font-size: 32px;
    font-weight: 400;
    padding: 0 10px;
  }

  .calendar ul {
    list-style-type: none;
  }

  .calendar-wrap {
    display: inline-block;
    float: left;
    width: 75%;
    padding: 10px;
  }

  .calendar-range {
    float: left;
    border-left: 1px solid #ccc;
    margin: -2px;
    padding: 0 12px;
    padding-bottom: 12px;
  }

  .calendar-left-mobile {
    width: 100% !important;
  }

  .calendar_month_left {
    float: left;
    width: 43%;
    margin: 5px;
    padding: 10px;
  }

  .calendar_month_right {
    float: left;
    width: 43%;
    margin: 5px;
    padding: 10px;
  }

  .calendar_weeks {
    width: auto;
    margin: 0;
    padding: 10px 0;
  }

  .calendar_weeks li {
    display: inline-block;
    width: 13.6%;
    color: #999;
    text-align: center;
  }

  .calendar_days {
    margin: 0;
    padding: 0;
  }

  .calendar_days li {
    display: inline-block;
    width: 13.6%;
    color: #333;
    text-align: center;
    cursor: pointer;
    line-height: 2em;
  }

  .calendar_preset li {
    line-height: 2.6em;
    width: auto;
    display: block;
  }

  .calendar_days li:hover {
    background: #eee;
    color: #000;
  }

  li.calendar_days--disabled {
    pointer-events: none;
  }

  li.calendar_days_selected {
    background: #005a82;
    color: #fff;
  }

  li.calendar_days_in-range {
    background: #0096d9;
    color: #fff;
  }

  .calendar_preset {
    padding: 0;
  }

  .calendar_preset li.calendar_preset-ranges {
    margin-bottom: 5px;
    cursor: pointer;
    margin-top: 1px;
    padding: 0 30px 0 10px;
  }

  .calendar_preset li.calendar_preset-ranges:hover {
    background: #eee;
  }

  .calendar-mobile {
    width: 260px;
    z-index: 1;
    box-shadow: none;
  }

  .calendar-range-mobile {
    width: 90%;
    border-left: none;
    margin: -20px 0;
    padding: 2px;
  }

  .calendar-btn-apply {
    width: 100%;
    background: #f7931e;
    color: #fff;
    border: none;
    font-size: 14px;
    padding: 10px;
  }

  .cancel-btn {
    float: right;
    line-height: 40px;
    font-size: 14px;
    padding-right: 12px;
  }

  .cancel-btn a {
    text-decoration: none;
    color: #8d8d8d;
    cursor: pointer;
  }

  .clear-btn {
    float: left;
    line-height: 40px;
    font-size: 14px;
    padding-left: 12px;
  }

  .clear-btn a {
    text-decoration: none;
    cursor: pointer;
    color: #1e6cd1;
  }

  .apply-btn {
    float: right;
  }

  .blue-down-arrow {
    border-top-color: #404040;
    position: absolute;
    top: 14px;
    left: auto;
    right: 10px;
    cursor: pointer;

    display: inline-block;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    border-top: 7px solid #005dcf;
  }

  .clear-x {
    border-top-color: #404040;
    position: absolute;
    top: 8px;
    left: auto;
    right: 10px;
    cursor: pointer;
    color: #fff;
  }

  .calendar .calendar-head {
  }

  .calendar .calendar-range {
    border: 0;
    float: right;
    margin: 0;
    width: 480px;
  }

  .calendar .calendar-range .calendar_preset-ranges {
    display: none;
  }

  .calendar .calendar-range .calendar-btn-apply {
    background: #0ebeff;
    border-radius: 2px;
    /* text-transform: uppercase; */
    font-weight: 700;
    font-size: 12px;
  }

  .calendar .calendar-wrap {
    width: 480px;
  }

  .calendar .calendar-wrap .months-text {
    text-transform: uppercase;
  }

  .calendar li.calendar_days_selected {
    background: #66b6ff;
  }

  .calendar li.calendar_days_in-range {
    background: #E6F3FF;
    color: #333;
  }
</style>
