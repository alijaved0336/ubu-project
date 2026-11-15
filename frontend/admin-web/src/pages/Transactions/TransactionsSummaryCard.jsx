import { Heading, Paragraph } from "@src/components/Common/Typography";
import PropTypes from "prop-types";
import React, { memo } from "react";

const TransactionsSummaryCard = ({ status, amount }) => {
  return (
    <div className="tw-space-y-3  tw-text-center">
      <Paragraph className="tw-text-sm tw-font-semibold tw-text-gray-menu">
        {status}
      </Paragraph>
      <Heading level={4} className="tw-font-semibold">
        {amount}
      </Heading>
    </div>
  );
};

TransactionsSummaryCard.propTypes = {
  status: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default memo(TransactionsSummaryCard);
