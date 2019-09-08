//日历
Vue.component('calendar', {
  data: function () {
    return {
      curMoment: null,
      curYear: 2019,
      curMonth: 9,
      curDate: 7,
      calendarDate: [],
      calendarWeek: []
    }
  },
  created: function () {

    console.log('creat calendar')
    const now = moment()
    this.curMoment = now
    this.curYear = now.year()
    this.curMonth = now.month() + 1
    this.createdCalendar()
  },
  methods: {
    preClick: function () {
      this.curMoment.subtract(1, 'months')
      this.refalsh()
    },
    sufClick: function () {
      this.curMoment.add(1, 'months')
      this.refalsh()
    },
    refalsh: function () {
      this.curYear = this.curMoment.year()
      this.curMonth = this.curMoment.month() + 1
      this.createdCalendar()
    },
    cellStyle: function (cell) {
      if (cell.type === 'pre' || cell.type === 'suf') {
        return {
          'border-color': '#585858',
          color: '#585858'
        }
      }
      if (cell.week === 0 || cell.week === 6) {
        return {
          // "border-color": '#88001B',
          color: '#88001B'
        }
      }
    },
    weekToText: function (number) {
      const week = ['日', '一', '二', '三', '四', '五', '六']
      return week[number]
    },
    /**
     * 根据选择日期创建日历
     **/
    createdCalendar: function () {
      const weekList = [0, 1, 2, 3, 4, 5, 6]
      const defultWeekBegin = 0
      for (let i = 0; i < defultWeekBegin; i++) {
        weekList.push(weekList.shift())
      }
      this.calendarWeek = weekList
      const curMonthObc = moment(this.curMoment)
      // //当月日期数
      const curDayOfMonth = curMonthObc
        .add(1, 'months')
        .date(0)
        .date()
      // //下月moment对象
      const sufMonthObc = moment(this.curMoment).add(1, 'months')
      // //日历数据
      const calendarDate = []
      // //当前月moment对象

      // //当月第一天星期
      const curMonthFirstDayWeek = curMonthObc.date(1).day()
      // //上月显示数量
      const preDayNumber = weekList.findIndex((value, index, arr) => {
        return curMonthFirstDayWeek === value
      })

      curMonthObc.subtract(preDayNumber, 'days')

      //数据化
      for (let i = 0; i < 6 * 7; i++) {
        let type =
          i < preDayNumber ?
          'pre' :
          i > preDayNumber + curDayOfMonth - 1 ?
          'suf' :
          'current'
        calendarDate.push({
          key: curMonthObc.dayOfYear(),
          year: curMonthObc.year(),
          month: curMonthObc.month(),
          date: curMonthObc.date(),
          week: curMonthObc.day(),
          type
        })
        curMonthObc.add(1, 'days')
      }

      const data = [
        calendarDate.slice(0, 7),
        calendarDate.slice(7, 14),
        calendarDate.slice(14, 21),
        calendarDate.slice(21, 28),
        calendarDate.slice(28, 35),
        calendarDate.slice(35, 42)
      ]
      this.calendarDate = data
    }
  },
  template: `
  <div id="calendar_container" class=" flexCenter">
    <div id="calendar_head">
      <div class="calendar_topBut flexCenter whiteBorder" v-on:click="preClick">
        <span class="iconfont icon-shangyige"></span>
      </div>
      <div id="calendar_title" class="fontStyle flexCenter whiteBorder">
        {{ curYear + '-' + curMonth }}
      </div>
      <div class="calendar_topBut flexCenter whiteBorder" v-on:click="sufClick">
        <span class="iconfont icon-shangyige1"></span>
      </div>
    </div>
    <div id="calendar_content" class="flexCenter whiteBorder">
      <div class="calendar_row">
        <div class="flexCenter calendar_cell whiteSmBorder " v-for="week of calendarWeek" v-bind:key="week"
          v-bind:style="week == 0 || week == 6 ?{ color: '#88001B' }:{}">
          {{ weekToText(week) }}
        </div>
      </div>
      <div class="calendar_row" v-for="item of calendarDate">
        <div class="calendar_cell flexCenter whiteSmBorder  " v-for="cell of item" v-bind:key="cell.key"
          v-bind:style="cellStyle(cell)">
          {{ cell.date }}
        </div>
      </div>
    </div>
  </div>
  `,
})


Vue.component('selectdialog', {
  props: {
    data: Array,
    isshow: Boolean,
  },
  data: function () {
    return {

    }
  },
  created: function () {

    console.log('creat dialog')

  },
  methods: {
    selectClick: function (item) {
      this.$emit('selectevent', item)
    }
  },
  template: `
  <div id="dialog_container" class="flexCenter" v-show="isshow">
    <div id="dialog_content" class="flexCenter whiteBorder">
      <div v-for="item in data" v-bind:key="item.key" class="dialog_item mFont whiteBorder flexCenter" v-on:click="selectClick(item)">
        {{item.title}}
      </div>
    </div>
  </div>
  `,
})