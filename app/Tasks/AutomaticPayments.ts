import { BaseTask } from 'adonis5-scheduler/build'

export default class AutomaticPayments extends BaseTask {
  public static get schedule() {
    return process.env.CRON_TASK_AUTOMATIC_PAYMENTS || '* */1 * * *'
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    if (process.env.CRON_TASK_AUTOMATIC_PAYMENTS_ENABLED?.toLocaleLowerCase() === 'false') return
    console.log('running task Cashback')
    // TBC
  }
}
