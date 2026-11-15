import { object } from "zod";
import {
  companyNameValidation,
  companyWebsiteValidation,
  emailValidation,
  firstNameValidation,
  jobTitleValidation,
  lastNameValidation,
  commonValidation,
  passwordValidation,
  phoneNumberValidation,
  checkBoxesValidation,
  affliatenetworkValuesValidation,
  checkBoxesValidation2,
  addressValidation,
  cityValidation,
  stateValidation,
  zipCodeValidation,
  descriptionValidation,
  ePlatformValidation
} from "../utils/formInputValidations";

const brandRegistrationSchema = (t, ePlatform) => {
  return object({
    companyName: companyNameValidation(t),
    companyWebsite: companyWebsiteValidation(t),
    phoneNumber: phoneNumberValidation(t),
    jobTitle: jobTitleValidation(t),
    address: addressValidation(t), 
    city: cityValidation(t), 
    state: stateValidation(t), 
    zipCode: zipCodeValidation(t), 
    description: descriptionValidation(t), 
    numOfEmp: commonValidation(t),
    describe: commonValidation(t),
    followers: commonValidation(t),
    country: commonValidation(t),
    affliatenetwork: checkBoxesValidation(t),
    affliatenetworkValues: affliatenetworkValuesValidation(t),
    platform: commonValidation(t),
    sale: commonValidation(t),
    productCategories: checkBoxesValidation(t),
    campaign: commonValidation(t),
    agency: commonValidation(t),
    agreeCB: checkBoxesValidation2(t),
    privacyPolicyCB: checkBoxesValidation2(t),
    ...(ePlatform ? { ePlatform: ePlatformValidation(t) } : {}),
  });
};

export default brandRegistrationSchema;
