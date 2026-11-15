
import { object } from 'zod'
import { 
  checkboxSignUpValidation, 
  emailValidation, 
  firstNameValidation, 
  lastNameValidation, 
  passwordValidation,
  dateOfBirthValidation 
} from '../utils/formInputValidations'

const getSignUpSchema = (t) => {
  return object({
    first_name: firstNameValidation(t),
    last_name: lastNameValidation(t),
    dob: dateOfBirthValidation(t),
    email: emailValidation(t),
    password: passwordValidation(t),
    checkbox: checkboxSignUpValidation(t)
  })
}
export default getSignUpSchema
