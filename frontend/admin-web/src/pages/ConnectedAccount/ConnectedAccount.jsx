import { Heading } from "@src/components/Common/Typography";
import AccountDetails from "@src/components/ConnectedAccount/AccountDetails";

import ConnectedAccountProvider from "@src/components/Providers/ConnectedAccountProvider";

const ConnectedAccount = () => {
  return (
    <ConnectedAccountProvider>
      <Heading level={3}>Connected Account</Heading>
      <AccountDetails />
    </ConnectedAccountProvider>
  );
};

export default ConnectedAccount;
