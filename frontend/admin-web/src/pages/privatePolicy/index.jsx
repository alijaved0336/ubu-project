import FooterLayout from "../layouts/FooterLayout";
import GenericLayout from "../layouts/GenericLayout";
import LandingPageLayout from "../layouts/LandingPageLayout";
import "./privatePolicy.less";

import { Flex } from "antd";
import { Text } from "@src/components";

const PrivatePolicy = () => {
  return (
    <LandingPageLayout>
      <FooterLayout>
        <Flex className="privacy-policy-container">
          <GenericLayout heading="Privacy Policy">
            <Flex className="parent-wrapper " justify="center" align="center">
              <Flex className="section-wrapper" vertical>
                <Flex vertical gap={"2rem"}>
                  <Flex vertical>
                    <Text className={"fs-24 fw-600"}>
                      UBU Platforms, Inc. Privacy Policy
                    </Text>
                    <Text className="fs-14 fw-600">
                      Effective Date: 9.1.2024
                    </Text>
                  </Flex>
                  <Text className="fs-19 fw-400 tw-leading-snug">
                    At UBU Platforms, Inc. (&quot;UBU&quot;), your privacy is
                    important to us. This Privacy Policy outlines how we
                    collect, use, disclose, and protect your personal
                    information when you use our website, mobile application,
                    and services. Please read this policy carefully to
                    understand how we handle your information. By using
                    UBU&apos;s services, you agree to the terms of this Privacy
                    Policy.
                  </Text>
                </Flex>
                {/* Start of Defination Section*/}
                <Flex vertical>
                  <Text className="fs-20 fw-700 tw-mb-2">1.Definitions</Text>
                  <Text className="fs-19 fw-400 tw-leading-snug">
                    <ul>
                      <li>
                        <Text className="fs-19 fw-400">
                          &quot;Personal Information&quot;
                        </Text>{" "}
                        <Text className="fs-19 fw-400 tw-leading-snug">
                          means any information that relates to an identified or
                          identifiable individual, including but not limited to
                          name, contact details, payment information, and
                          preferences.
                        </Text>
                      </li>
                      <li>
                        <Text className="fs-19 fw-400">
                          &quot;Shopper&quot;
                        </Text>
                        <Text className="fs-19 fw-400 tw-leading-snug">
                          {" "}
                          refers to users of UBU&apos;s services who engage with
                          the platform to shop for products and interact with
                          influencers.
                        </Text>
                      </li>
                      <li>
                        <Text className="fs-19 fw-400">
                          &quot;Creator&quot;
                        </Text>
                        <Text className="fs-19 fw-400 tw-leading-snug">
                          {" "}
                          refers to individuals who create content and
                          participate in UBU&apos;s influencer marketing
                          ecosystem.
                        </Text>
                      </li>
                    </ul>
                  </Text>
                </Flex>

                <Flex vertical gap={"2rem"}>
                  <Flex vertical>
                    <Text className="fs-20 fw-700 tw-mb-2">
                      {" "}
                      2.Information We Collect
                    </Text>
                    <Text className="fs-18 fw-400">
                      UBU collects the following types of information:
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600 tw-mb-1">Personal Information</Text>{" "}
                    <Text className="fs-19 fw-400 tw-leading-snug">
                      This includes details such as your name, email address,
                      physical address, phone number, and payment information
                      that you provide when creating an account, placing an
                      order, or interacting with our services.
                      &quot;Shopper&quot; refers to users of UBU&apos;s services
                      who engage with the platform to shop for products and
                      interact with influencers. &quot;Creator&quot; refers to
                      individuals who create content and participate in
                      UBU&apos;s influencer marketing ecosystem.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600 tw-mb-1">Body Scanning Data</Text>{" "}
                    <Text className="fs-19 fw-400 tw-leading-snug">
                      {" "}
                      We use advanced body scanning technology to enhance your
                      shopping experience. If you choose to participate in our
                      body scanning feature, we collect images and measurements
                      of your body to provide personalized clothing
                      recommendations. The specific data collected includes
                      front and side view images of your body, as well as
                      measurements such as height, weight, waist circumference,
                      and other physical attributes that you may choose to
                      provide. We take your privacy seriously and will only use
                      this information to enhance your shopping experience by
                      connecting you with influencers and brands that match your
                      body type and style preferences. This data will never be
                      shared with third parties without your explicit consent.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600 tw-mb-1">
                      Other Physical Attributes
                    </Text>{" "}
                    <Text className="fs-19 fw-400 tw-leading-snug">
                      If you opt out of the body scanning feature, you may
                      choose to provide physical characteristics such as height,
                      weight, body shape, hair color, eye color, and more.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600 tw-mb-1">Usage Data</Text>{" "}
                    <Text className="fs-19 fw-400 tw-leading-snug">
                      We automatically collect information about your
                      interactions with our platform, including IP addresses,
                      browser type, pages visited, and actions taken while using
                      our website or app.
                    </Text>
                  </Flex>

                  <Flex vertical>
                    <Text className="fs-18 fw-600 tw-mb-1">
                      Cookies and Tracking Technologies
                    </Text>{" "}
                    <Text className="fs-19 fw-400 tw-leading-snug">
                      UBU uses cookies, web beacons, and similar tracking
                      technologies to collect information about your browsing
                      activities on our platform. These help us improve user
                      experience and personalize content. You can manage your
                      cookie preferences through your browser settings or
                      opt-out of non-essential cookies.
                    </Text>
                  </Flex>
                </Flex>
                {/* Start of How to Use Yor Information */}
                <Flex vertical gap={"2rem"}>
                  <Flex vertical>
                    <Text className="fs-20 fw-700 tw-mb-2">
                      {" "}
                      3.How We Use Your Information
                    </Text>
                    <Text className={"fs-18 fw-400"}>
                      {" "}
                      UBU uses your information for the following purposes:
                    </Text>
                  </Flex>
                  <Text className="fs-19 fw-400 tw-leading-snug">
                    <ul>
                      <li>
                        To personalize and improve your shopping experience by
                        using body scanning data and preferences to recommend
                        products that best fit your style and physical
                        characteristics.
                      </li>
                      <li>
                        To process transactions, manage your account, and
                        provide customer support.
                      </li>
                      <li>
                        To send you marketing communications, promotional
                        offers, and product recommendations based on your
                        preferences.
                      </li>

                      <li>
                        To improve our services by analyzing usage trends and
                        user behavior on our platform.
                      </li>
                      <li>
                        To comply with legal obligations and resolve any
                        disputes that may arise.
                      </li>
                    </ul>
                  </Text>
                </Flex>
                {/* Start of How we share your information */}
                <Flex vertical gap={"2rem"}>
                  <Flex vertical>
                    <Text className="fs-20 fw-700 tw-mb-2" level={3}>
                      4.How We Share Your Information{" "}
                    </Text>
                    <Text className={"fs-18 fw-400"}>
                      We may share your personal information with:
                    </Text>
                  </Flex>

                  <Text className="fs-19 fw-400 tw-leading-snug">
                    <ul>
                      <li>
                        <Text className="fs-19 fw-600">
                          Third-party service providers
                        </Text>{" "}
                        who assist us in operating our website, mobile
                        application, or conducting our business (e.g., payment
                        processors, shipping partners), as long as those parties
                        agree to keep this information confidential.
                      </li>
                      <li>
                        <Text className="fs-19 fw-600">
                          Influencers and brands
                        </Text>{" "}
                        with whom you have chosen to interact on our platform.
                        For example, if you have opted into our body scanning
                        feature, we may share relevant details with influencers
                        or brands to facilitate personalized recommendations.
                      </li>
                      <li>
                        <Text className="fs-19 fw-600">Affiliate partners</Text>{" "}
                        to track performance-based marketing efforts.
                      </li>
                      <li>
                        <Text className="fs-19 fw-600">Legal authorities</Text>{" "}
                        when required by law, in response to legal processes, or
                        when necessary to protect our users and platform.
                      </li>
                    </ul>
                    We do not sell or rent your personal information to third
                    parties for their marketing purposes without your consent.
                  </Text>
                </Flex>
                {/* Start of International data transfer */}
                <Flex vertical>
                  <Text className="fs-20 fw-700 tw-mb-2">
                    5.International Data Transfers
                  </Text>
                  <Text className="fs-19 fw-400 tw-leading-snug">
                    If UBU transfers your personal information outside of your
                    country of residence, we ensure that appropriate safeguards
                    are in place to protect your data. This may include using
                    Standard Contractual Clauses or other legal mechanisms that
                    ensure your data is treated securely and in accordance with
                    this Privacy Policy.
                  </Text>
                </Flex>
                {/* Start of Legal basis for processing */}
                <Flex vertical gap={"2rem"}>
                  <Flex vertical>
                    <Text className="fs-20 fw-700 tw-mb-2">
                      6.Legal Basis for Processing
                    </Text>
                    <Text className="fs-18 fw-400 tw-leading-snug">
                      For users located in jurisdictions where consent is
                      required to process personal data (such as the European
                      Economic Area), we rely on the following legal bases:
                    </Text>
                  </Flex>
                  <Text className="fs-19 fw-400 tw-leading-snug">
                    <ul>
                      <li>
                        <Text className={"fs-19 fw-600"}>Consent:</Text> We
                        process your personal information when you have given us
                        explicit consent to do so.
                      </li>
                      <li>
                        <Text className={"fs-19 fw-600"}>
                          Legitimate Interests:
                        </Text>{" "}
                        We process your information for legitimate business
                        interests, such as improving our services, unless your
                        privacy rights override these interests.
                      </li>
                      <li>
                        <Text className={"fs-19 fw-600"}>
                          Contractual Obligations:
                        </Text>{" "}
                        We use your information to fulfill contractual
                        obligations, such as processing payments or delivering
                        products.
                      </li>
                      <li>
                        <Text className={"fs-19 fw-600"}>
                          Compliance with Legal Obligations:{" "}
                        </Text>
                        We process data to comply with laws and regulations that
                        apply to us.
                      </li>
                    </ul>
                  </Text>
                </Flex>

                {/* Start of Your rights Section */}
                <Flex vertical gap={"2rem"}>
                  <Flex vertical>
                    <Text className="fs-20 fw-700 tw-mb-2"> 7.Your Rights</Text>
                    <Text className="fs-18 fw-400">
                      {" "}
                      You have the following rights regarding your personal
                      information:
                    </Text>
                  </Flex>
                  <Text className="fs-19 fw-400 tw-leading-snug">
                    <ul>
                      <li>
                        <Text className={"fs-19 fw-600"}>Access: </Text>
                        You may request a copy of the personal information we
                        hold about you.
                      </li>
                      <li>
                        <Text className={"fs-19 fw-600"}>Correction: </Text>
                        You may request correction of inaccurate information.
                      </li>
                      <li>
                        <Text className={"fs-19 fw-600"}>Deletion: </Text>
                        You may request that we delete your personal
                        information.
                      </li>
                      <li>
                        <Text className={"fs-19 fw-600"}>Restriction: </Text>
                        You may request that we restrict the processing of your
                        personal information.
                      </li>
                      <li>
                        <Text className={"fs-19 fw-600"}>
                          Data Portability:{" "}
                        </Text>
                        You may request to receive your personal data in a
                        structured, commonly used, and machine-readable format.
                      </li>
                      <li>
                        <Text className={"fs-19 fw-600"}>Opt-out: </Text>
                        You may opt-out of marketing communications by following
                        the instructions in those emails or by contacting
                        support@ubu.live.
                      </li>
                    </ul>
                  </Text>
                </Flex>
                {/* Start of Security section */}
                <Flex vertical>
                  <Text className="fs-20 fw-700 tw-mb-2">8.Security</Text>
                  <Text className="fs-18 fw-400 tw-leading-snug">
                    We implement technical and organizational measures to
                    protect your personal information from unauthorized access,
                    alteration, or destruction. These measures include
                    encryption, secure servers, and access controls. While we
                    strive to protect your data, no method of transmission over
                    the internet or electronic storage is 100% secure.
                  </Text>
                </Flex>
                {/* Start of Retention of information section */}
                <Flex vertical>
                  <Text className="fs-20 fw-700 tw-mb-2">
                    {" "}
                    9.Retention of Information
                  </Text>
                  <Text className="fs-18 fw-400 tw-leading-snug">
                    We retain your personal information only for as long as
                    necessary to fulfill the purposes outlined in this Privacy
                    Policy, or as required by law. This includes retaining body
                    scanning data only as long as necessary for personalized
                    recommendations unless you request its deletion.
                  </Text>
                </Flex>
                {/* Start of Job applicant section */}
                <Flex vertical>
                  <Text className="fs-20 fw-700 tw-mb-2">
                    {" "}
                    10.Job Applicant and Children&apos;s Privacy
                  </Text>
                  <Text className="fs-18 fw-400 tw-leading-snug">
                    UBU does not knowingly collect personal information from
                    children under the age of 13. If we learn that we have
                    collected personal information from a child under 13, we
                    will delete such information. We also collect personal
                    information from job applicants during the recruitment
                    process, which is handled with the same level of security
                    and confidentiality.
                  </Text>
                </Flex>
                {/* Start of cookie and tracking section */}
                <Flex vertical>
                  <Text className="fs-20 fw-700 tw-mb-2">
                    {" "}
                    11.Cookies and Tracking Technologies
                  </Text>
                  <Text className="fs-18 fw-400 tw-leading-snug">
                    UBU uses cookies and tracking technologies such as web
                    beacons and pixels to collect information about your
                    interactions with our platform. Cookies help us track user
                    behavior, improve performance, and personalize the
                    experience. You may opt out of non-essential cookies through
                    your browser settings or cookie preferences.
                  </Text>
                </Flex>
                {/* Start of dispute resolution section */}
                <Flex vertical>
                  <Text className="fs-20 fw-700 tw-mb-2">
                    {" "}
                    12.Dispute Resolution
                  </Text>
                  <Text className="fs-18 fw-400 tw-leading-snug">
                    If you have any concerns or disputes regarding our privacy
                    practices, please contact us at support@ubu.live. We will do
                    our best to address and resolve the issue. If necessary, you
                    may also contact your local data protection authority to
                    lodge a complaint.
                  </Text>
                </Flex>
                {/* Start of changes to policy section */}
                <Flex vertical>
                  <Text className="fs-20 fw-700 tw-mb-2">
                    {" "}
                    13.Changes to This Policy
                  </Text>
                  <Text className="fs-18 fw-400 tw-leading-snug">
                    UBU may update this Privacy Policy from time to time. We
                    will notify you of any changes by updating the
                    &quot;Effective Date&quot; at the top of this policy. We
                    encourage you to review this policy regularly to stay
                    informed about how we are protecting your information.
                  </Text>
                </Flex>

                {/* Start of changes to policy section */}
                <Flex vertical>
                  <Text className="fs-20 fw-700 tw-mb-2"> 14.Contact Us</Text>
                  <Text className="fs-18 fw-400 tw-leading-snug">
                    If you have any questions or concerns about this Privacy
                    Policy, please contact us:
                    <br></br>
                    <Text className="fs-18 fw-800">Email: </Text>
                    support@ubu.live
                    <br></br>
                    <Text className="fs-18 fw-800">Corporate Address: </Text>135
                    Country Side, San Luis LA, CA 93367
                  </Text>
                </Flex>
                {/* Add more sections here following the same structure */}

                {/* <Divider /> */}
              </Flex>
            </Flex>
          </GenericLayout>
        </Flex>
      </FooterLayout>
    </LandingPageLayout>
  );
};

export default PrivatePolicy;
