export function isNum(v:any): v is Number {
  return typeof v === 'number' && !isNaN(v)
}

export function isStr(v:any): v is String {
  return typeof v === 'string'
}