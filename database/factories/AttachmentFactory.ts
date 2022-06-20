import Attachment from 'App/Models/Attachment'
import Factory from '@ioc:Adonis/Lucid/Factory'

import ContractFactory from './ContractFactory'

export default Factory.define(Attachment, () => {
  return {
    url: 'www.url.com',
  }
})
  .relation('contracts', () => ContractFactory)
  .build()
