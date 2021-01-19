
Page({
  data: {
    selectedDate: ''
  },
  showModal: function () {
    let date = this.selectComponent('#date')
    date.setData({
      showModal: true
    })
    this.setData({
      showCanvas: false
    })
  },
  changeDate: function (e) {
    console.log(e)
    this.setData({
      selectedDate: e.detail.selectedDate
    })
  }
})
