var realChart
var initChart = function () {
  realChart = echarts.init(document.getElementById('chartsDiv'));
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
        fontWeight: 'bold',
      }
    },
    tooltip: {
      triggerOn: 'none',
      position: function (pt) {
        return [pt[0], 130];
      }
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
          yAxisIndex: 'none',

        },
        // restore: {}
      },
      iconStyle: {
        borderColor: '#FFF',
        borderWidth: 2,
      },
    },
    xAxis: {

      type: 'time',
      axisLine: {
        lineStyle: {
          color: '#FFF',
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
          formatter: function (params) {
            return echarts.format.formatTime('yyyy-MM-dd', params.value);
          },
          backgroundColor: 'rgba(51,51,51,0.5)',
          color: '#FFF',
          borderColor: '#FFF',
          borderWidth: 1,
          fontSize: 14,
          fontWeight: 'bold',
        },
        triggerTooltip: true,
        handle: {
          show: true,
          color: '#FFF',
          size: 50,
          margin: 35,
          throttle: 50,
        }
      },
      axisLabel: {
        formatter: function (value, index) {
          // 格式化成月/日，只在第一个刻度显示年份
          var date = new Date(value);
          var texts = [(date.getMonth() + 1), date.getDate()];
          if (index === 0) {
            texts.unshift(date.getYear());
          }
          return texts.join('/');
        },
        color: '#FFF',
        // fontWeight: 'bold',
        fontSize: 14,
        align: 'center',
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
        fontSize: 14,
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
          color: '#FFF',
        }
      },
      axisLabel: {
        inside: true,
        formatter: function (value) {
          return (value / 1000).toFixed(0) + '\n';
        },
        color: '#FFF',
        // fontWeight: 'bold',
        fontSize: 14,
      },
    },
    dataZoom: [{
      type: 'inside',
      // throttle: 50
    }],
    color: ['#73a373', '#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53']
  };


  // 使用刚指定的配置项和数据显示图表。
  realChart.setOption(option);
}

var setOptionChart = function (selfname, selfdata) {
  const option = {
    legend: {
      data: [selfname]
    },
    series: [{
      name: selfname,
      type: 'line',
      // stack: '总量',
      smooth: true,
      markPoint: {
        symbol: 'pin',
        label: {
          formatter: function (item) {
            return (item.value / 1000).toFixed(1);
          },
          color: '#FFF',
          fontWeight: 'bold',
          fontSize: 13,
        },
        data: [{
            type: 'max',
            name: 'MAX'
          },
          {
            type: 'min',
            name: 'MIN'
          }
        ]
      },
      // itemStyle: {
      //   color: 
      // },
      data: selfdata
    }, ]
  }
  realChart.setOption(option);
}