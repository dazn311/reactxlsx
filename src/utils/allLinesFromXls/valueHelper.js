export function valueHelper(value,type='string',numberToDate) {
  value = !!value ? value : '';
  switch (type) {
      case 'string':
          if (typeof value === 'object') {
              return {value:value.text().trim()};
          }
          return {value: typeof value === 'string' ? value.trim() : value,
              type:'string'};
      case 'number':
          return {value:String(value),
              type:'number'};
      case 'object':
          return {value:value.text().trim(),
              type:'object'};
      case 'date':
          if (!value || /Invalid Date/i.test(numberToDate(value))) {
              return {value: !!value ? value : ''};
          }
          const date = numberToDate(value);
          return {
              // value:`${padHelper(date.getDate())}.${padHelper(date.getMonth() +1)}.${date.getFullYear()}`,
              value:`${date.getFullYear()}-${padHelper(date.getMonth() +1)}-${padHelper(date.getDate())}`,
              // value:new Date('2015-01-01').toISOString(),
              type:'date'
          };//.style("numberFormat",'dd.MM.yy')
      default:
          const val = value === undefined ? '':value;
          return {value: val};
  }
}

function padHelper(value) {
  return value < 10 ? `0${value}`: value;
}
