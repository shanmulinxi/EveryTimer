const creatFilter = obc => {
  let wheresql = []
  const { filter } = obc

  for (let item of filter) {
    if (wheresql.length > 0) {
      wheresql.push('AND')
    }
    wheresql.push(item.field)
    wheresql.push(sqlOperate[item.operate])
    if (sqlOperate[item.operate] != 'BETWEEN') {
      wheresql.push(item.value)
    } else {
      wheresql.push(item.value)
      wheresql.push(item.extra)
    }
  }
  if (wheresql.length == 0) {
    return ''
  } else {
    wheresql.unshift('WHERE')
    return wheresql.join(' ')
  }
}

const sqlOperate = {
  equal: '=',
  notequal: '<>',
  great: '>',
  greatequal: '>=',

  less: '<',
  lessequal: '<=',
  between: 'BETWEEN',
  like: 'LIKE'
}

module.exports = {
  creatFilter
}
