import LandingPageLayout from "../layouts/LandingPageLayout";
import { Flex } from "antd";
import FooterLayout from "../layouts/FooterLayout";
import GenericLayout from "../layouts/GenericLayout";
import "./termsOfService.less";
import { Text } from "@src/components";

const PrivatePolicy = () => {
  return (
    <LandingPageLayout>
      <FooterLayout>
        <Flex className="terms-service-container">
          <GenericLayout heading="Terms of Service">
            <Flex className="parent-wrapper" justify="center" align="center">
              <Flex className="section-wrapper" vertical>
                {/* Main Heading */}
                <Flex vertical>
                  <Text className="fs-24 fw-600">UBU Platforms Inc.</Text>
                  <Text className="fs-24 fw-600">
                    Standard Terms of Service
                  </Text>
                </Flex>
                {/* Introductino Section */}
                <Flex vertical gap={"2rem"}>
                  <Flex vertical>
                    <Text className="fs-20 fw-700" level={3}>
                      Introduction:
                    </Text>
                    <Text className="fs-18 fw-400">
                      Welcome to UBU Platforms Inc. (&quot;UBU&quot;). By
                      accessing, using, or registering for our services
                      (&quot;Services&quot;), you agree to these Terms of
                      Service (&quot;Terms&quot;), along with our Privacy
                      Policy, Cookie Policy, and Community Guidelines, which are
                      incorporated by reference. It is your responsibility to
                      review the most current versions of these documents
                      regularly.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Agreement Overiew:
                    </Text>
                    <Text className="fs-18 fw-400">
                      This End User License Agreement and Terms of Service
                      (&quot;Agreement&quot;) constitutes a legally binding
                      contract between you (&quot;User&quot;) and UBU. By
                      registering, visiting, accessing, downloading, or using
                      our Services, you accept and agree to be bound by the
                      terms and conditions of this Agreement. If you do not
                      agree to this Agreement, you must not register, visit,
                      access, download, or use our Services.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Effective Date and Termination:
                    </Text>
                    <Text className="fs-18 fw-400">
                      This Agreement is effective immediately upon your access
                      to the Services (the &quot;Effective Date&quot;) and will
                      remain in full force and effect until terminated. UBU
                      reserves the right to terminate or suspend your use of the
                      Services at its sole discretion, with or without cause or
                      notice, including if UBU believes that you have violated
                      or acted inconsistently with this Agreement. You may
                      terminate this Agreement at any time by closing your user
                      account and ceasing all use of the Services.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Modification to Terms:
                    </Text>
                    <Text className="fs-18 fw-400">
                      UBU reserves the right to modify this Agreement, the
                      Privacy Policy, Cookie Policy, and Community Guidelines at
                      any time. If you have registered as a user, UBU will
                      notify you of any material changes via email or through
                      the Services before such changes take effect. Your
                      continued use of the Services after the posting or
                      notification of changes constitutes your acceptance of the
                      modified terms.
                    </Text>
                  </Flex>
                </Flex>
                {/* Sercices Section */}
                <Flex vertical>
                  <Text className="fs-20 fw-700">2.Services Provided</Text>
                  <Text className="fs-18 fw-400">
                    UBU provides a platform that facilitates connections and
                    commercial relationships between brands
                    (&quot;Brands&quot;), content creators
                    (&quot;Creators&quot;), and consumers through digital
                    channels, including websites, mobile applications, and other
                    online services (collectively, &quot;Platform&quot;). Our
                    Services allow users to create, share, and monetize content
                    while interacting with third-party Brands and Creators.
                  </Text>
                </Flex>
                {/* Service Availability Section */}
                {/* Introductino Section */}
                <Flex vertical gap={"2rem"}>
                  <Text className="fs-20 fw-700" level={3}>
                    3.Service Availability and Termination
                  </Text>

                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Availability:
                    </Text>
                    <Text className="fs-18 fw-400">
                      UBU reserves the right to modify, suspend, or discontinue
                      any part of the Services at its discretion, without notice
                      or liability. UBU may terminate your access to the
                      Services if you violate these Terms or act in a manner
                      that is inconsistent with the platform&apos;s values and
                      policies.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Data Retention and Content:
                    </Text>
                    <Text className="fs-18 fw-400">
                      UBU does not guarantee the storage or retention of any
                      content you upload or create. Upon termination of your
                      account, UBU may delete any content you have provided to
                      the Platform without liability.{" "}
                    </Text>
                  </Flex>
                </Flex>
                {/* Registry & Security Section */}
                <Flex vertical gap={"2rem"}>
                  <Text className="fs-20 fw-700" level={3}>
                    4.Account Registration and Security
                  </Text>

                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Account Creation:
                    </Text>
                    <Text className="fs-18 fw-400">
                      To access certain features of the Platform, you must
                      create an account by providing accurate, current, and
                      complete information. You are responsible for maintaining
                      the confidentiality of your account credentials and for
                      all activities that occur under your account.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Security:
                    </Text>
                    <Text className="fs-18 fw-400">
                      You agree to notify UBU immediately of any unauthorized
                      use of your account. UBU is not liable for any loss or
                      damage arising from your failure to comply with this
                      obligation.
                    </Text>
                  </Flex>
                </Flex>
                {/* Prohibbet Content & Conduct Section */}
                <Flex vertical gap={"2rem"}>
                  <Text className="fs-20 fw-700" level={3}>
                    5.Prohibited Content and Conduct
                  </Text>

                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Prohibited Content:
                    </Text>
                    <Text className="fs-18 fw-400">
                      You are strictly prohibited from posting or sharing any
                      content that is offensive, obscene, pornographic,
                      defamatory, or otherwise violates any applicable laws or
                      the rights of third parties. UBU reserves the right to
                      remove any content that it deems, in its sole discretion,
                      to be in violation of these Terms.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Prohibited Conduct:
                    </Text>
                    <Text className="fs-18 fw-400">
                      You agree not to engage in any conduct that could harm
                      UBU, its users, or the integrity of the Platform. This
                      includes, but is not limited to, attempting to circumvent
                      security features, engaging in fraudulent activities, or
                      using automated systems to interact with the Platform.
                    </Text>
                  </Flex>
                </Flex>

                {/* Privacy & Compliance Section */}
                <Flex vertical gap={"2rem"}>
                  <Text className="fs-20 fw-700" level={3}>
                    6.Data Privacy and Compliance
                  </Text>

                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Data Processor Role:
                    </Text>
                    <Text className="fs-18 fw-400">
                      UBU acts as a data processor on behalf of the Brands and
                      Creators who use our Services. As a data processor, UBU
                      processes personal data only under the direction of the
                      data controllers (Brands and Creators).
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Compliance with CCPA and GDPR:
                    </Text>
                    <Text className="fs-18 fw-400">
                      UBU is committed to complying with the California Consumer
                      Privacy Act (CCPA) and the General Data Protection
                      Regulation (GDPR). Users have the right to access,
                      correct, and delete their personal data. UBU provides a
                      Data Processing Agreement (DPA) upon request.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Data Breach Notification:
                    </Text>
                    <Text className="fs-18 fw-400">
                      In the event of a data breach, UBU will notify affected
                      users in accordance with applicable data protection laws.
                    </Text>
                  </Flex>
                </Flex>

                {/* Content and Intellectual Property */}
                <Flex vertical gap={"2rem"}>
                  <Text className="fs-20 fw-700" level={3}>
                    7.Content and Intellectual Property
                  </Text>

                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      User Content:
                    </Text>
                    <Text className="fs-18 fw-400">
                      By uploading content to the Platform, you grant UBU a
                      non-exclusive, royalty-free, worldwide license to use,
                      reproduce, and display the content for the purpose of
                      operating and promoting the Platform.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Intellectual Property Rights:
                    </Text>
                    <Text className="fs-18 fw-400">
                      All intellectual property rights in the Platform,
                      including software, design, text, and graphics, are owned
                      by or licensed to UBU. You may not use any of UBU&apos;s
                      intellectual property without prior written permission.
                    </Text>
                  </Flex>
                </Flex>

                {/* Payment & Fees Section */}
                <Flex vertical gap={"2rem"}>
                  <Text className="fs-20 fw-700" level={3}>
                    8.Payments and Fees
                  </Text>

                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Service Fees:
                    </Text>
                    <Text className="fs-18 fw-400">
                      UBU may charge fees for the use of certain features on the
                      Platform. These fees will be disclosed to users before any
                      transaction is completed.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Payment Processing:
                    </Text>
                    <Text className="fs-18 fw-400">
                      Payments between Brands and Creators are facilitated
                      through third-party payment processors. UBU is not
                      responsible for any payment disputes between users.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Refund Policy:
                    </Text>
                    <Text className="fs-18 fw-400">
                      Refunds are subject to the terms agreed upon by the Brand
                      and Creator. UBU does not issue refunds for Services
                      unless explicitly stated otherwise.
                    </Text>
                  </Flex>
                </Flex>

                {/* Indemnification Section */}
                <Flex vertical>
                  <Text className="fs-20 fw-700">9.Indemnification</Text>
                  <Text className="fs-18 fw-400">
                    You agree to indemnify, defend, and hold harmless UBU, its
                    affiliates, and their respective officers, directors,
                    employees, and agents from any claims, liabilities, damages,
                    losses, or expenses arising out of your use of the Platform,
                    your breach of these Terms, or your violation of any rights
                    of a third party.
                  </Text>
                </Flex>

                {/* Limitation of Liability Section */}
                <Flex vertical>
                  <Text className="fs-20 fw-700">
                    10.Limitation of Liability
                  </Text>
                  <Text className="fs-18 fw-400">
                    UBU is not liable for any indirect, incidental, special,
                    consequential, or punitive damages arising out of or
                    relating to your use of the Platform. UBU&apos;s total
                    liability to you for any claim arising from your use of the
                    Platform shall not exceed the amount you paid, if any, to
                    UBU for access to and use of the Services
                  </Text>
                </Flex>

                {/* Dispute Resolution Section */}
                <Flex vertical gap={"2rem"}>
                  <Text className="fs-20 fw-700" level={3}>
                    11.Dispute Resolution
                  </Text>

                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Mediation:
                    </Text>
                    <Text className="fs-18 fw-400">
                      Any disputes arising out of or in connection with these
                      Terms shall be resolved through mediation in accordance
                      with the American Bar Association (ABA) mediation
                      standards.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Governing Law:
                    </Text>
                    <Text className="fs-18 fw-400">
                      These Terms shall be governed by and construed in
                      accordance with the laws of the State of Delaware.
                    </Text>
                  </Flex>
                  <Flex vertical>
                    <Text className="fs-18 fw-600" level={3}>
                      Jurisdiction:
                    </Text>
                    <Text className="fs-18 fw-400">
                      Any legal proceedings related to these Terms shall be
                      brought in the courts of California.
                    </Text>
                  </Flex>
                </Flex>

                {/* Force Majeure Section */}
                <Flex vertical>
                  <Text className="fs-20 fw-700">12.Force Majeure</Text>
                  <Text className="fs-18 fw-400">
                    UBU shall not be liable for any failure or delay in
                    performance under these Terms due to circumstances beyond
                    its reasonable control, including, but not limited to, acts
                    of God, natural disasters, war, labor disputes, or
                    governmental actions.
                  </Text>
                </Flex>

                {/* Amendments to Terms Section */}
                <Flex vertical>
                  <Text className="fs-20 fw-700">13.Amendments to Terms</Text>
                  <Text className="fs-18 fw-400">
                    UBU reserves the right to modify these Terms at any time.
                    Users will be notified of any material changes via email or
                    through the Platform. Continued use of the Services after
                    such modifications constitutes acceptance of the revised
                    Terms.
                  </Text>
                </Flex>

                {/* Contact Information Section */}
                <Flex vertical>
                  <Text className="fs-20 fw-700">14.Contact Information</Text>
                  <Text className="fs-18 fw-400">
                    For any questions or concerns regarding these Terms, please
                    contact UBU at [Support Email Address].
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </GenericLayout>
        </Flex>
      </FooterLayout>
    </LandingPageLayout>
  );
};

export default PrivatePolicy;
