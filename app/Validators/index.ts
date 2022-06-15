import LoginValidator from './LoginValidator'
import UploadFileValidator from './UploadFileValidator'
import SaveDraftValidator from './SaveDraftValidator'
import CreateContractValidator from './CreateContractValidator'
import ChangeStatusValidator from './ChangeStatusValidator'

export default (validator: string) => {
  switch (validator) {
    case 'LoginValidator':
      return LoginValidator
    case 'UploadFileValidator':
      return UploadFileValidator
    case 'SaveDraftValidator':
      return SaveDraftValidator
    case 'CreateContractValidator':
      return CreateContractValidator
    case 'ChangeStatusValidator':
      return ChangeStatusValidator
    default:
      return ''
  }
}
