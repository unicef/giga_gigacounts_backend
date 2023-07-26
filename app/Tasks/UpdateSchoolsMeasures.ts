import { BaseTask } from 'adonis5-scheduler/build'
import service from 'App/Services/Contract'

export default class UpdateSchoolsMeasures extends BaseTask {
  public static get schedule() {
    return process.env.CRON_TASK_MEASURES || '*/1 * * * *'
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false
  }

  public async handle() {
    console.log('running task Update Schools Measures')
    await service.loadContractsDailyMeasures()
  }
}