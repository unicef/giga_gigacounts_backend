import { BaseTask } from 'adonis5-scheduler/build'

export default class Cashback extends BaseTask {
  public static get schedule() {
    return process.env.CRON_TASK_CASHBACK || '* */24 * * *'
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    if (process.env.CRON_TASK_CASHBACK_ENABLED?.toLocaleLowerCase() === 'false') return
    console.log('running task Cashback')
    // TBC
  }
}
