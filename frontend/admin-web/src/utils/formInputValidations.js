// Old
import { array, boolean, number, object, string, z } from "zod";
import { urlRegex } from "./regex";

const MIN_PASSWORD_LENGTH = 8;
const MAX_NAME_LENGTH = 50;

export const emailValidation = (t) => {
  return string({
    required_error: t("form.sign-in.errors.required", {
      fieldName: t("form.sign-in.field-names.email"),
    }),
  }).email(
    t("form.sign-in.errors.invalid", {
      fieldName: t("form.sign-in.field-names.email"),
    })
  );
};

export const passwordValidation = (t) => {
  return string({
    required_error: t("form.sign-in.errors.required", {
      fieldName: t("form.sign-in.field-names.password"),
    }),
  }).min(
    MIN_PASSWORD_LENGTH,
    t("form.sign-in.errors.min-length", {
      fieldName: t("form.sign-in.field-names.password"),
      count: MIN_PASSWORD_LENGTH,
      unit: t("unit.char"),
    })
  );
};

export const firstNameValidation = (t) => {
  return string({
    required_error: t("brand-registration-page.errors.required", {
      fieldName: t("brand-registration-page.field-names.first-name"),
    }),
  }).trim();
};
export const lastNameValidation = (t) => {
  return string({
    required_error: t("brand-registration-page.errors.required", {
      fieldName: t("brand-registration-page.field-names.last-name"),
    }),
  }).trim();
};

export const companyNameValidation = (t) => {
  return string({
    required_error: t("brand-registration-page.errors.required", {
      fieldName: t("brand-registration-page.field-names.company-name"),
    }),
  }).trim();
};
export const companyWebsiteValidation = (t) => {
  return string({
    required_error: t("brand-registration-page.errors.required", {
      fieldName: t("brand-registration-page.field-names.company-website"),
    }),
  })
    .trim()
    .regex(urlRegex, t("*Please enter a valid url"));
};
export const phoneNumberValidation = (t) => {
  return string({
    required_error: t("brand-registration-page.errors.required", {
      fieldName: t("brand-registration-page.field-names.phone-number"),
    }),
  }).trim();
};
export const jobTitleValidation = (t) => {
  return string({
    required_error: t("brand-registration-page.errors.required", {
      fieldName: t("brand-registration-page.field-names.job-title"),
    }),
  }).trim();
};

export const addressValidation = (t) => {
  return z.string().trim().min(1, "Please enter your address.");
};

export const ePlatformValidation = (t) => {
  return string({
    required_error: t("Please Enter the Platform", {}),
  }).trim();
};

export const descriptionValidation = (t) => {
  return string({
    required_error: t("brand-registration-page.errors.required", {
      fieldName: t("Description"),
    }),
  }).trim();
};
export const otherRegionValidation = (t) => {
  return string({
    required_error: t("brand-registration-page.errors.required", {
      fieldName: t("otherReg"),
    }),
  }).trim();
};
export const otherLangValidation = (t) => {
  return string({
    required_error: t("brand-registration-page.errors.required", {
      fieldName: t("otherLang"),
    }),
  }).trim();
};

export const otherCountryValidation = (t) => {
  return string({
    required_error: t("brand-registration-page.errors.required", {
      fieldName: t("otherCountry"),
    }),
  }).trim();
};

export const otherCityValidation = (t) => {
  return string({
    required_error: t("brand-registration-page.errors.required", {
      fieldName: t("otherCity"),
    }),
  }).trim();
};

export const cityValidation = (t) => {
  return z.string().trim().min(1, "Please enter your city.");
};

export const stateValidation = (t) => {
  return z.string().trim().min(1, "Please select your state.");
};

export const zipCodeValidation = (t) => {
  return z
    .string()
    .trim()
    .min(5, "Zip code must be at least 5 characters.")
    .max(10, "Zip code must be no more than 10 characters.");
};

export const commonValidation = (t) => {
  return object({
    questionId: number({
      required_error: t("brand-registration-page.errors.please-select", {
        fieldName: t("brand-registration-page.field-names.common-field"),
      }),
    }),
    srNo: number(),
    answer: string({
      required_error: t("brand-registration-page.errors.please-select", {
        fieldName: t("brand-registration-page.field-names.common-field"),
      }),
    }).min(1, {
      message: t("brand-registration-page.errors.please-select", {
        fieldName: t("brand-registration-page.field-names.common-field"),
      }),
    }),
  });
};
export const commonValidation2 = (t) => {
  return string().min(1, {
    message: t("brand-registration-page.errors.please-select", {
      fieldName: t("brand-registration-page.field-names.common-field"),
    }),
  });
};

export const affliatenetworkValuesValidation = (t) => {
  return string()
    .min(1, {
      message: t("brand-registration-page.errors.please-select", {
        fieldName: t("brand-registration-page.field-names.common-field"),
      }),
    })
    .optional();
};
export const checkBoxesValidation = (t) => {
  return array(
    string({
      required_error: t("brand-registration-page.errors.please-select", {
        fieldName: t("brand-registration-page.field-names.common-field"),
      }),
    })
  ).min(1, t("Please select at least one option"));
};

export const checkBoxesValidation2 = (t) => {
  return boolean({
    required_error: t("brand-registration-page.errors.required-cb", {
      fieldName: t("brand-registration-page.field-names.common-field"),
    }),
  }).refine((value) => value === true, {
    message: t("brand-registration-page.errors.required-cb", {
      fieldName: t("brand-registration-page.field-names.common-field"),
    }),
  });
};
export const checkboxValidation = () => {
  return boolean().optional();
};

export const checkboxSignUpValidation = (t) => {
  return boolean({
    required_error: t("form.sign-up.errors.required", {
      fieldName: t("form.sign-up.field-names.terms"),
    }),
  }).refine((value) => value === true, {
    message: t("form.sign-up.errors.required", {
      fieldName: t("form.sign-up.field-names.terms"),
    }),
  });
};

export const yourQuestionValidation = (t) => {
  return string({
    required_error: t("form.sign-up.errors.required", {
      fieldName: "Field",
    }),
  }).min(
    1,
    t("form.sign-up.errors.required", {
      fieldName: "Field",
    })
  );
  // .em(t('form.sign-up.errors.invalid', { fieldName: t('form.sign-up.field-names.username') }))
};

export const otherFieldValidation = (message) => {
  return z.string().trim().min(1, message);
};

export const privacyPolicyCB = (t) => {
  return z
    .boolean()
    .optional()
    .refine((val) => val === true, {
      message: "Please check this box to agree to the privacy policy.",
    });
};
export const radioValidation = () => {
  return z.string().min(1, "Please select an option before proceeding.");
};

export const dateOfBirthValidation = (t) => {
  return z
    .string()
    .min(1, t("form.sign-up.field-names.dob") + " is required")
    .refine((date) => {
      if (!date) return false;
      const selectedDate = new Date(date);
      const today = new Date();
      return selectedDate <= today;
    }, "Date of birth cannot be in the future");
};