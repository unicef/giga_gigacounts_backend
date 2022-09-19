import LoginValidator from './LoginValidator'
import UploadFileValidator from './UploadFileValidator'
import SaveDraftValidator from './SaveDraftValidator'
import CreateContractValidator from './CreateContractValidator'
import UpdateDraftValidator from './UpdateDraftValidator'
import ChangeStatusValidator from './ChangeStatusValidator'
import SchoolMeasuresValidator from './SchoolMeasuresValidator'
import CalculateMeasuresValidator from './CalculateMeasuresValidator'
import CreatePaymentValidator from './CreatePaymentValidator'
import ChangePaymentStatusValidator from './ChangePaymentStatusValidator'
import UpdatePaymentValidator from './UpdatePaymentValidator'
import AttachWalletValidator from './AttachWalletValidator'
import CreateSafeValidator from './CreateSafeValidator'
import AddUserValidator from './AddUserValidator'

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
    case 'SchoolMeasuresValidator':
      return SchoolMeasuresValidator
    case 'CalculateMeasuresValidator':
      return CalculateMeasuresValidator
    case 'CreatePaymentValidator':
      return CreatePaymentValidator
    case 'ChangePaymentStatusValidator':
      return ChangePaymentStatusValidator
    case 'UpdatePaymentValidator':
      return UpdatePaymentValidator
    case 'AttachWalletValidator':
      return AttachWalletValidator
    case 'CreateSafeValidator':
      return CreateSafeValidator
    case 'AddUserValidator':
      return AddUserValidator
    default:
      return
  }
}
