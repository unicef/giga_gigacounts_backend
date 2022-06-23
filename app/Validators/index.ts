import LoginValidator from './LoginValidator'
import UploadFileValidator from './UploadFileValidator'
import SaveDraftValidator from './SaveDraftValidator'
import CreateContractValidator from './CreateContractValidator'
import UpdateDraftValidator from './UpdateDraftValidator'
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
    case 'UpdateDraftValidator':
      return UpdateDraftValidator
    case 'ChangeStatusValidator':
      return ChangeStatusValidator
    default:
      return
  }
}
