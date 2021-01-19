const app = getApp();
// 当前年月日
let y = new Date()
let currentYear = y.getFullYear()
let currentMonth = y.getMonth() + 1
let currentDay = y.getDate()
// 默认按照当年
let start = Date.UTC(currentYear,0,1)-28800000
let end = Date.UTC(currentYear+1,0,1)-28800000
// 当月总天数
let length = new Date(currentYear,currentMonth,0).getDate()
let days = Array.from(new Array(length+1).keys()).slice(-(length))
// 该月第一天是周几
let week = new Date(Date.UTC(currentYear,currentMonth-1,1)).getDay()
week = week == 0? 7:week
for (let i = 1; i < week; i++) {
  days.unshift('')
}
let isSelected = Array(12).fill(false)


Component({
  properties: {
    propA: String
  },
  data: {
    showModal: false,
    chooseWay: 'year',
    currentYear,
    currentMonth,
    currentDay,
    months: [1,2,3,4,5,6,7,8,9,10,11,12],
    days: [],
    isSelected,
    start,
    end
  },
  methods: {
    // 选择月份
    selectMonth: function (e) {
      // 选中样式
      let item = e.currentTarget.dataset.item - 1
      let isSelected = this.data.isSelected
      if (isSelected[item]) {
        isSelected[item] = false
        this.setData({
          chooseWay: 'year'
        })
      } else {
        isSelected = Array(12).fill(false)
        isSelected[item] = true
        this.setData({
          chooseWay: 'month',
          currentMonth: item + 1
        })
      }
      this.setData({
        isSelected
      })
      // 确定start和end
      if (isSelected[item]) {
        start = Date.UTC(this.data.currentYear,item)-28800000
        let length = new Date(this.data.currentYear,item+1,0).getDate()
        end = start + 86400000*length
      } else {
        start = Date.UTC(currentYear,0,1)-28800000
        end = Date.UTC(currentYear+1,0,1)-28800000
      }
      this.setData({
        start,
        end
      })
    },

    // 选周和选日
    selectDay: function (e) {
      // index是isSelected数组的下标
      let index = e.currentTarget.dataset.index
      let week = new Date(Date.UTC(this.data.currentYear,this.data.currentMonth-1,1)).getDay()
      week = week == 0? 7:week
      let length = new Date(this.data.currentYear,this.data.currentMonth,0).getDate()
      let isSelected = Array(this.data.days.length).fill(false)
      // selectedDay是选中的真实日期
      let selectedDay = index - week + 2
      if (index > week-2 && index < week - 1 + length && this.data.chooseWay == 'day') {
        // 按日选择日期
        isSelected[index] = true
        this.setData({
          isSelected,
          currentDay: selectedDay
        })
        let start = Date.UTC(this.data.currentYear,this.data.currentMonth-1,selectedDay)-28800000
        let end = start + 86400000
        this.setData({
          start,
          end
        })
      } else if (this.data.chooseWay == 'week') {
        // 按周选择日期
        let selectedWeek = new Date(Date.UTC(this.data.currentYear,this.data.currentMonth-1,selectedDay)).getDay()
        selectedWeek = selectedWeek == 0? 7:selectedWeek
        let currentWeek = Math.ceil((selectedDay + 7 - selectedWeek)/7)
        // 起始点的下标
        let startIndex = index - selectedWeek + 1
        isSelected.splice(startIndex,7,true,true,true,true,true,true,true)
        this.setData({
          isSelected
        })
        // 起始点的日期
        let startDay = selectedDay-selectedWeek+1
        if (this.data.currentMonth == 1 && startDay < 0) {
          startDay = 31 + startDay
          start = Date.UTC(this.data.currentYear,11,startDay)-28800000
        } else if (startDay < 0 && this.data.currentMonth != 1) {
          let lastDay = new Date(Date.UTC(this.data.currentYear,this.data.currentMonth-2)).getDate()
          startDay = lastDay + startDay
          start = Date.UTC(this.data.currentYear,this.data.currentMonth-2,startDay)-28800000
        } else {
          start = Date.UTC(this.data.currentYear,this.data.currentMonth-1,startDay)-28800000
        }
        let end = start + 86400000*7
        console.log(start,end)
        this.setData({
          start,
          end,
          currentWeek,
        })
      }

    },
    // 按月
    month: function () {
      // 默认是当前年份
      this.setData({
        isSelected,
        currentYear,
        currentMonth,
        chooseWay: 'year',
        start,
        end
      })
    },
    // 按周
    week: function () {
      let index = currentDay + week - 2
      let selectedWeek = new Date(Date.UTC(currentYear,currentMonth-1,currentDay)).getDay()
      selectedWeek = selectedWeek == 0? 7:selectedWeek
      let startIndex = index - selectedWeek + 1
      let isSelected = Array(31).fill(false)
      isSelected.splice(startIndex,7,true,true,true,true,true,true,true)
      let currentWeek = new Date(Date.UTC(currentYear,currentMonth-1,currentDay)).getDay()
      currentWeek = currentWeek == 0? 7:currentWeek
      let w = Math.ceil((currentDay + 7 - currentWeek)/7)
      let start = Date.UTC(currentYear,currentMonth-1,currentDay) - 28800000 - 86400000*(currentWeek - 1)
      let end = start + 86400000*7
      this.setData({
        chooseWay: 'week',
        currentYear,
        currentMonth,
        days,
        isSelected,
        start,
        end,
        currentWeek: w
      })
    },
    // 按天
    day: function () {
      let isSelected = Array()
      let index = currentDay + week - 2
      isSelected[index] = true
      // 该月最后一天是周几
      let start = Date.UTC(currentYear,currentMonth-1,currentDay)-28800000
      let end = start + 86400000
      this.setData({
        chooseWay: 'day',
        currentYear,
        currentMonth,
        currentDay,
        days,
        isSelected,
        start,
        end
      })
    },

    // footer
    back: function () {
      this.setData({
        showModal: false,
      })
    },
    confirm: function () {
      console.log(this.data.start,this.data.end)
      let selectedDate
      let charDate
      let chooseWay = this.data.chooseWay
      if (chooseWay == 'year') {
        selectedDate = this.data.currentYear + '年'
        charDate = this.data.currentYear
      } else if (chooseWay == 'month') {
        selectedDate = this.data.currentYear + '年' + this.data.currentMonth + '月'
        charDate = this.data.currentYear + '/' + this.data.currentMonth
      } else if (chooseWay == 'week') {
        selectedDate = this.data.currentYear + '年' + this.data.currentMonth + '月第' + this.data.currentWeek+'周'
        charDate = this.data.currentYear + '/' + this.data.currentMonth + '/week ' + this.data.currentWeek
      } else {
        selectedDate = this.data.currentYear + '年' + this.data.currentMonth + '月'+this.data.currentDay+'日'
        charDate = this.data.currentYear + '/' + this.data.currentMonth + '/ ' + this.data.currentDay
      }
      this.triggerEvent('change', {
        selectedDate
      })
      this.back()
    },

    // 年份月份选择
    backward: function () {
      let currentYear = this.data.currentYear
      let currentMonth = this.data.currentMonth
      if (this.data.chooseWay == 'month' || this.data.chooseWay == 'year') {
        currentYear--
        let start = Date.UTC(currentYear,0,1)-28800000
        let end = Date.UTC(currentYear+1,0,1)-28800000
        this.setData({
          currentYear,
          start,
          end
        })
      } else if (currentMonth == 1) {
        currentYear--
        currentMonth = 12
        this.setData({
          currentMonth,
          currentYear
        })
      } else {
        currentMonth--
        this.setData({
          currentMonth
        })
      }
      let length = new Date(currentYear,currentMonth,0).getDate()
      let endWeek = new Date(Date.UTC(currentYear,currentMonth-1,length)).getDay()
      endWeek = endWeek == 0? 7:endWeek
      let days = Array.from(new Array(length+1).keys()).slice(-(length))
      let week = new Date(Date.UTC(currentYear, currentMonth-1, 1)).getDay()
      week = week == 0? 7:week
      for (let i = 1; i < week; i++) {
        days.unshift('')
      }
      for (let i = endWeek; i < 7; i++) {
        days.push('')
      }
      this.setData({
        days,
        isSelected:[]
      })
    },
    forward: function () {
      let currentYear = this.data.currentYear
      let currentMonth = this.data.currentMonth
      if (this.data.chooseWay == 'month'|| this.data.chooseWay == 'year') {
        currentYear++
        let start = Date.UTC(currentYear,0,1)-28800000
        let end = Date.UTC(currentYear+1,0,1)-28800000
        this.setData({
          currentYear,
          start,
          end
        })
      } else if (this.data.currentMonth == 12) {
        currentYear++
        currentMonth = 1
        this.setData({
          currentYear
        })
      } else {
        currentMonth++
        this.setData({
          currentMonth
        })
      }
      let length = new Date(currentYear,currentMonth,0).getDate()
      let endWeek = new Date(Date.UTC(currentYear,currentMonth-1,length)).getDay()
      endWeek = endWeek == 0? 7:endWeek
      let days = Array.from(new Array(length+1).keys()).slice(-(length))
      let week = new Date(Date.UTC(currentYear, currentMonth-1, 1)).getDay()
      week = week == 0? 7:week
      for (let i = 1; i < week; i++) {
        days.unshift('')
      }
      for (let i = endWeek; i < 7; i++) {
        days.push('')
      }
      this.setData({
        days,
        isSelected:[]
      })
    },
    preventTouchMove: function () { 
    }
  }
})