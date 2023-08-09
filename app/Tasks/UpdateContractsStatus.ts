import { BaseTask } from 'adonis5-scheduler/build'
import service from 'App/Services/Contract'
import User from 'App/Models/User'
export default class UpdateContractsStatus extends BaseTask {
  public static get schedule() {
    return process.env.CRON_TASK_CONTRACTS_STATUS || '0 */10 * * *'
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false
  }

  public async handle() {
    if (process.env.CRON_TASK_CONTRACTS_STATUS_ENABLED?.toLocaleLowerCase() === 'false') return
    console.log('running task Update Contracts Status')
    try {
      const user = (await User.query().where('email', 'giga.scheduler@giga.com').first()) as User
      if (!user) {
        console.error('Error in task update contracts status: user service not found')
      } else {
        await service.contractStatusBatchUpdate(user)
      }
    } catch (err) {
      console.error(err)
    }
  }
}
