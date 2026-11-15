export const shouldIncludeQuestion = (question, gender) => {
  return (
    (question.sr_no === 16 && gender === "Female") ||
    (question.sr_no === 17 && gender === "Male") ||
    (question.sr_no === 31 && gender === "Non-binary") ||
    (question.sr_no !== 16 && question.sr_no !== 17 && question.sr_no !== 31)
  );
};

export const getDefaultValues = (questionnaireData, userInfo, checkedState, isEditing) => {
  const otherFields = Object.keys(checkedState)?.reduce((acc, curr) => {
    acc[curr] = "";
    return acc;
  }, {});

  if (isEditing) {

    return questionnaireData?.reduce(
      (defaults, question) => {
        const validOptions = question.options?.map(opt => opt.option) || [];
  
        const extractOther = (answer) => {
          const [key, value] = answer.split(":");
          return { key, value };
        };
  
        if (question.is_multi_selected) {
          let finalAnswers = [];
  
          if (isEditing && Array.isArray(question.user_answer)) {
            question.user_answer.forEach(answer => {
              if (validOptions.includes(answer)) {
                finalAnswers.push(answer);
              } else if (answer.includes(":")) {
                const { key, value } = extractOther(answer);
                defaults[key] = value;
  
                if (question.sr_no === 30) {
                  if (key === "otherCities") finalAnswers.push("Other Cities");
                  else if (key === "otherCountries") finalAnswers.push("Other Countries");
                  else if (key === "otherRegions") finalAnswers.push("Other Regions");
                  else finalAnswers.push("Other"); // fallback
                } else {
                  finalAnswers.push("Other");
                }
              }
            });
          }
  
          defaults[question.sr_no] = finalAnswers;
        } else {
          let answer = isEditing ? question.user_answer?.[0] : "";
          if (isEditing && answer) {
            if (validOptions.includes(answer)) {
              defaults[question.sr_no] = answer;
            } else if (answer.includes(":")) {
              const { key, value } = extractOther(answer);
              defaults[key] = value;
  
              if (question.sr_no === 30) {
                if (key === "otherCities") defaults[question.sr_no] = "Other Cities";
                else if (key === "otherCountries") defaults[question.sr_no] = "Other Countries";
                else if (key === "otherRegions") defaults[question.sr_no] = "Other Regions";
                else defaults[question.sr_no] = "Other";
              } else {
                defaults[question.sr_no] = "Other";
              }
            } else {
              defaults[question.sr_no] = "";
            }
          } else {
            defaults[question.sr_no] = "";
          }
        }
  
        return defaults;
      },
      {
        address: userInfo?.address || "",
        city: userInfo?.city || "",
        state: userInfo?.state || "",
        zipCode: userInfo?.zip_code || "",
        additionalInfo: "",
        privacyPolicyCB: true,
        ...otherFields,
      }
    );
  } else {
    return questionnaireData?.reduce(
      (defaults, question) => {
        if (question.is_multi_selected) {
          defaults[question.sr_no] = [];
        } else {
          defaults[question.sr_no] = "";
        }
  
        return defaults;
      },
      {
        address: "",
        city: "",
        state: "",
        zipCode: "",
        additionalInfo: "",
        privacyPolicyCB: false,
        ...otherFields,
      }
    );
  }
};

export const questionnaireData = [
  {
    id: 459,
    title: "Gender",
    question: null,
    description: null,
    is_multi_selected: false,
    is_optional: false,
    selection_limit: 1,
    sr_no: 2,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 2,
    options: [
      {
        option: "Male",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Female",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Non-binary",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Prefer not to say",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Any",
        option_discription: "",
        image_url: "",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleRadio",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 460,
    title: "Ethnicity",
    question: null,
    description: null,
    is_multi_selected: false,
    is_optional: false,
    selection_limit: 1,
    sr_no: 3,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 3,
    options: [
      {
        option: "Caucasian",
        option_discription: "",
        image_url: "",
      },
      {
        option: "African American",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Hispanic or Latino",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Asian",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Native American",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Pacific Islander",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Middle Eastern",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Mixed Race",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Prefer not to say",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Other",
        image_url: "",
        input_field: {
          fieldName: "otherEthnicity",
          placeholder: "Enter Other Ethnicity",
        },
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleRadio",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 469,
    title: "Body Type",
    question: null,
    description: null,
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 1,
    sr_no: 10,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 4,
    options: [
      {
        option: "Apple",
        option_discription:
          "You carry most of your weight around your midsection, with a fuller bust and slimmer hips.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/apple.png",
      },
      {
        option: "Pear",
        option_discription:
          "Your hips are wider than your shoulders, with a smaller waist and a more defined lower body.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/pear.png",
      },
      {
        option: "Hourglass",
        option_discription:
          "You have a balanced bust and hips with a well-defined, narrow waist.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/hourglass.png",
      },
      {
        option: "Inverted Triangle",
        option_discription:
          "Your shoulders are broader than your hips, creating a more athletic upper body shape.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/inverted_triangle.png",
      },
      {
        option: "Rectangle-shaped",
        option_discription:
          "Your waist, hips, and shoulders are similar in width, giving you a straight, balanced silhouette.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/rectangle_shaped.png",
      },
      {
        option: "Long Torso",
        option_discription:
          "Your torso is proportionally longer than your legs, giving you an elongated midsection.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/long_torso.png",
      },
      {
        option: "Short Torso",
        option_discription:
          "Your torso is shorter in comparison to your legs, resulting in a more compact upper body.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/short_torso.png",
      },
      {
        option: "Long Legs",
        option_discription:
          "Your legs are longer in proportion to your torso, giving you an elongated lower body.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/long_legs.png",
      },
      {
        option: "Short Legs",
        option_discription:
          "Your legs are shorter compared to your torso, creating a more compact lower body.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/short_legs.png",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "checkboxCard",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 466,
    title: "Hair Color",
    question: null,
    description: null,
    is_multi_selected: false,
    is_optional: false,
    selection_limit: 1,
    sr_no: 7,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 5,
    options: [
      {
        option: "Blonde",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/blonde.png",
      },
      {
        option: "Brunette",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/brunette.png",
      },
      {
        option: "Black",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/black.png",
      },
      {
        option: "Red",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/red.png",
      },
      {
        option: "Grey",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/grey.png",
      },
      {
        option: "Bald",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/bald.png",
      },
      {
        option: "Dyed (e.g., blue, pink, green)",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/dayed.png",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleRadio",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 467,
    title: "Eye Color",
    question: null,
    description: null,
    is_multi_selected: false,
    is_optional: false,
    selection_limit: 1,
    sr_no: 8,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 6,
    options: [
      {
        option: "Blue",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Green",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Brown",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Hazel",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Grey",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Amber",
        option_discription: "",
        image_url: "",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleRadio",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 468,
    title: "Skin Shade",
    question: null,
    description: null,
    is_multi_selected: false,
    is_optional: false,
    selection_limit: 1,
    sr_no: 9,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 7,
    options: [
      {
        option: "Fair",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/fair.jpg",
      },
      {
        option: "Light",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/light.jpg",
      },
      {
        option: "Medium",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/medium.jpg",
      },
      {
        option: "Olive",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/olive.jpg",
      },
      {
        option: "Tan",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/tan.jpg",
      },
      {
        option: "Dark",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/dark.jpg",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleRadio",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 470,
    title: "Distinctive Features",
    question: null,
    description:
      "(We ask this to help match you with similar people, but if you'd rather not answer, feel free to skip! Hint: we know not one characteristic defines YOU, rest assured, you’ll be matched based on many other characteristics as well)",
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 1,
    sr_no: 11,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 8,
    options: [
      {
        option: "Tattoos",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/tattoos.png",
      },
      {
        option: "Piercings",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/piercings.png",
      },
      {
        option: "Freckles",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/freckles.png",
      },
      {
        option: "Person with a disability",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/person_with_a_disability.png",
      },
      {
        option: "Person with a prosthetic leg",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/person_with_a_prosthetic_leg.png",
      },
      {
        option: "Person who uses a wheelchair",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/person_who_uses_a_wheelchair.png",
      },
      {
        option: "Person with mobility challenges",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/person_with_mobility_challenges.png",
      },
      {
        option: "Person with a visual impairment",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/person_with_a_visual_impairment.png",
      },
      {
        option: "None",
        option_discription: null,
        image_url: "",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleCheckbox",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 471,
    title: "Values and Beliefs",
    question: null,
    description: null,
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 0,
    sr_no: 13,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 9,
    options: [
      {
        option: "Eco-Friendly",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/ecofriendly.png",
      },
      {
        option: "Animal Rights Advocate",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/animal_rights_advocate.png",
      },
      {
        option: "Social Justice Oriented",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/social_justice_oriented.png",
      },
      {
        option: "Religious",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/religious.png",
      },
      {
        option: "Secular",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/secular.png",
      },
      {
        option: "Philanthropic",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/philanthropic.png",
      },
      {
        option: "None",
        option_discription: null,
        image_url: "",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleCheckbox",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 483,
    title: null,
    question: "Where is your primary audience located? (Select all that apply)",
    description:
      "This helps brands find creators who are relevant in their target markets.",
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 0,
    sr_no: 30,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 10,
    options: [
      {
        option: "Northeast (e.g., New York, Boston)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Midwest (e.g., Chicago, Detroit)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "South (e.g., Atlanta, Miami, Texas)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "West (e.g., California, Seattle)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Mountain West (e.g., Colorado, Utah)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Southwest (e.g., Arizona, Nevada)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Eastern Canada (e.g., Toronto, Montreal)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Western Canada (e.g., Vancouver, Calgary)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Northern Canada",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Mexico City",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Northern Mexico (e.g., Monterrey, Tijuana)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Central Mexico (e.g., Guadalajara)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Southern Mexico (e.g., Yucatan Peninsula)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Other Regions",
        image_url: "",
        input_field: {
          fieldName: "otherRegions",
          placeholder: "Enter Other Regions",
        },
      },
      {
        option: "Other Countries",
        image_url: "",
        input_field: {
          fieldName: "otherCountries",
          placeholder: "Enter Other Countries",
        },
      },
      {
        option: "Other Cities",
        image_url: "",
        input_field: {
          fieldName: "otherCities",
          placeholder: "Enter Other Cities",
        },
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleCheckbox",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 461,
    title: "Languages",
    question: null,
    description:
      "Choose all that you speak, feel connected to, or would like to see profiles from",
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 0,
    sr_no: 4,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 11,
    options: [
      {
        option: "English",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/english.png",
      },
      {
        option: "Spanish",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/spanish.png",
      },
      {
        option: "Mandarin",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/mandarin.png",
      },
      {
        option: "French",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/french.png",
      },
      {
        option: "German",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/german.png",
      },
      {
        option: "Italian",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/italian.png",
      },
      {
        option: "Japanese",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/japanese.png",
      },
      {
        option: "Korean",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/korean.png",
      },
      {
        option: "Urdu",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/urdu.png",
      },
      {
        option: "Hindi",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/hindi.png",
      },
      {
        option: "Standard Arabic",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/standard_arabic.png",
      },
      {
        option: "Bengali",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/bengali.png",
      },
      {
        option: "Portuguese",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/portuguese.png",
      },
      {
        option: "Russian",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/russian.png",
      },
      {
        option: "Other",
        option_discription: null,
        image_url: "",
        input_field: {
          fieldName: "otherLanguage",
          placeholder: "Enter Other Language",
        },
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleCheckbox",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 462,
    title: "Budgets",
    question: null,
    description:
      "We know it can fluctuate with payday, so please check all that apply",
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 0,
    sr_no: 15,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 12,
    options: [
      {
        option: "Saver",
        option_discription:
          "Loves a good deal, lives for discounts, and shops at places like Walmart. If it’s on sale, they’re all in—bargain bins are their playground.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/saver.png",
      },
      {
        option: "Practical Picker",
        option_discription:
          "Loves a good deal but doesn’t dig through clearance racks. Shops at stores like Kohl’s and Target, with an eye for quality at a fair price.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/practical_picker.png",
      },
      {
        option: "Mix & Match",
        option_discription:
          "Balances high and low—picks up a tee at Target but pairs it with a designer handbag or belt from Louis Vuitton or YSL.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/mix_match.png",
      },
      {
        option: "Trusted & On-Point",
        option_discription:
          "Shops at Nordstrom and J-Crew, where quality and on-trend fashion are a given. Their price points are typically higher but worth not having to hunt for what you want. You also wear luxury items, but not exclusively.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/trusted_on_point.png",
      },
      {
        option: "Luxury Loyalist",
        option_discription:
          "All about the high-end life, only shops high-end retail. Quality and brand names are non-negotiable—luxury is a must.",
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/luxury_loyalist.png",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "checkboxCard",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 463,
    title: null,
    question:
      "What Feminine styles do you primarily focus on for your audience? Please check all that apply:",
    description:
      "This information helps your followers target a specific style.",
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 0,
    sr_no: 16,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 12,
    options: [
      {
        option: "Vintage Vibes",
        option_discription:
          "You love blending retro pieces with modern fashion for a unique, timeless look. To a dinner party, you might wear a retro-inspired dress with modern accessories and classic pumps",
        image_url: "",
      },
      {
        option: "Bold",
        option_discription:
          "Your style exudes confidence with bold, polished outfits that make a statement. A tailored blazer over a sleek pencil dress with pointed - toe heels and a structured handbag.",
        image_url: "",
      },
      {
        option: "Urban Chic",
        option_discription:
          "You bring urban flair to your everyday style, mixing edgy and casual elements effortlessly. A leather jacket over a graphic tee, distressed skinny jeans, and high top sneakers.",
        image_url: "",
      },
      {
        option: "Beachy Vibes",
        option_discription:
          "Your wardrobe is relaxed and breezy, perfect for easygoing, sunny-day vibes. A flowy maxi dress with a light cardigan and strappy sandals, accessorized with a sunhat.",
        image_url: "",
      },
      {
        option: "Boho",
        option_discription:
          "Your look is carefree and eclectic, with a love for flowy fabrics, earthy tones, and whimsical details. A floral print maxi skirt with a peasant blouse, layered necklaces, and ankle boots.",
        image_url: "",
      },
      {
        option: "Girl Next-Door",
        option_discription:
          "Your style is sweet, approachable, and effortlessly charming, with a focus on simple, classic pieces that are both comfortable and cute. Think of a soft, fitted cardigan over a casual top, paired with well-fitted jeans or a simple skirt, and finished with ballet flats or low-key sneakers.",
        image_url: "",
      },
      {
        option: "Classic Elegance",
        option_discription:
          "Your style focuses on enduring pieces that transcend trends, always looking sophisticated and elegant.A little black dress with a tailored trench coat and classic pumps.",
        image_url: "",
      },
      {
        option: "Sleek Minimalist",
        option_discription:
          "You prefer clean, simple lines with a love for streamlined, contemporary designs.A monochrome jumpsuit with minimalist sandals and a sleek crossbody bag.",
        image_url: "",
      },
      {
        option: "Old Money",
        option_discription:
          "Your style reflects timeless elegance with classic, well-tailored pieces and subtle sophistication, often opting for a neutral monochrome look. A cashmere sweater over high-waisted trousers, paired with loafers and pearl earrings.",
        image_url: "",
      },
      {
        option: "Cowgirl Chic",
        option_discription:
          "You blend rugged Western influences with modern fashion for a tough yet trendy look. A fitted long sleeve shirt with tight jeans, a fur vest, cowboy boots, and a wide-brim hat.",
        image_url: "",
      },
      {
        option: "Chameleon Style",
        option_discription:
          "Your style varies widely depending on where you're going and who you're with, effortlessly shifting from sexy to conservative or boho for different occasions. A sleek bodycon dress for a night out, a boho maxi dress for a festival, or a tailored blazer and jeans for a casual day out.",
        image_url: "",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "checkboxCard",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 464,
    title: null,
    question:
      "What Masculine styles do you primarily focus on for your audience? Please check all that apply:",
    description:
      "This information helps your followers target a specific style.",
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 0,
    sr_no: 17,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 13,
    options: [
      {
        option: 'Simple and Laid Back ("Hot Guy Next Door")',
        option_discription:
          "You prefer understated, well-fitting clothing without logos or prints, focusing on quality and fit. A perfect white V-neck tee with well-fitted jeans, a baseball hat worn backwards, and classic sneakers.",
        image_url: "",
      },
      {
        option: "Power Player",
        option_discription:
          "Your style is all about confidence with sharp, polished outfits that command attention. A sharp navy suit with a crisp white shirt, a silk tie, and polished oxford shoes.",
        image_url: "",
      },
      {
        option: "Street Edge",
        option_discription:
          "You infuse urban style into your wardrobe, effortlessly combining edgy and casual elements. A bomber jacket over a graphic tee, ripped jeans, and high-top sneakers.",
        image_url: "",
      },
      {
        option: "Coastal Casual",
        option_discription:
          "Your wardrobe is laid-back and breezy, ideal for relaxed, sunny-day outings. Chino shorts with a lightweight linen shirt, boat shoes, and aviator sunglasses.",
        image_url: "",
      },
      {
        option: "Timeless Classic",
        option_discription:
          "Your style is rooted in classic, enduring pieces that never go out of fashion. A well- fitted navy blazer over a white dress shirt, khaki chinos, and loafers.",
        image_url: "",
      },
      {
        option: "Modern Minimalist",
        option_discription:
          "You favor clean, simple lines and contemporary designs that exude understated sophistication. A slim-fit black turtleneck with tailored trousers and minimalist leather sneakers.",
        image_url: "",
      },
      {
        option: "Western Wear",
        option_discription:
          "You embrace the rugged, classic look of the American West, blending durability with style. A classic denim jacket over a plaid shirt, boot-cut jeans, and cowboy boots with a belt featuring a silver buckle.",
        image_url: "",
      },
      {
        option: "Chameleon Style",
        option_discription:
          "Your style varies widely depending on where you're going and who you're with, effortlessly shifting from laid back jeans and tee-shirts for home depot trips, to polished suits for the courtroom, and even an edgy graphic tee and bomber jacket for a date.",
        image_url: "",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "checkboxCard",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 472,
    title: "Follower count",
    question: null,
    description: null,
    is_multi_selected: false,
    is_optional: false,
    selection_limit: 1,
    sr_no: 18,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 13,
    options: [
      {
        option: "Nano (1K-10K)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Micro (10K-100K)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Macro (100K-1M)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Mega (1M+)",
        option_discription: "",
        image_url: "",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleRadio",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 465,
    title: null,
    question:
      "What Non-binary styles do you primarily focus on for your audience? Please check all that apply:",
    description:
      "This information helps your followers target a specific style.",
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 0,
    sr_no: 31,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 14,
    options: [
      {
        option: "Gender Neutral Styles",
        option_discription:
          "A blend of masculine and feminine elements that transcends traditional gender boundaries. Focused on comfort, simplicity, and versatility, these styles often feature clean lines and minimalistic designs suitable for all genders.",
        image_url: "",
      },
      {
        option: "Bold & Daring Styles",
        option_discription:
          "Daring, expressive, and eye-catching, this style embraces vibrant colors, dramatic patterns, and statement pieces. It’s all about making a statement through fashion with confidence and creativity.",
        image_url: "",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "checkboxCard",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 473,
    title: "Platforms are you most active",
    question: null,
    description: null,
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 1,
    sr_no: 19,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 14,
    options: [
      {
        option: "Instagram",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/instagram.svg",
      },
      {
        option: "TikTok",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/tiktok.svg",
      },
      {
        option: "YouTube",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/youtube.svg",
      },
      {
        option: "Pinterest",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/pinterest.svg",
      },
      {
        option: "Twitter'X'",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/twitterx.svg",
      },
      {
        option: "Facebook",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/facebook.svg",
      },
      {
        option: "Linkedln",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/linkedln.svg",
      },
      {
        option: "Snapchat",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/snapchat.svg",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleCheckbox",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 474,
    title: "Content niches do you primarily focus on",
    question: null,
    description: null,
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 1,
    sr_no: 20,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 15,
    options: [
      {
        option: "Fashion",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/fashion.png",
      },
      {
        option: "Beauty",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/beauty.png",
      },
      {
        option: "Fitness",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/fitness.png",
      },
      {
        option: "Travel",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/travel.png",
      },
      {
        option: "Technology",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/technology.png",
      },
      {
        option: "Gaming",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/gaming.png",
      },
      {
        option: "Food & Cooking",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/food__cooking.png",
      },
      {
        option: "Parenting",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/parenting.png",
      },
      {
        option: "Lifestyle",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/lifestyle.png",
      },
      {
        option: "Health & Wellness",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/health__wellness.png",
      },
      {
        option: "Sports",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/sports.png",
      },
      {
        option: "Other",
        option_discription: null,
        image_url: "",
        input_field: {
          fieldName: "otherContent",
          placeholder: "Enter Other Content",
        },
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleCheckbox",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 475,
    title: "Average engagement rate:",
    question: null,
    description: null,
    is_multi_selected: false,
    is_optional: false,
    selection_limit: 1,
    sr_no: 21,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 16,
    options: [
      {
        option: "1-3% (Low)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "4-6% (Medium)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "7+% (High)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Don't Know",
        option_discription: "",
        image_url: "",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleRadio",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 476,
    title: "Describe the quality of comments on your content",
    question: null,
    description: null,
    is_multi_selected: false,
    is_optional: false,
    selection_limit: 1,
    sr_no: 22,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 17,
    options: [
      {
        option: "Basic comments (e.g., likes, short responses)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Medium-depth comments (e.g., questions, short discussions)",
        option_discription: "",
        image_url: "",
      },
      {
        option:
          "High-quality comments (e.g., detailed questions, long discussions)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Don't Know",
        option_discription: "",
        image_url: "",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleRadio",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 477,
    title: null,
    question: "How frequently do you interact with your audience?",
    description: null,
    is_multi_selected: false,
    is_optional: false,
    selection_limit: 1,
    sr_no: 23,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 18,
    options: [
      {
        option: "Low interaction (e.g., rare replies)",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/low_interaction.png",
      },
      {
        option: "Medium interaction (e.g., occasional replies)",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/medium_interaction.png",
      },
      {
        option: "High interaction (e.g., frequent, meaningful replies)",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/high_interaction.png",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "radioCard",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 478,
    title: null,
    question: "What is the average view count on your stories?",
    description: null,
    is_multi_selected: false,
    is_optional: false,
    selection_limit: 1,
    sr_no: 24,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 19,
    options: [
      {
        option: "Under 10K views",
        option_discription: "",
        image_url: "",
      },
      {
        option: "10K-50K views",
        option_discription: "",
        image_url: "",
      },
      {
        option: "50K-100K views",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Over 100K views",
        option_discription: "",
        image_url: "",
      },
      {
        option: "DOnt't Know",
        option_discription: "",
        image_url: "",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleRadio",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 479,
    title: null,
    question: "How would you describe your content’s aesthetic?",
    description: null,
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 0,
    sr_no: 25,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 20,
    options: [
      {
        option:
          "Professional (Polished, high-quality content with a focus on refined and well-produced visuals)",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/professional.png",
      },
      {
        option: "Authentic (Real - life, relatable content that feels genuine)",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/authentic.png",
      },
      {
        option:
          "Unfiltered (Candid, unedited style where you talk directly to the camera in an everyday, unscripted manner)",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/unfiltered.png",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "checkboxCardSmall",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 480,
    title: null,
    question: "What content types do you primarily create?",
    description: null,
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 0,
    sr_no: 26,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 21,
    options: [
      {
        option: "Video",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/video.png",
      },
      {
        option: "Photography",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/photography.png",
      },
      {
        option: "Blog Posts",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/blog_posts.png",
      },
      {
        option: "Reels/Short-form Video",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/reelsshortform_video.png",
      },
      {
        option: "Stories",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/stories.png",
      },
      {
        option: "Live Streams",
        option_discription: null,
        image_url:
          "https://ubu-staging.s3.us-east-2.amazonaws.com/questionnaire_assets/live_streams.png",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "checkboxCardSmall",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 481,
    title: null,
    question:
      "What level of professionalism (production quality) does your content typically have?",
    description: null,
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 0,
    sr_no: 27,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 22,
    options: [
      {
        option: "Low (Casual, unpolished)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Medium(Semi-professional, good lighting/editing)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "High(Professional-grade, high- quality production)",
        option_discription: "",
        image_url: "",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleCheckbox",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
  {
    id: 482,
    title: null,
    question: "How would you describe the creativity of your content?",
    description: null,
    is_multi_selected: true,
    is_optional: false,
    selection_limit: 0,
    sr_no: 28,
    question_category_sr_no: 1,
    category_sub_question_sr_no: 23,
    options: [
      {
        option: "Low (Straightforward content)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "Medium(Moderate originality)",
        option_discription: "",
        image_url: "",
      },
      {
        option: "High(Highly innovative, unique content ideas)",
        option_discription: "",
        image_url: "",
      },
    ],
    question_category: null,
    question_category_description: null,
    user_type: "influencer",
    layout: "simpleCheckbox",
    created_at: "2025-04-07T12:32:14.203Z",
    updated_at: "2025-04-07T12:32:14.203Z",
    user_answer: [],
  },
];
