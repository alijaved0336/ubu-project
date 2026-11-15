
import { object } from 'zod'
import { checkboxValidation, emailValidation, passwordValidation } from '../utils/formInputValidations'

const getSignInSchema = (t) => {
  return object({
    email: emailValidation(t),
    password: passwordValidation(t),
    checkbox: checkboxValidation()
  })
}
export default getSignInSchema
