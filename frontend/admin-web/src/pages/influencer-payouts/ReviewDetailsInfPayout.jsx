import { Paragraph } from "@src/components/Common/Typography";
import UBUSelect from "@src/components/Select/Select";
import { formatMonthYear } from "@src/utils/formateData";
import { formattedAmount } from "@src/utils/helpers";
import { Flex, Select } from "antd";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";

const ReviewDetailsInfPayout = ({
  totalAmount,
  monthRecords,
  setPayoutMonth,
  setTotalAmount,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(null);

  const options = useMemo(() => {
    return monthRecords?.map((option) => ({
      label: option?.month_year,
      value: option?.month_year,
    }));
  }, [monthRecords]);

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    setPayoutMonth(value);
    setTotalAmount(
      monthRecords?.find((e) => e?.month_year === value)?.total_ad_fees
    );
  };

  return (
    <div className="tw-p-6 tw-w-full tw-space-y-6">
      <Paragraph className="tw-text-sm tw-text-gray-700">
        You are about to make a payment for your transaction.
      </Paragraph>

      <div className="tw-border tw-border-gray-200 tw-rounded-lg tw-p-4 tw-space-y-3">
        <h3 className="tw-flex tw-justify-center tw-font-semibold tw-text-gray-800 tw-text-sm">
          Select Month
        </h3>

        <UBUSelect
          placeholder={"Select Month"}
          value={selectedMonth || undefined}
          onChange={handleMonthChange}
          className="tw-h-10 tw-w-full"
          options={options}
        />

        <div className="tw-border tw-border-gray-200 tw-rounded-lg tw-p-4 tw-bg-gray-100">
          <div className="tw-flex tw-justify-between tw-text-base tw-font-semibold tw-text-gray-900">
            <span>Total Amount to be Charged:</span>
            <span>{formattedAmount(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

ReviewDetailsInfPayout.propTypes = {
  monthRecords: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ReviewDetailsInfPayout;
