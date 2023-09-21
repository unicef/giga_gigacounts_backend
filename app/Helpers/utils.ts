import { DateTime as DateTimeLBD } from 'luxon-business-days'
import { DateTime } from 'luxon'
import { BigNumber, ethers } from 'ethers'
import InvalidTypeException from 'App/Exceptions/InvalidTypeException'
import { frequencyNames } from './constants'

interface DiffMonths {
  months: number
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
  while (start.startOf('day') <= end.startOf('day')) {
    if (start.isBusinessDay()) daysBetween += 1
    start = start.plus({ days: 1 })
  }
  if (relative) return positive ? daysBetween : -daysBetween
  return daysBetween
}

const diffOfMonths = (date1: DateTime, date2: DateTime) =>
  date1.diff(date2, ['month']).toObject() as DiffMonths

const diffOfDays = (date1: DateTime, date2: DateTime) =>
  date1.diff(date2, ['days']).toObject() as { days: number }

const setDateToBeginOfDayFromISO = (date: DateTime) =>
  DateTime.fromISO(date.toString()).startOf('day')

const setDateToEndOfDayFromISO = (date: DateTime) => DateTime.fromISO(date.toString()).endOf('day')

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
  try {
    const formatedDate = DateTime.fromISO(date)
    return start ? formatedDate.startOf('day') : formatedDate.endOf('day')
  } catch (error) {
    throw new InvalidTypeException(
      'Some convertion type error occurred while format contract date',
      440,
      'INVALID_TYPE_ERROR'
    )
  }
}

const toFixedFloat = (num: number, digits: number = 2) => parseFloat(num.toFixed(digits))

const makeFromAndToDate = (
  frecuency: string,
  month: number,
  year: number,
  contractEndDate: DateTime,
  contractStartDate: DateTime,
  day?: number
) => {
  let startPeriod
  let endPeriod
  let dateTo

  if (frecuency === frequencyNames.Monthly) {
    startPeriod = DateTime.now().set({ month, year }).startOf('month')
    endPeriod = DateTime.now().set({ month, year }).endOf('month').startOf('day')
  } else {
    if (day) {
      if (frecuency === frequencyNames.Weekly) {
        startPeriod = DateTime.now().set({ day, month, year }).startOf('week')
        endPeriod = DateTime.now().set({ day, month, year }).endOf('week').startOf('day')
      } else if (frecuency === frequencyNames.Biweekly) {
        const startDate = DateTime.now().set({ day, month, year })
        const daysDiff = startDate.diff(contractStartDate, 'days').days
        const numberOfBiweeks = Math.floor(daysDiff / 14) // 14 days in a biweek

        startPeriod = contractStartDate.plus({ weeks: numberOfBiweeks * 2 })
        endPeriod = startPeriod.plus({ days: 13 }).endOf('week').startOf('day')
      } else if (frecuency === frequencyNames.Daily) {
        startPeriod = DateTime.now().set({ day, month, year }).startOf('day')
        endPeriod = DateTime.now().set({ day, month, year }).startOf('day')
      }
    } else {
      throw new Error('The day parameter is required for weekly or biweekly payments.')
    }
  }

  dateTo = endPeriod > contractEndDate ? contractEndDate : endPeriod
  return { dateFrom: startPeriod, dateTo }
}

const toNormalNumber = (bigNumber: BigNumber) => {
  const etherNumber = ethers.utils.formatEther(bigNumber)
  return Math.round(parseFloat(etherNumber) * 10 ** 18)
}

const handleDBError = (message: string, status: number) => ({ status, message })

const GetDateTimeFromFormat = (dateFormat: string, stringDate?: string) => {
  if (!stringDate) {
    const dateValue = new Date()
    stringDate = `
      ${dateValue.getFullYear()}${dateValue.getMonth() + 1}${dateValue.getDay()}
      ${dateValue.getHours()}${dateValue.getMinutes()}${dateValue.getSeconds()}`
    return DateTime.fromFormat(stringDate, 'yyyyMMddHHmmss')
  }

  return DateTime.fromFormat(stringDate, dateFormat)
}

export default {
  removeProperty,
  getPercentage,
  splitIntoChunks,
  businessDiff,
  diffOfMonths,
  setDateToBeginOfDayFromISO,
  setDateToEndOfDayFromISO,
  getFirstAndLastDaysMonth,
  removeDuplicateTimestamps,
  formatContractDate,
  toFixedFloat,
  makeFromAndToDate,
  diffOfDays,
  toNormalNumber,
  handleDBError,
  GetDateTimeFromFormat
}
