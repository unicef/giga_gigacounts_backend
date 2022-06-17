import Attachment from 'App/Models/Attachment'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Attachment, () => {
  return {
    url: 'www.url.com',
  }
}).build()
