import cn from "@src/cn";
import PropTypes from "prop-types";

const Status = ({ text = "", className }) => {
  const formattedText = text?.replace("-", " ");

  const redStatuses = {
    rejected: "tw-bg-[#a51a1a33] tw-text-[#A51A1A]",
    disputed: "tw-bg-[#bf202033] tw-text-[#BF2020]",
    "in-active": "tw-bg-[#e0666633] tw-text-[#E06666]",
    "in-complete": "tw-bg-[#f28e8e33] tw-text-[#F28E8E]",
    cancelled: "tw-bg-[#a51a1a33] tw-text-[#A51A1A]",
  };

  const greenStatuses = {
    completed: "tw-bg-[#2fa35b33] tw-text-[#2FA35B]",
    submitted: "tw-bg-[#47d48133] tw-text-[#47D481]",
    accepted: "tw-bg-[#35b86a33] tw-text-[#35B86A]",
    done: "tw-bg-[#5ad68933] tw-text-[#5AD689]",
    succeeded: "tw-bg-[#28a15c33] tw-text-[#28A15C]",
    resolved: "tw-bg-[#28a15c33] tw-text-[#28A15C]",
    transferred: "tw-bg-[#28a15c33] tw-text-[#28A15C]",
    "funds-transferred": "tw-bg-[#28a15c33] tw-text-[#28A15C]",
    refunded: "tw-bg-[#28a15c33] tw-text-[#28A15C]",
    verified: "tw-bg-[#3abf6d33] tw-text-[#3ABF6D]",
  };

  const yellowStatuses = {
    pending: "tw-bg-[#FFF8E3] tw-text-[#D4A531]",
    publishing: "tw-bg-[#FFF4D4] tw-text-[#C89B23]",
    "in-progress": "tw-bg-[#FFEDC1] tw-text-[#A9791B]",
    "contract-signing": "tw-bg-[#FFF2C9] tw-text-[#B58C24]",
    "payment-held": "tw-bg-[#FFF2C9] tw-text-[#BC9021]",
    "refund-requested": "tw-bg-[#FFEDC1] tw-text-[#A9791B]",
  };

  const statuses = {
    ...redStatuses,
    ...greenStatuses,
    ...yellowStatuses,
  };

  return (
    <div
      className={cn(
        "tw-flex tw-justify-center tw-items-center tw-py-2 tw-px-5 tw-rounded-3xl tw-capitalize tw-w-fit",
        statuses[text],
        className
      )}
    >
      {formattedText}
    </div>
  );
};

Status.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
};
export default Status;
