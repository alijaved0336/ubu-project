import WarningIcon from "@src/assets/icons/WarningIcon";

export const PASSWORD_FIELD_TYPE = "password";
export const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export const asianCountries = [
  "Afghanistan",
  "Armenia",
  "Azerbaijan",
  "Bahrain",
  "Bangladesh",
  "Bhutan",
  "Brunei",
  "Cambodia",
  "China",
  "Georgia",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Israel",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Lebanon",
  "Malaysia",
  "Maldives",
  "Mongolia",
  "Myanmar (Burma)",
  "Nepal",
  "North Korea",
  "Oman",
  "Pakistan",
  "Palestine",
  "Philippines",
  "Qatar",
  "Saudi Arabia",
  "Singapore",
  "South Korea",
  "Sri Lanka",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Thailand",
  "Timor-Leste",
  "Turkey",
  "Turkmenistan",
  "United Arab Emirates",
  "Uzbekistan",
  "Vietnam",
  "Yemen"
];


export const europeanCountries = [
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Kingdom"
];

export const africanCountries = [
  "Algeria",
  "Angola",
  "Benin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cameroon",
  "Central African Republic",
  "Chad",
  "Comoros",
  "Democratic Republic of the Congo",
  "Djibouti",
  "Egypt",
  "Equatorial Guinea",
  "Eritrea",
  "Eswatini",
  "Ethiopia",
  "Gabon",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "Ivory Coast",
  "Kenya",
  "Lesotho",
  "Liberia",
  "Libya",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritania",
  "Mauritius",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Niger",
  "Nigeria",
  "Republic of the Congo",
  "Rwanda",
  "São Tomé and Príncipe",
  "Senegal",
  "Seychelles",
  "Sierra Leone",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Sudan",
  "Tanzania",
  "Togo",
  "Tunisia",
  "Uganda",
  "Zambia",
  "Zimbabwe"
];

export const southAmericanCountries = [
  "Argentina",
  "Bolivia",
  "Brazil",
  "Chile",
  "Colombia",
  "Ecuador",
  "Guyana",
  "Paraguay",
  "Peru",
  "Suriname",
  "Uruguay",
  "Venezuela"
];

export const oceaniaCountries = [
  "Australia",
  "Fiji",
  "Kiribati",
  "Marshall Islands",
  "Micronesia",
  "Nauru",
  "New Zealand",
  "Palau",
  "Papua New Guinea",
  "Samoa",
  "Solomon Islands",
  "Tonga",
  "Tuvalu",
  "Vanuatu"
];

export const antarcticaTerritories = [
  "Antarctic Peninsula",
  "Ross Dependency (New Zealand)",
  "Australian Antarctic Territory",
  "British Antarctic Territory",
  "Chilean Antarctic Territory",
  "Argentine Antarctica",
  "Norwegian Antarctic Territory (Queen Maud Land)",
  "French Southern and Antarctic Lands"
];

export const VALUES_TO_REMOVE = [
  "Other Regions",
  "Specific Countries (Please specify)",
  "Specific Cities / Regions (Please specify)",
  "Other"
];

export const vibrantColors = [
  { colorName: "Vibrant Red", hexaValue: "#FF5733" },
  { colorName: "Vibrant Green", hexaValue: "#28A745" },
  { colorName: "Vibrant Blue", hexaValue: "#007BFF" },
  { colorName: "Vibrant Yellow", hexaValue: "#FFC107" },
  { colorName: "Vibrant Pink", hexaValue: "#E83E8C" },
  { colorName: "Vibrant Orange", hexaValue: "#FF6F00" },
  { colorName: "Default", hexaValue: "#f0f0f0" },
];

export const lighterColors = [
  { colorName: "Lighter Red", hexaValue: "#FF8F66" },
  { colorName: "Lighter Green", hexaValue: "#6CD074" },
  { colorName: "Lighter Blue", hexaValue: "#66A9FF" },
  { colorName: "Lighter Yellow", hexaValue: "#FFD14F" },
  { colorName: "Lighter Pink", hexaValue: "#F7A2B5" },
  { colorName: "Lighter Orange", hexaValue: "#FF9F4D" },
];

export const grayColor = "#f0f0f0";

export const CampaignStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  PAYMENT_HELD: "payment-held",
  CONTRACT_SIGNING: "contract-signing",
  IN_PROGRESS: "in-progress",
  PUBLISHING: "publishing",
  SUBMITTED: "submitted",
  DISPUTED: "disputed",
  FUNDS_TRANSFERRED: "funds-transferred",
  REFUNDED: "rejected-refunded",
  COMPLETED: "completed",
};

export const connectedAccountStatuses = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  IN_ACTIVE: "in-active",
  COMPLETED: "completed",
};

export const accountInfoMessage = {
  "in-active":
    "Please provide your bank account details to receive payments for your collaborations and affiliate earnings.",
  "individual.id_number":
    "Your account is incomplete because the ID number is past due. Please provide or update your ID number to complete the verification process.",
  "individual.verification.document":
    "Your account verification is incomplete. Please upload a valid government-issued ID and ensure the name on the document matches the name provided during account creation. You may also need to provide your national ID number to complete the verification process.",
  "requirements.pending_verification":
    "Your account verification is in progress. Stripe is currently verifying your address, ID number and Document. You don’t need to take any immediate action. Please refresh this page after some time to check for updates.",
};

export const accountBtnMessage = {
  "in-active": "Create Connected Account",
  "in-progress": "Complete Account Details",
};

export const STRIPE_URL = "https://checkout.stripe";

export const FALLBACK_ERROR_MESSAGE = "An unexpected error has occured.";

export const STRIPE_PERCENTAGE = 2.9;
export const STRIPE_PERCENTAGE_VALUE = 0.029;
export const STRIPE_FLAT_FEE = 30; // amount in cents

export const maxSizeOfSingleMediaItemInMb = 30;
export const maxAllowedAffiliatedProducts = 10;
export const maxAllowedManualMedia = 5;

export const EMAIL_SENT_MESSAGE = 'An email has been sent on your given email address.'
export const CHECK_EMAIL_IN_SPAM_MESSAGE = 'If you don’t see the email in your inbox, please check your spam or junk folder.';

export const ADMIN_EMAILS = ['ubuglobaluser@gmail.com'];
