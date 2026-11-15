//
//  Constants.swift
//  UBU
//
//  Created by Irtaza Fiaz on 23/09/2024.
//

import Foundation

struct Constants {
    
    static let bodygramNote = "We know every body is unique, but our algorithm is based on masculine and feminine proportions. Choosing the option that aligns with your body’s shape (like height and weight distribution) will give more accurate results, but feel free to explore any style once your measured!"
    
    static let heightFeetOptions: [String] = Array(2...8).map { "\($0)" }
    static let heightInchesOptions: [String] = Array(0...12).map { "\($0)" }
    static let weightOptions: [String] = Array(22...441).map { "\($0)" }
    static let ageOptions: [String] = Array(5...100).map { "\($0)" }
    static let genderOptions: [String] = ["Male", "Female"]
    static let transGenderOptions: [String] = ["Male", "Female", "Non-binary"]
    static let endingsToRemove: [Character] = ["M", "W", "K", "Y"]

    static let bodygramApiKey = "nB1KdsdWKJLq30BaB0auFM9j1P3dVUdcAHewxzKVrnt"
    static let bodygramOrganizationId = "org_5nxbLMK2j9eqUwQErrG9Lc"
    
    static let bodyMeasurementLabels: [String: String] = [
        "acrossBackShoulderWidth": "Back Shoulder Width",
        "ankleGirthL": "Left Ankle Girth",
        "ankleGirthR": "Right Ankle Girth",
        "backNeckHeight": "Back Neck Height",
        "backNeckPointToGroundContoured": "Neck to Ground",
        "backNeckPointToWaist": "Neck to Waist",
        "backNeckPointToWristLengthR": "Neck to Wrist Length",
        "bellyWaistDepth": "Belly Depth",
        "bellyWaistGirth": "Belly Girth",
        "bellyWaistHeight": "Belly Height",
        "bellyWaistWidth": "Belly Width",
        "bustGirth": "Bust Girth",
        "bustHeight": "Bust Height",
        "calfGirthL": "Left Calf Girth",
        "calfGirthR": "Right Calf Girth",
        "crotchHeight": "Crotch Height",
        "forearmGirthL": "Left Forearm Girth",
        "forearmGirthR": "Right Forearm Girth",
        "headGirth": "Head Girth",
        "hipGirth": "Hip Girth",
        "hipHeight": "Hip Height",
        "insideLegHeight": "Inner Leg Height",
        "insideLegLengthL": "Left Inner Leg Length",
        "insideLegLengthR": "Right Inner Leg Length",
        "kneeGirthR": "Knee Girth",
        "kneeHeightR": "Knee Height",
        "midThighGirthR": "Mid-Thigh Girth",
        "neckBaseGirth": "Neck Base Girth",
        "neckGirth": "Neck Girth",
        "outerAnkleHeightR": "Outer Ankle Height",
        "outerArmLengthL": "Left Outer Arm Length",
        "outerArmLengthR": "Right Outer Arm Length",
        "outseamL": "Left Outseam",
        "outseamR": "Right Outseam",
        "outsideLegLengthL": "Left Outer Leg Length",
        "outsideLegLengthR": "Right Outer Leg Length",
        "shoulderToElbowL": "Left Shoulder to Elbow",
        "shoulderToElbowR": "Right Shoulder to Elbow",
        "shoulderToWristL": "Left Shoulder to Wrist",
        "shoulderToWristR": "Right Shoulder to Wrist",
        "thighGirthL": "Left Thigh Girth",
        "thighGirthR": "Right Thigh Girth",
        "topHipGirth": "Top Hip Girth",
        "topHipHeight": "Top Hip Height",
        "underBustGirth": "Underbust Girth",
        "upperArmGirthL": "Left Upper Arm Girth",
        "upperArmGirthR": "Right Upper Arm Girth",
        "waistGirth": "Waist Girth",
        "waistHeight": "Waist Height",
        "wristGirthL": "Left Wrist Girth",
        "wristGirthR": "Right Wrist Girth"
    ]
    
    static let requiredFieldsEditBgView  = ["outseamR", "thighGirthR",  "bellyWaistGirth", "bustGirth", "hipGirth", "outerArmLengthR", "acrossBackShoulderWidth", "waistGirth"]
    static let stripeFieldMessages: [String: String] = [
        // Business Profile
        "business_profile.mcc": "Business profile MCC code",
        "business_profile.product_description": "Business profile product description",
        "business_profile.support_phone": "Business profile support phone",
        "business_profile.url": "Business profile website URL",
        "business_profile.name": "Business profile name",

        // External Bank Account
        "external_account": "Bank account details",

        // Individual/Person Details
        "individual.address.city": "Individual's city address",
        "individual.address.line1": "Individual's address line 1",
        "individual.address.postal_code": "Individual's postal code",
        "individual.address.state": "Individual's state address",
        "individual.dob.day": "Individual's date of birth (day)",
        "individual.dob.month": "Individual's date of birth (month)",
        "individual.dob.year": "Individual's date of birth (year)",
        "individual.email": "Individual's email address",
        "individual.first_name": "Individual's first name",
        "individual.last_name": "Individual's last name",
        "individual.phone": "Individual's phone number",
        "individual.ssn_last_4": "Last 4 digits of individual's SSN",
        "individual.id_number": "Individual's ID number",
        "individual.verification.document": "Upload a document for identity verification",

        // Legal Entity/Company (if business, not individual)
        "company.address.city": "Company city address",
        "company.address.line1": "Company address line 1",
        "company.address.postal_code": "Company postal code",
        "company.address.state": "Company state address",
        "company.name": "Company legal name",
        "company.phone": "Company phone number",
        "company.tax_id": "Company tax ID",
        "company.verification.document": "Upload a company verification document",

        // Directors/Owners (for companies)
        "directors_provided": "Add company directors",
        "executives_provided": "Add company executives",
        "owners_provided": "Add company owners",

        // Statement Descriptors
        "settings.payments.statement_descriptor": "Payment settings (statement descriptor)",
        "settings.payments.statement_descriptor_kana": "Statement descriptor (Kana)",
        "settings.payments.statement_descriptor_kanji": "Statement descriptor (Kanji)",
        "settings.payments.statement_descriptor_prefix": "Statement descriptor prefix",

        // Terms of Service
        "tos_acceptance.date": "Acceptance of the Terms of Service (date)",
        "tos_acceptance.ip": "Acceptance of the Terms of Service (IP address)",
        "tos_acceptance.user_agent": "Acceptance of the Terms of Service (browser user agent)",

        // Miscellaneous / Other common Stripe requirements
        "relationship.account_opener": "Account opener information",
        "relationship.owner": "Owner information",
        "relationship.representative": "Representative information",
        "relationship.director": "Director information",
        "business_type": "Business type selection",

        // Document uploads
        "verification.document": "Identity document upload",
        "verification.additional_document": "Additional document upload",
        "verification.document_front": "Upload front of the identity document",
        "verification.document_back": "Upload back of the identity document",
        "verification.additional_document_front": "Upload front of the additional document",
        "verification.additional_document_back": "Upload back of the additional document",
    ]
    
    static let stripeFieldIcons: [String: String] = [
        // Business Profile
        "business_profile.mcc": "number",
        "business_profile.product_description": "text.alignleft",
        "business_profile.support_phone": "phone.fill",
        "business_profile.url": "globe",
        "business_profile.name": "building.2.crop.circle",

        // External Bank Account
        "external_account": "creditcard",

        // Individual/Person Details
        "individual.address.city": "mappin.and.ellipse",
        "individual.address.line1": "house.fill",
        "individual.address.postal_code": "envelope",
        "individual.address.state": "map",
        "individual.dob.day": "calendar",
        "individual.dob.month": "calendar",
        "individual.dob.year": "calendar",
        "individual.email": "envelope.fill",
        "individual.first_name": "person.fill",
        "individual.last_name": "person.fill",
        "individual.phone": "phone.fill",
        "individual.ssn_last_4": "lock.fill",
        "individual.id_number": "person.text.rectangle",
        "individual.verification.document": "doc.on.clipboard",

        // Legal Entity/Company (if business, not individual)
        "company.address.city": "building.2",
        "company.address.line1": "building.2.fill",
        "company.address.postal_code": "envelope.open.fill",
        "company.address.state": "map.fill",
        "company.name": "building.2.crop.circle",
        "company.phone": "phone.connection",
        "company.tax_id": "textformat.123",
        "company.verification.document": "doc.on.clipboard.fill",

        // Directors/Owners (for companies)
        "directors_provided": "person.3.fill",
        "executives_provided": "person.2.crop.square.stack.fill",
        "owners_provided": "person.2.fill",

        // Statement Descriptors
        "settings.payments.statement_descriptor": "doc.text",
        "settings.payments.statement_descriptor_kana": "character.book.closed.fill",
        "settings.payments.statement_descriptor_kanji": "character.book.closed",
        "settings.payments.statement_descriptor_prefix": "character.cursor.ibeam",

        // Terms of Service
        "tos_acceptance.date": "calendar.badge.checkmark",
        "tos_acceptance.ip": "network",
        "tos_acceptance.user_agent": "desktopcomputer",

        // Miscellaneous / Other common Stripe requirements
        "relationship.account_opener": "person.crop.circle.badge.plus",
        "relationship.owner": "person.crop.circle.badge.checkmark",
        "relationship.representative": "person.crop.circle",
        "relationship.director": "person.3.sequence.fill",
        "business_type": "briefcase.fill",

        // Document uploads
        "verification.document": "doc.plaintext",
        "verification.additional_document": "folder.fill.badge.plus",
        "verification.document_front": "doc.text.viewfinder",
        "verification.document_back": "doc.text.viewfinder",
        "verification.additional_document_front": "doc.on.doc",
        "verification.additional_document_back": "doc.on.doc.fill"
    ]

    struct QuestionSrnos {
        static let gender = 2
        static let languages = 4
        static let maculineStyle = 17
        static let feminineStyle = 16
        static let nonBinaryStyle = 31
        static let shoeSize = 18
    }
    
    struct TermsService {
        
        // Introduction
        static let introduction = """
        Welcome to UBU Platforms Inc. ("UBU"). By accessing, using, or registering for our services ("Services"), you agree to these Terms of Service ("Terms"), along with our Privacy Policy, Cookie Policy, and Community Guidelines, which are incorporated by reference. It is your responsibility to review the most current versions of these documents regularly.
        """
        
        // Agreement Overview
        static let agreementOverview = """
        This End User License Agreement and Terms of Service ("Agreement") constitutes a legally binding contract between you ("User") and UBU. By registering, visiting, accessing, downloading, or using our Services, you accept and agree to be bound by the terms and conditions of this Agreement. If you do not agree to this Agreement, you must not register, visit, access, download, or use our Services.
        """
        
        // Effective Date and Termination
        static let effectiveDateTermination = """
        This Agreement is effective immediately upon your access to the Services (the "Effective Date") and will remain in full force and effect until terminated. UBU reserves the right to terminate or suspend your use of the Services at its sole discretion, with or without cause or notice, including if UBU believes that you have violated or acted inconsistently with this Agreement. You may terminate this Agreement at any time by closing your user account and ceasing all use of the Services.
        """
        
        // Modification to Terms
        static let modificationToTerms = """
        UBU reserves the right to modify this Agreement, the Privacy Policy, Cookie Policy, and Community Guidelines at any time. If you have registered as a user, UBU will notify you of any material changes via email or through the Services before such changes take effect. Your continued use of the Services after the posting or notification of changes constitutes your acceptance of the modified terms.
        """
        
        // Services Provided
        static let servicesProvided = """
        UBU provides a platform that facilitates connections and commercial relationships between brands ("Brands"), content creators ("Creators"), and consumers through digital channels, including websites, mobile applications, and other online services (collectively, "Platform"). Our Services allow users to create, share, and monetize content while interacting with third-party Brands and Creators.
        """
        
        // Service Availability and Termination
        static let serviceAvailabilityTermination = """
        UBU reserves the right to modify, suspend, or discontinue any part of the Services at its discretion, without notice or liability. UBU may terminate your access to the Services if you violate these Terms or act in a manner that is inconsistent with the platform's values and policies.
        """
        
        // Account Registration and Security
        static let accountRegistrationSecurity = """
        To access certain features of the Platform, you must create an account by providing accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify UBU immediately of any unauthorized use of your account.
        """
        
        // Prohibited Content and Conduct
        static let prohibitedContentConduct = """
        You are strictly prohibited from posting or sharing any content that is offensive, obscene, pornographic, defamatory, or otherwise violates any applicable laws or the rights of third parties. UBU reserves the right to remove any content that it deems, in its sole discretion, to be in violation of these Terms.
        """
        
        // Data Privacy and Compliance
        static let dataPrivacyCompliance = """
        UBU acts as a data processor on behalf of the Brands and Creators who use our Services. UBU is committed to complying with the California Consumer Privacy Act (CCPA) and the General Data Protection Regulation (GDPR). Users have the right to access, correct, and delete their personal data. UBU provides a Data Processing Agreement (DPA) upon request.
        """
        
        // Content and Intellectual Property
        static let contentIntellectualProperty = """
        By uploading content to the Platform, you grant UBU a non-exclusive, royalty-free, worldwide license to use, reproduce, and display the content for the purpose of operating and promoting the Platform. All intellectual property rights in the Platform, including software, design, text, and graphics, are owned by or licensed to UBU.
        """
        
        // Payments and Fees
        static let paymentsAndFees = """
        UBU may charge fees for the use of certain features on the Platform. Payments between Brands and Creators are facilitated through third-party payment processors. UBU is not responsible for any payment disputes between users. Refunds are subject to the terms agreed upon by the Brand and Creator.
        """
        
        // Indemnification
        static let indemnification = """
        You agree to indemnify, defend, and hold harmless UBU, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses arising out of your use of the Platform, your breach of these Terms, or your violation of any rights of a third party.
        """
        
        // Limitation of Liability
        static let limitationOfLiability = """
        UBU is not liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Platform. UBU's total liability to you for any claim arising from your use of the Platform shall not exceed the amount you paid, if any, to UBU for access to and use of the Services.
        """
        
        // Dispute Resolution
        static let disputeResolution = """
        Any disputes arising out of or in connection with these Terms shall be resolved through mediation in accordance with the American Bar Association (ABA) mediation standards. These Terms shall be governed by and construed in accordance with the laws of the State of Delaware.
        """
        
        // Force Majeure
        static let forceMajeure = """
        UBU shall not be liable for any failure or delay in performance under these Terms due to circumstances beyond its reasonable control, including, but not limited to, acts of God, natural disasters, war, labor disputes, or governmental actions.
        """
        
        // Amendments to Terms
        static let amendmentsToTerms = """
        UBU reserves the right to modify these Terms at any time. Users will be notified of any material changes via email or through the Platform. Continued use of the Services after such modifications constitutes acceptance of the revised Terms.
        """
        
        // Contact Information
        static let contactInformation = """
        For any questions or concerns regarding these Terms, please contact UBU at [Support Email Address].
        """
    }
    
    struct PrivacyPolicy {
        static let introduction = """
        At UBU Platforms, Inc. ("UBU"), your privacy is important to us. This Privacy Policy outlines how we collect, use, disclose, and protect your personal information when you use our website, mobile application, and services. Please read this policy carefully to understand how we handle your information. By using UBU's services, you agree to the terms of this Privacy Policy.
        """
        
        static let definitions = """
        Personal Information means any information that relates to an identified or identifiable individual, including but not limited to name, contact details, payment information, and preferences.
        Shopper refers to users of UBU's services who engage with the platform to shop for products and interact with influencers.
        Creator refers to individuals who create content and participate in UBU's influencer marketing ecosystem.
        """
        
        static let informationWeCollect = """
        UBU collects the following types of information:
        
        - Personal Information: Details such as your name, email address, physical address, phone number, and payment information.
        - Body Scanning Data: Includes images and measurements to provide personalized clothing recommendations.
        - Other Physical Attributes: Includes optional characteristics such as height, weight, body shape, hair color, eye color, and more.
        - Usage Data: Automatically collected information about interactions with our platform.
        - Cookies and Tracking Technologies: Collects browsing activities to personalize the user experience.
        """
        
        static let howWeUseYourInformation = """
        UBU uses your information for the following purposes:
        - To personalize and improve your shopping experience.
        - To process transactions and provide customer support.
        - To send marketing communications based on your preferences.
        - To comply with legal obligations and resolve disputes.
        - To improve services by analyzing user behavior.
        """
        
        static let howWeShareYourInformation = """
        We may share your personal information with:
        - Third-party service providers (e.g., payment processors, shipping partners).
        - Influencers and brands for personalized recommendations (with your consent).
        - Affiliate partners for performance tracking.
        - Legal authorities when required by law.
        UBU does not sell or rent your personal information to third parties for their marketing purposes without your consent.
        """
        
        static let internationalDataTransfers = """
        UBU ensures appropriate safeguards for transferring your personal information outside your country of residence. This includes using Standard Contractual Clauses or other legal mechanisms.
        """
        
        static let legalBasisForProcessing = """
        For jurisdictions requiring consent for data processing, UBU relies on:
        - Consent: Explicit user consent for processing personal information.
        - Legitimate Interests: To improve services unless overridden by user privacy rights.
        - Contractual Obligations: For payment processing or product delivery.
        - Compliance with Legal Obligations: To meet regulatory requirements.
        """
        
        static let yourRights = """
        Users have the following rights:
        - Access: Request a copy of the personal information we hold about you.
        - Correction: Request correction of inaccurate information.
        - Restriction: Request restriction of processing.
        - Data Portability: Receive data in a structured format.
        - Opt-out: Opt-out of marketing communications by contacting support@ubu.live.
        """
        
        static let security = """
        UBU implements encryption, secure servers, and access controls to protect your personal information. However, no transmission method is 100% secure.
        """
        
        static let retentionOfInformation = """
        Personal information is retained only as necessary to fulfill outlined purposes or as required by law. Body scanning data is retained only for personalized recommendations unless deleted upon request.
        """
        
        static let jobApplicantAndChildrenPrivacy = """
        - UBU does not knowingly collect personal information from children under 13.
        - Personal information from job applicants is handled with the same level of security and confidentiality.
        """
        
        static let cookiesAndTrackingTechnologies = """
        UBU uses cookies, web beacons, and tracking pixels to enhance the user experience, track behavior, and improve performance. You may opt-out of non-essential cookies through browser settings.
        """
        
        static let disputeResolution = """
        Contact UBU at support@ubu.live for any concerns or disputes regarding privacy. You may also contact your local data protection authority if unresolved.
        """
        
        static let changesToPolicy = """
        UBU may update this Privacy Policy. Changes will be reflected in the "Effective Date" at the top of the policy. Regular review of this policy is encouraged.
        """
        
        static let contactUs = """
        For any questions or concerns about this Privacy Policy, please contact:
        - Email: support@ubu.live
        - Corporate Address: 190 Country Club Dr., San Luis Obispo, CA 93401
        """
    }

    
}

// MARK: - States
extension Constants {
    static let usStates = [
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
    ]
    
    
    static let asianCountries = [
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


    static let europeanCountries = [
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

    static let africanCountries = [
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

    static let southAmericanCountries = [
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

    static let oceaniaCountries = [
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

    static let antarcticaTerritories = [
      "Antarctic Peninsula",
      "Ross Dependency (New Zealand)",
      "Australian Antarctic Territory",
      "British Antarctic Territory",
      "Chilean Antarctic Territory",
      "Argentine Antarctica",
      "Norwegian Antarctic Territory (Queen Maud Land)",
      "French Southern and Antarctic Lands"
    ];
    
    static let shoeSizeHeadings = [
        "Little Kids",
        "Big Kids"
    ];
}

