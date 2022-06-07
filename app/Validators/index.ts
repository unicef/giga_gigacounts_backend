import LoginValidator from './LoginValidator'
import SaveDraftValidator from './SaveDraftValidator'
import CreateContractValidator from './CreateContractValidator'

export default (validator: string) => {
  switch (validator) {
    case 'LoginValidator':
      return LoginValidator
    case 'SaveDraftValidator':
      return SaveDraftValidator
    case 'CreateContractValidator':
      return CreateContractValidator
    default:
      return ''
  }
}
