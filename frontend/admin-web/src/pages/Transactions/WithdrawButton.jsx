import React, { useMemo, useState } from "react";
import { Button, Input, Modal, message } from "antd";
import { useCreateWithdrawalMutation } from "@src/store/api/withdrawableAmountApi";
import { useGetUserQuery } from "@src/store/api/userApi";
import { getTotalWithdrawnAmount } from "@src/utils/commonFunctions";
import PropTypes from "prop-types";

const WithdrawButton = ({
  withdrawalsTransactions = [],
  amazonAffiliateTransactions = [],
  campaignTransactionsSummary = {},
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [createWithdrawal, { isLoading: isWithdrawing }] =
    useCreateWithdrawalMutation();

  const { user } = useGetUserQuery(undefined, {
    selectFromResult: ({ data, isLoading, isFetching }) => ({
      user: data ?? {},
      isLoading: isLoading || isFetching,
    }),
  });

  const totalAmazonRevenue = useMemo(() => {
    return amazonAffiliateTransactions.reduce((sum, txn) => {
      return sum + parseFloat(txn?.revenue || 0);
    }, 0);
  }, [amazonAffiliateTransactions]);

  const totalWithdrawn = useMemo(() => {
    return getTotalWithdrawnAmount(withdrawalsTransactions);
  }, [withdrawalsTransactions]);

  const totalTransferred =
    (campaignTransactionsSummary?.totalTransferredFunds || 0) / 100;

  const availableAmount = useMemo(() => {
    return Math.max(totalTransferred + totalAmazonRevenue - totalWithdrawn, 0);
  }, [totalTransferred, totalAmazonRevenue, totalWithdrawn]);

  const amountNumber = parseFloat(amount);

  const handleWithdraw = async () => {
    if (amountNumber < 10) {
      message.error("Minimum withdraw amount is $10.");
      return;
    }

    if (amountNumber > availableAmount) {
      message.error("You cannot withdraw more than the available balance.");
      return;
    }

    try {
      await createWithdrawal({
        amount: amountNumber,
        influencer_id: user?.influencer?.id,
      }).unwrap();

      message.success("Withdrawal request submitted successfully.");
      setIsModalOpen(false);
      setAmount("");
    } catch (err) {
      message.error(err?.data?.message || "Withdrawal failed.");
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Withdraw
      </Button>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title="Withdraw Funds"
      >
        <div className="tw-space-y-4">
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="tw-text-sm tw-text-gray-500">
            Available: ${availableAmount.toFixed(2)}
          </div>
          <div className="tw-flex tw-justify-end tw-gap-2">
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleWithdraw}
              loading={isWithdrawing}
              disabled={!amount || isNaN(amountNumber)}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

WithdrawButton.propTypes = {
  withdrawalsTransactions: PropTypes.array,
  amazonAffiliateTransactions: PropTypes.array,
  campaignTransactionsSummary: PropTypes.object,
};

export default WithdrawButton;
