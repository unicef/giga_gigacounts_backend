import LoginValidator from './LoginValidator'
import UploadFileValidator from './UploadFileValidator'

export default (validator: string) => {
  switch (validator) {
    case 'LoginValidator':
      return LoginValidator
    case 'UploadFileValidator':
      return UploadFileValidator
    default:
      return ''
  }
}
