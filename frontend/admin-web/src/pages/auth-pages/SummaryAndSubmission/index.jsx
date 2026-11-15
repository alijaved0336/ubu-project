import React from "react";
import { Flex, Typography, Input } from "antd";
import "./summary.less";
const { Text } = Typography;

const SummaryComponent = () => {
  return (
    <Flex className="summary-main">
      <Text className="title">Summary and Submission</Text>
      <Text className="title-2">
        Thank you for joining the UBU Platform and completing your onboarding
        questionnaire!
      </Text>
      <Text className="desc">
        We are thrilled to have you as part of our diverse and vibrant community
        of creators. At UBU, we believe in the power of individuality and
        diversity, and we value the unique perspective you bring to our
        platform. Your responses will help us connect you with brands that
        resonate with your style, values, and audience
      </Text>
      <Text className="title-2">What Happens Next?</Text>
      <Text className="desc">
        <span className="title-2">Campaign Matches:</span> When your profile
        aligns with a brand’s campaign requirements, you will be notified via
        email and within our communications module on the platform. This ensures
        you’re always in the loop about potential opportunities.
      </Text>{" "}
      <Text className="desc">
        <span className="title-2">Qualified Match Notifications:</span> Even if
        you aren’t selected for a specific campaign, but your profile matches a
        significant percentage of the brand’s search parameters, we’ll notify
        you. In these cases, you’ll have the opportunity to reach out directly
        to the brand and offer your services, knowing you’re a strong contender
        for their campaign.
      </Text>
      <Text className="title-2">
        We appreciate your dedication to your craft and look forward to seeing
        you thrive on the UBU Platform. If you have any questions or need
        further assistance, please don’t hesitate to contact our support team.
      </Text>
    </Flex>
  );
};

export default SummaryComponent;
