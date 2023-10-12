import { BaseTask } from 'adonis5-scheduler/build'
import service from 'App/Services/Web3Service'
import userSerivce from 'App/Services/UserService'

export default class AutomaticPaymentsTask extends BaseTask {
  public static get schedule() {
    return process.env.CRON_TASK_AUTOMATIC_PAYMENTS || '* */24 * * *'
  }

  public static get useLock() {
    return false
  }

  public async handle() {
    if (process.env.CRON_TASK_AUTOMATIC_PAYMENTS_ENABLED?.toLocaleLowerCase() === 'false') return
    console.info('running task Automatic Payments')
    try {
      const user = await userSerivce.getGigaSchedulerUser()
      if (!user) {
        console.error('Error in task update contracts status: user service not found')
      } else {
        await service.automaticPayments(user)
      }
    } catch (err) {
      console.error(err)
    }
  }
}
