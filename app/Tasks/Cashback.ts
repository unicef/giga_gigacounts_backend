import { BaseTask } from 'adonis5-scheduler/build'
import service from 'App/Services/Web3'
import userSerivce from 'App/Services/User'

export default class Cashback extends BaseTask {
  public static get schedule() {
    return process.env.CRON_TASK_CASHBACK || '* */24 * * *'
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    if (process.env.CRON_TASK_CASHBACK_ENABLED?.toLocaleLowerCase() === 'false') return
    console.info('running task Cashback')
    try {
      const user = await userSerivce.getGigaSchedulerUser()
      if (!user) {
        console.error('Error in task update contracts status: user service not found')
      } else {
        await service.cashback(user)
      }
    } catch (err) {
      console.error(err)
    }
  }
}
