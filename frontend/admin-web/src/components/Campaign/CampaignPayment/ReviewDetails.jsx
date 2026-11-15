import { Paragraph } from "@src/components/Common/Typography";
import { STRIPE_FLAT_FEE, STRIPE_PERCENTAGE } from "@src/utils/constant";
import { formattedAmount } from "@src/utils/helpers";
import PropTypes from "prop-types";

const ReviewDetails = ({ netAmount, stripeFee, totalAmount }) => {
  const ubuPercentage = (netAmount * 20) / 100;
  const influencerAmount = netAmount - ubuPercentage;

  return (
    <div className="tw-p-6 tw-w-full tw-space-y-6">
      <Paragraph className="tw-text-sm tw-text-gray-700">
        You are about to make a payment for your transaction.
      </Paragraph>

      {/* PLATFORM FEES SECTION */}
      <div className="tw-border tw-border-gray-200 tw-rounded-lg tw-p-4 tw-space-y-3">
        <h3 className="tw-font-semibold tw-text-gray-800 tw-text-sm">
          Platform Fees
        </h3>
        <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700">
          <span className="tw-font-medium">Campaign Amount:</span>
          <span>{formattedAmount(netAmount)}</span>
        </div>
        <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700">
          <span className="tw-font-medium">
            UBU Platform Fee (20% of Campaign Amount):
          </span>
          <span>{formattedAmount(ubuPercentage)}</span>
        </div>
        <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700">
          <span className="tw-font-medium">
            Amount to Influencer (80% of Campaign Amount):
          </span>
          <span>{formattedAmount(influencerAmount)}</span>
        </div>
      </div>

      {/* STRIPE FEES SECTION */}
      <div className="tw-border tw-border-gray-200 tw-rounded-lg tw-p-4 tw-space-y-3">
        <h3 className="tw-font-semibold tw-text-gray-800 tw-text-sm">
          Stripe Processing Fees
        </h3>

        <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700">
          <span className="tw-font-medium">
            Adjusted Amount (to cover fees):
          </span>
          <span>{formattedAmount(totalAmount)}</span>
        </div>

        <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700">
          <span className="tw-font-medium">
            Stripe Processing Fee ({STRIPE_PERCENTAGE}%) of Adjusted Amount:
          </span>
          <span>{formattedAmount(stripeFee)}</span>
        </div>
        <div className="tw-flex tw-justify-between tw-text-sm tw-text-gray-700">
          <span className="tw-font-medium">Stripe Flat Fee:</span>
          <span>{formattedAmount(STRIPE_FLAT_FEE / 100)}</span>
        </div>
      </div>

      {/* TOTAL AMOUNT SECTION */}
      <div className="tw-border tw-border-gray-200 tw-rounded-lg tw-p-4 tw-bg-gray-100">
        <div className="tw-flex tw-justify-between tw-text-base tw-font-semibold tw-text-gray-900">
          <span>Total Amount to be Charged:</span>
          <span>{formattedAmount(totalAmount)}</span>
        </div>
      </div>

      <Paragraph className="tw-text-gray-500 tw-text-sm">
        This total includes Stripe&apos;s processing fee of {STRIPE_PERCENTAGE}%
        + ${STRIPE_FLAT_FEE / 100}. Click &quot;Confirm and Proceed&quot; to
        enter your payment details on the next screen.
      </Paragraph>
    </div>
  );
};

ReviewDetails.propTypes = {
  netAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  stripeFee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  totalAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ReviewDetails;
