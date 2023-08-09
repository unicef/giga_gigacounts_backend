import { BaseTask } from 'adonis5-scheduler/build'
import service from 'App/Services/Notifications'
import nodeMailer from 'nodemailer'

export default class SendEmailNotifications extends BaseTask {
  public static get schedule() {
    return process.env.CRON_TASK_EMAIL || '*/1 * * * *'
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmpTaskLock`
   */
  public static get useLock() {
    return false
  }

  public async handle() {
    if (process.env.CRON_TASK_EMAIL_ENABLED?.toLocaleLowerCase() === 'false') return
    console.log('running task send email notifications')

    try {
      // Get notifications (created & channel == MAIL)
      const notifications = await service.getNotifications(['EMAIL'], ['CREATED'])

      // Build and send mails
      notifications.map(async (notification) => {
        switch (process.env.EMAIL_CLIENT_TO_USE) {
          case 'ETHEREAL':
            this.sendWithEthereal(notification)
            break
          case 'MAILJET':
            this.sendWithMailjet(notification)
            break
          default:
            this.sendWithMailjet(notification)
            break
        }
        // update notificaciones to sent
        await service.changeStatusNotificationsById(notification.id, notification.userId, 'SENT')
        console.log(
          `mail sent for notification ${notification.title} for user ${
            notification.email || 'no-mail'
          }`
        )
      })
    } catch (error) {
      console.error(error)
    }
  }

  private sendWithMailjet(notification) {
    try {
      const transporter = nodeMailer.createTransport({
        host: 'in-v3.mailjet.com',
        port: 587,
        auth: {
          user: process.env.EMAIL_MAILJET_API_KEY,
          pass: process.env.EMAIL_MAILJET_API_SECRET
        }
      })
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to:
          process.env.NODE_ENV === 'dev'
            ? process.env.EMAIL_MAILJET_ADDRESS_TO_FAKE
            : notification.email,
        subject: notification.title,
        text: notification.message,
        html: this.getHtmlTemplate(notification.message)
      }

      transporter.sendMail(mailOptions, function (error) {
        if (error) {
          console.error(error)
        } else {
          console.info('Email successfully sent (Mailjet)! (id: ' + mailOptions.to + ')')
        }
      })
    } catch (err) {
      console.error(err)
    }
  }

  private sendWithEthereal(notification) {
    try {
      // https://ethereal.email/create
      const transporter = nodeMailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: process.env.EMAIL_ETHEREAL_KEY,
          pass: process.env.EMAIL_ETHEREAL_SECRET
        }
      })
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: notification.email,
        subject: notification.title,
        text: notification.message,
        html: this.getHtmlTemplate(notification.message)
      }

      transporter.sendMail(mailOptions, function (error) {
        if (error) {
          console.error(error)
        } else {
          console.info('Email successfully sent (ethereal)! (id: ' + mailOptions.to + ')')
        }
      })
      return true
    } catch (ex) {
      console.error(ex)
      return false
    }
  }

  private getHtmlTemplate(content) {
    const urlFront = process.env.URL_FRONTEND || 'http://127.0.0.1:3000/'
    const ensureUrlFront = urlFront.slice(-1) === '/' ? urlFront : urlFront + '/'
    const urlContact = ensureUrlFront + 'dashboard/contact/'
    const urlGiga = ensureUrlFront
    const urlLogo = 'https://i.ibb.co/Q9FVmKW/giga1.jpg'
    const gigaReplace = '<span style="color:##277aff"><strong>Gigacounts</strong></span>'
    const today = new Date()
    const year = today.getFullYear()

    let contentReplaced = content.replace('giga', gigaReplace)

    return `<br/><br/><br/><img style='display:block;margin-left:auto;margin-right:auto;' alt='gigacounts' src="${urlLogo}" height='100'></img><br/><div style='background: #d6e4fd; border-left: 2px solid #0530ad;'><p style='text-align: center; font-size:20px;font-family:GothamBook;padding: 40px'>${contentReplaced}</p></div><br/><p style='font-size:16px'>Thanks, the <span style='color:##277aff'><a target="_blank" href="${urlGiga}" rel="noopener noreferrer">Gigacounts</a></span> Team.</p><p style='font-size:12px'>If you have any dubt, please <a target="_blank" href="${urlContact}" rel="noopener noreferrer">contact us</a>.</p><p style='font-size:12px'>Gigacounts Ⓒ ${year}</p>
    `
  }
}
