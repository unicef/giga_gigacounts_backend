import { DateTime as DateTimeLBD } from 'luxon-business-days'
import { DateTime } from 'luxon'

interface DiffMonths {
  months: number
}

const destructObjArrayWithId = (object?: { id: string }[]) => {
  return (object || []).map((x) => x.id)
}

const removeProperty = (object: any, propertyName: string) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let { [propertyName]: _, ...rest } = object
  return rest
}

const getPercentage = (baseValue: number, value: number) => (value / baseValue) * 100

const splitIntoChunks = (array: any[], chunkSize: number) => {
  if (chunkSize === 0) return array
  if (array.length === 0) return []
  const otherChunks = splitIntoChunks(array.slice(chunkSize), chunkSize)
  return [array.slice(0, chunkSize), ...otherChunks]
}

const businessDiff = (date1: DateTimeLBD, date2: DateTimeLBD, relative?: boolean) => {
  const positive = date1 >= date2
  let start = date1 < date2 ? date1 : date2
  const end = date2 > date1 ? date2 : date1
  let daysBetween = 0
  if (start.hasSame(end, 'day')) return daysBetween
  while (start.startOf('day') < end.startOf('day')) {
    if (start.isBusinessDay()) daysBetween += 1
    start = start.plus({ days: 1 })
  }
  if (!end.isBusinessDay()) daysBetween -= 1
  if (relative) return positive ? daysBetween : -daysBetween
  return daysBetween
}

const diffOfMonths = (date1: DateTime, date2: DateTime) =>
  date1.diff(date2, ['months']).toObject() as DiffMonths

const setDateToBeginOfDayFromISO = (date: DateTime) =>
  DateTime.fromISO(date.toString()).startOf('day')

const getFirstAndLastDaysMonth = (date: DateTime) => {
  const firstDay = date.startOf('month')
  const lastDay = date.endOf('month')
  return { firstDay, lastDay }
}

const removeDuplicateTimestamps = (timestamps: string[]) => {
  return timestamps
    .map((date) => DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd'))
    .filter((value, index, self) => index === self.findIndex((t) => t === value))
}

const formatContractDate = (date: string, start: boolean = false) => {
  const formatedDate = DateTime.fromFormat(date, 'yyyy-MM-dd')
  return start ? formatedDate.startOf('day') : formatedDate.endOf('day')
}

export default {
  destructObjArrayWithId,
  removeProperty,
  getPercentage,
  splitIntoChunks,
  businessDiff,
  diffOfMonths,
  setDateToBeginOfDayFromISO,
  getFirstAndLastDaysMonth,
  removeDuplicateTimestamps,
  formatContractDate,
}
