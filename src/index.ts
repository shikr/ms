interface FullData {
  name: string
  value: number
}

export function ms(str: string): number
export function ms(str: string, fullData: true): FullData | null
export function ms(str: string, fullData: boolean): number | FullData | null
export function ms(str: string, fullData = false): number | FullData | null {
  if (typeof str !== 'string') throw new TypeError('Expected string type.')
  // Remove special characters
  let ms = str
    .normalize('NFD')
    .replace(/([\u0300-\u0302]|[\u0304-\u030f])/g, '')
    .normalize()
    .toLowerCase()
  let finish = true
  let milli = 0
  const values = {
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }
  while (finish) {
    const value = ms.match(new RegExp(`^${numberRegex} *(${enUnits.join('|')})( *, *)?`))
    if (value !== null) {
      const num = Number(value[0].match(new RegExp(`^${numberRegex}`))?.[0])
      if (isNaN(num) || num === 0) return NaN
      const unit = value[0].replace(new RegExp(`^${numberRegex}`), '').trimStart()
      ms = ms.replace(value[0], '').trimStart()
      switch (unit as EnglishUnits) {
        case 'y':
        case 'yr':
        case 'yrs':
        case 'year':
        case 'years':
          values.years += num
          milli += num * year
          break
        case 'mo':
        case 'month':
        case 'months':
          values.months += num
          milli += num * month
          break
        case 'w':
        case 'week':
        case 'weeks':
          values.weeks += num
          milli += num * week
          break
        case 'd':
        case 'dy':
        case 'dys':
        case 'day':
        case 'days':
          values.days += num
          milli += num * day
          break
        case 'h':
        case 'hr':
        case 'hrs':
        case 'hour':
        case 'hours':
          values.hours += num
          milli += num * hour
          break
        case 'm':
        case 'min':
        case 'mins':
        case 'minute':
        case 'minutes':
          values.minutes += num
          milli += num * minute
          break
        case 's':
        case 'sc':
        case 'scs':
        case 'sec':
        case 'secs':
        case 'second':
        case 'seconds':
          values.seconds += num
          milli += num * second
          break
        default:
          milli += num
          break
      }
    } else finish = false
  }
  if (ms.length > 0) ms = ms.trim()
  if (ms.length > 0 && fullData) return null
  else if (ms.length > 0) return NaN
  if (fullData) {
    if (milli === 0) return null
    const name = (Object.entries(values) as [keyof typeof values, number][])
      .filter((x) => x[1] !== 0)
      .map((x) => `${x[1]} ${x[1] >= 2 || x[1] <= -2 ? x[0] : singleName[x[0]]}`)
      .join(', ')
    return {
      name,
      value: milli
    }
  }
  return milli
}

// useful for switching from plural to singular
const singleName = {
  years: 'year',
  months: 'month',
  weeks: 'week',
  days: 'day',
  hours: 'hour',
  minutes: 'minute',
  seconds: 'second'
}

const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24
const week = day * 7
const month = day * 30
const year = day * 365

export type EnglishUnits =
  | 'y'
  | 'yr'
  | 'yrs'
  | 'year'
  | 'years'
  | 'mo'
  | 'month'
  | 'months'
  | 'w'
  | 'week'
  | 'weeks'
  | 'd'
  | 'dy'
  | 'dys'
  | 'day'
  | 'days'
  | 'h'
  | 'hr'
  | 'hrs'
  | 'hour'
  | 'hours'
  | 'm'
  | 'min'
  | 'mins'
  | 'minute'
  | 'minutes'
  | 's'
  | 'sc'
  | 'scs'
  | 'sec'
  | 'secs'
  | 'second'
  | 'seconds'

const numberRegex = '-?(\\.\\d+(e\\d+)?|\\d+(\\.\\d+(e\\d+)?)|\\d+(e\\d+)?)'

const enUnits = [
  'y((ea)?rs?)?', // y, yr, yrs, year, years
  'mo(nths?)?', // mo, month, months
  'w(eeks?)?', // w, week, weeks
  'd(a?ys?)?', // d, dy, dys, day, days
  'h((ou)?rs?)?', // h, hr, hrs, hour, hours
  'm(in(ute)?s?)?', // m, min, mins, minute, minutes
  's(ec(ond)?s?)?', // s, sec, secs, second, seconds
  'scs?' // sc, scs
]
