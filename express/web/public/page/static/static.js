var realChart
var statictest = function(params) {
  console.log('statictest' + params)
}
var initChart = function(seriesnamelist) {
  realChart = echarts.init(document.getElementById('chartsDiv'), null, {
    renderer: 'svg'
  })
  // 指定图表的配置项和数据
  var option = {
    title: {
      text: ''
    },
    legend: {
      left: '7%',
      top: '2%',
      itemHeight: 20,
      itemWidth: 35,
      textStyle: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold'
      },
      data: seriesnamelist
    },
    tooltip: {
      triggerOn: 'none',
      alwaysShowContent: true,
      enterable: true,
      // renderMode: 'richText',
      // position: function(pt) {
      //   return [pt[0], 130]
      // }
      formatter: function(params) {
        let show = params[0].data[0].slice(0, 16) + `<br/>`
        let showbutton = false
        // console.log(params)
        params.map(t => {
          if (t.seriesIndex == 0) {
            showbutton = true
          }
          show += `<span style="color:${t.color}">${t.seriesName}: ${
            t.data[1]
          } KG</span><br/>`
        })

        show += showbutton
          ? `<button class="deleteButton sBorder flexCenter sFont"   onclick="deleteClick('${
              params[0].data[2]
            }')">DELETE</button>`
          : ''
        return show
      },
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold'
      }
      // extraCssText: 'background: rgba(255, 255, 255, 0.1);'
    },

    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      containLabel: true
    },
    toolbox: {
      right: '5%',
      show: true,
      itemSize: 30,
      itemGap: 15,
      // top: 55,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {}
        // dataView: {},
      },
      iconStyle: {
        borderColor: '#FFF',
        borderWidth: 2
      }
    },
    xAxis: {
      type: 'time',
      axisLine: {
        lineStyle: {
          color: '#FFF'
        }
      },
      axisPointer: {
        // value: '2016-10-7',
        type: 'line',
        snap: true,
        lineStyle: {
          color: '#FFF',
          opacity: 0.5,
          width: 2
        },
        label: {
          show: true,
          formatter: function(params) {
            return echarts.format.formatTime('yyyy-MM-dd', params.value)
          },
          backgroundColor: 'rgba(51,51,51,0.5)',
          color: '#FFF',
          borderColor: '#FFF',
          borderWidth: 1,
          fontSize: 15,
          fontWeight: 'bold'
        },
        triggerTooltip: true,
        handle: {
          show: true,
          color: '#FFF',
          size: 50,
          margin: 35,
          throttle: 50
        }
      },
      axisLabel: {
        formatter: function(value, index) {
          // 格式化成月/日，只在第一个刻度显示年份
          var date = new Date(value)
          var texts = [date.getMonth() + 1, date.getDate()]
          if (index === 0) {
            // texts.unshift(date.getYear());
          }
          return texts.join('/')
        },
        color: '#FFF',
        // fontWeight: 'bold',
        fontSize: 14,
        align: 'center'
      },
      axisTick: {
        inside: true
      },
      // boundaryGap: false,
      splitLine: {
        show: false
      }
    },
    yAxis: {
      name: 'KG',
      nameTextStyle: {
        color: '#FFF',
        // fontWeight: 'bold',
        fontSize: 14
      },
      type: 'value',
      scale: true,
      axisTick: {
        inside: true
      },
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#FFF'
        }
      },
      axisLabel: {
        inside: true,
        formatter: function(value) {
          return value + '\n'
          // return (value / 1000).toFixed(0) + '\n'
        },
        color: '#FFF',
        // fontWeight: 'bold',
        fontSize: 14
      }
    },
    dataZoom: [
      {
        type: 'inside'
        // throttle: 50
      }
    ],

    color: ['#73a373', '#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53'],
    series: [
      {
        name: seriesnamelist[0],
        type: 'line',
        // stack: '总量',
        smooth: true,
        markPoint: {
          symbol: 'circle',
          symbolSize: 35,
          label: {
            formatter: function(item) {
              return item.value
              // return (item.value / 1000).toFixed(1)
            },
            color: '#FFF',
            fontWeight: 'bold',
            fontSize: 13
          },
          data: [
            {
              type: 'max',
              name: 'MAX'
            },
            {
              type: 'min',
              name: 'MIN'
            }
          ]
        }
      },
      {
        name: seriesnamelist[1],
        type: 'line',
        // stack: '总量',
        smooth: true,
        markPoint: {
          symbol: 'circle',
          symbolSize: 35,
          label: {
            formatter: function(item) {
              return item.value
              // return (item.value / 1000).toFixed(1)
            },
            color: '#FFF',
            fontWeight: 'bold',
            fontSize: 13
          },
          data: [
            {
              type: 'max',
              name: 'MAX'
            },
            {
              type: 'min',
              name: 'MIN'
            }
          ]
        }
      }
    ]
  }

  // 使用刚指定的配置项和数据显示图表。
  realChart.setOption(option)
}

var showChartLoading = function(bool) {
  if (bool) {
    realChart.showLoading('default', {
      text: 'LOADING',
      color: '#FFF',
      textColor: '#FFF',
      maskColor: 'rgba(255, 255, 255, 0.1)',
      zlevel: 0
    })
  } else {
    realChart.hideLoading()
  }
}

var setOptionChart = function(selfname, selfdata) {
  const option = {
    series: [
      {
        name: selfname,
        data: selfdata
      }
    ]
  }
  realChart.setOption(option)
}
