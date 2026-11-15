import SubscriptionList from "./SubscriptionList";

import SubscriptionProvider from "@src/components/Providers/SubscriptionsProvider";
import Header from "./Header";
import UBUBreadCrumb from "@src/components/UBUBreadCrumb/UBUBreadCrumb";
import { NavLink } from "react-router-dom";

const Subscriptions = () => {
  return (
    <SubscriptionProvider>
      <UBUBreadCrumb
        items={[{ title: "Dashboard" }, { title: "Subscriptions" }]}
      />
      <div className="tw-px-2 md:tw-px-4 lg:tw-px-8 tw-flex tw-gap-8 tw-flex-col ff-manrope">
        <Header />
        <div>
          <SubscriptionList />
          {/* <div className="tw-mt-5 tw-flex tw-items-center tw-justify-between tw-p-5 tw-rounded-lg tw-border-gray-light tw-bg-gray-lighter tw-max-w-[928px]">
          <Heading level={6} className="!tw-font-semibold">
            Looking for different configurations
          </Heading>
          <Button className="tw-font-medium" type="primary">
            Contact Sales
          </Button>
        </div> */}
        </div>
      </div>
    </SubscriptionProvider>
  );
};

export default Subscriptions;
