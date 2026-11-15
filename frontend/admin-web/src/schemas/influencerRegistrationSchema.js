import { object } from "zod";
import {
  checkBoxesValidation2,
  checkBoxesValidation,
  commonValidation2,
  addressValidation,
  cityValidation,
  stateValidation,
  zipCodeValidation,
  otherRegionValidation,
  otherCountryValidation,
  otherCityValidation,
  otherLangValidation
} from "../utils/formInputValidations";

const influencerRegistrationSchema = (t, data,checkedState) => {
data ?data = Object.values(data).flat():null
console.log(checkedState);
const influencerSchema =
    data &&
    data.length > 0 &&
    data.reduce((schema, question) => {
      if (
        ![
          13,30, 4, 15, 25, 26,27, 28 ,16,17,31,19,20,10
        ].includes(question.sr_no)
      ) {
        schema[question.sr_no] = commonValidation2(t);
      }

     
      return schema;
    }, {});

  const ob = object({
    ...influencerSchema,
    privacyPolicyCB: checkBoxesValidation2(t),
    13: checkBoxesValidation(t),
    4: checkBoxesValidation(t),
    30: checkBoxesValidation(t),
    19: checkBoxesValidation(t),
    20: checkBoxesValidation(t),
    10: checkBoxesValidation(t),
    15: checkBoxesValidation(t),
    25: checkBoxesValidation(t),
    26: checkBoxesValidation(t),
    27: checkBoxesValidation(t),
    28: checkBoxesValidation(t),
    ...(checkedState.otherReg ? { otherReg: otherRegionValidation(t) } : {}),
    ...(checkedState.otherLang ? { otherLang: otherLangValidation(t) } : {}),
    ...(checkedState.otherCountry ? { otherCountry: otherCountryValidation(t) } : {}),
    ...(checkedState.otherCity ? { otherCity: otherCityValidation(t) } : {}),
    ...(checkedState.otherEth ? { otherEth: otherCityValidation(t) } : {}),
    ...(checkedState.selectedGender !== 0 && [16, 17, 31].includes(checkedState.selectedGender)
    ? {
        [checkedState.selectedGender]: checkBoxesValidation(t)
      }
    : {}),
    address: addressValidation(t), 
    city: cityValidation(t), 
    state: stateValidation(t), 
    zipCode: zipCodeValidation(t) 
  });

  return ob;
};

export default influencerRegistrationSchema;
