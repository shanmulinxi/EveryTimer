const creatFilter = filter => {
  let wheresql = []
  let command = ''
  let param = []
  for (let item of filter) {
    if (wheresql.length > 0) {
      wheresql.push('AND')
    }
    wheresql.push(item.field)
    wheresql.push(sqlOperate[item.operate])
    if (sqlOperate[item.operate] != 'BETWEEN') {
      wheresql.push('?')
      param.push(item.value)
    } else {
      wheresql.push('?')
      param.push(item.value)
      wheresql.push('AND')
      wheresql.push('?')
      param.push(item.extra)
    }
  }
  if (wheresql.length == 0) {
    return ''
  } else {
    wheresql.unshift('WHERE')
    command = wheresql.join(' ')
  }

  return { command, param }
}

const sqlOperate = {
  equal: '=',
  notequal: '<>',
  great: '>',
  greatequal: '>=',

  less: '<',
  lessequal: '<=',
  between: 'BETWEEN',
  like: 'LIKE',
  isnull: 'IS NULL',
  isnotnull: 'IS NOT NULL'
}

module.exports = {
  creatFilter
}
