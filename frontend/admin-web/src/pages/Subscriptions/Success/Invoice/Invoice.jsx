import React from "react";
import { UBUIcon } from "@src/assets/icons";
import { Heading, Paragraph } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import { capitalize, getFormattedDate, getPrice } from "@src/utils/helpers";
import PropTypes from "prop-types";

const Invoice = ({ activeSubscription, hostedInvoiceUrl, accountName }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = hostedInvoiceUrl;
    link.target = "_blank";

    link.click();
  };

  return (
    <>
      <div className="tw-ticket-edge tw-min-w-[20.375rem] tw-min-h-[315px] tw-rounded-xl tw-border tw-shadow-card tw-p-2 tw-flex tw-flex-col tw-justify-between">
        <div className="tw-bg-black tw-w-12 tw-h-12 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-absolute tw-top-0 tw-left-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2">
          <UBUIcon width="40" height="20" />
        </div>
        <div className="tw-mt-6 tw-flex tw-flex-col tw-gap-2 tw-text-center tw-items-center">
          <Heading className="tw-text-orange tw-font-semibold" level={3}>
            {getPrice({
              amount: activeSubscription?.price ?? "",
              isStripePrice: true,
            })}
          </Heading>
          <Paragraph className="tw-text-sm tw-text-black-heading tw-font-medium">
            {accountName}
          </Paragraph>
          <Paragraph className="tw-text-sm tw-text-gray-medium tw-font-medium tw-bg-gray-light tw-rounded-2xl tw-py-1 tw-px-2">
            {capitalize(activeSubscription?.plan_type) ?? ""} Plan
          </Paragraph>
        </div>

        <div className="tw-border-t tw-border-dashed tw-absolute tw-top-1/2  tw-w-full" />

        <ul className="tw-space-y-3 tw-px-5 tw-pb-5">
          <li className="tw-flex tw-justify-between tw-items-center">
            <Paragraph className="tw-text-sm tw-text-black-light tw-italic tw-font-normal">
              Interval:
            </Paragraph>
            <Paragraph className="tw-text-sm tw-text-black-heading tw-font-medium">
              {capitalize(activeSubscription?.interval ?? "")}
            </Paragraph>
          </li>
          <li className="tw-flex tw-justify-between tw-items-center">
            <Paragraph className="tw-text-sm tw-text-black-light tw-italic tw-font-normal">
              Start Date:
            </Paragraph>
            <Paragraph className="tw-text-sm tw-text-black-heading tw-font-medium">
              {getFormattedDate(activeSubscription?.subs_start_date ?? "")}
            </Paragraph>
          </li>

          <li className="tw-flex tw-justify-between tw-items-center">
            <Paragraph className="tw-text-sm tw-text-black-light tw-italic tw-font-normal">
              End Date:
            </Paragraph>
            <Paragraph className="tw-text-sm tw-text-black-heading tw-font-medium">
              {getFormattedDate(activeSubscription?.subs_end_date ?? "")}
            </Paragraph>
          </li>
        </ul>
      </div>
      <div>
        <Button onClick={handleDownload}> Get Invoice </Button>
      </div>
    </>
  );
};

Invoice.propTypes = {
  activeSubscription: PropTypes.object,
  hostedInvoiceUrl: PropTypes.string,
  accountName: PropTypes.string,
};

export default Invoice;
