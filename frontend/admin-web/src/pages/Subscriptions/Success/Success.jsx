import React, { useEffect } from "react";

import { Heading, Paragraph } from "@src/components/Common/Typography";
import { useRefreshTokenMutation } from "@src/store/api/authApi";
import { useSelector } from "react-redux";
import { getFormattedDate } from "@src/utils/helpers";
import { useGetInvoiceQuery } from "@src/store/api/subscriptionsApi";
import Invoice from "./Invoice/Invoice";
import InvoiceSkeleton from "./Invoice/InvoiceSkeleton";
import { Skeleton } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";

const Success = () => {
  const [refreshToken, refreshResult] = useRefreshTokenMutation();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const {
    user: { isSubscribed, subscriptionInfo },
  } = auth;

  const activeSubscription = subscriptionInfo?.[0] ?? {};

  const token = auth?.refreshToken;

  const { isLoading, invoice } = useGetInvoiceQuery(undefined, {
    selectFromResult: ({ isError, isFetching, isLoading, data }) => ({
      isLoading: isLoading || isFetching,
      error: isError,
      invoice: data?.data,
    }),
    skip: refreshResult.status !== "fulfilled",
  });

  const isLoadingDetails = isLoading || refreshResult.isLoading;

  useEffect(() => {
    if (token) {
      refreshToken(token);
    }
  }, [token, refreshToken]);

  useEffect(() => {
    if (refreshResult.status === "fulfilled" && !isSubscribed) {
      navigate("/dashboard/subscriptions", { replace: true });
    }
  }, [isSubscribed, refreshResult.status, navigate]);

  return (
    <div className="tw-flex tw-justify-center tw-flex-col tw-items-center tw-gap-12 tw-absolute tw-left-1/2 tw-top-1/2 -tw-translate-x-1/2 -tw-translate-y-1/2">
      <UBUBreadCrumb
        items={[
          { title: "Dashboard" },
          {
            title: (
              <NavLink to={"/dashboard/subscriptions"}>Subscriptions</NavLink>
            ),
          },
          { title: "Success" },
        ]}
      />
      <div className="tw-text-center">
        <Heading level={6} className="tw-text-black-heading tw-font-semibold">
          Plan Details
        </Heading>
        {isLoadingDetails ? (
          <Skeleton.Input active size="small" block />
        ) : (
          <Paragraph className="tw-text-black-light tw-italic tw-text-sm tw-font-normal">
            {getFormattedDate(activeSubscription?.created_at ?? "")}
          </Paragraph>
        )}
      </div>
      {isLoadingDetails ? (
        <InvoiceSkeleton />
      ) : (
        <Invoice
          hostedInvoiceUrl={invoice?.hosted_invoice_url}
          activeSubscription={activeSubscription}
          accountName={invoice?.account_name}
        />
      )}
    </div>
  );
};

export default Success;
