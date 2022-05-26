import LoginValidator from './LoginValidator'

export default (validator: string) => {
  switch (validator) {
    case 'LoginValidator':
      return LoginValidator
    default:
      return ''
  }
}
