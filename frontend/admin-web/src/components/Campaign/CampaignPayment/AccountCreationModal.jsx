import WarningIconWithShadow from "@src/assets/icons/WarningIconWithShadow";
import { Heading } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import CustomModal from "@src/components/Modals/CustomModal";
import {
  useCreateConnectedAccountMutation,
  useGetCountriesQuery,
} from "@src/store/api/campaignPaymentApi";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { Form, message, Skeleton } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { UBUInput, UBUSelect } from "@src/components";
import { useSelector } from "react-redux";
import { FALLBACK_ERROR_MESSAGE } from "@src/utils/constant";
import { useConnectedAccount } from "@src/components/Providers/ConnectedAccountProvider";
// Zod validation schema
const validationSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  country: z.string().min(1, "Please select a country"),
});

const AccountCreationModal = ({ isOpen, onCancel, onConfirm }) => {
  const { user } = useSelector((state) => state.auth || {});

  const { isLoadingCountries, defaultCountry, countries } =
    useGetCountriesQuery(undefined, {
      selectFromResult: ({ isError, isFetching, isLoading, data }) => ({
        isLoadingCountries: isLoading || isFetching,
        error: isError,
        countries: data?.countries,
        defaultCountry: data?.defaultCountry,
      }),
      refetchOnMountOrArgChange: true,
    });

  const [createConnectedAccount, { isLoading }] =
    useCreateConnectedAccountMutation();
  const { onRefetch } = useConnectedAccount();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: "",
      country: "",
    },
    values: {
      email: user?.email || "",
      country: defaultCountry?.value || "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      email: data?.email,
      country: data?.country,
      returnUrl: import.meta.env.VITE_FRONTEND_CONNECTED_ACCOUNT_RETURN_URL,
      refreshUrl: import.meta.env.VITE_FRONTEND_CONNECTED_ACCOUNT_REFRESH_URL,
    };

    try {
      const response = await createConnectedAccount(payload).unwrap();
      const connectedAccountData = response?.data;
      if (
        connectedAccountData.message ==
        "Connected account created successfully."
      ) {
        onRefetch();
      }
      onConfirm && onConfirm();
    } catch (error) {
      console.log(error.message);
      message.error(error?.message || FALLBACK_ERROR_MESSAGE);
    }
  };

  return (
    <CustomModal
      title={null}
      width="536px"
      isOpen={isOpen}
      className="!tw-h-auto"
      onCancel={onCancel}
      centered
      bodyWrapperClassName="tw-p-4"
      footer={
        <div className="tw-flex tw-items-center tw-gap-3 tw-justify-center">
          <Button
            className="tw-w-full"
            type="secondary"
            variant="outlined"
            onClick={onCancel}
          >
            Skip for now
          </Button>
          <Button
            className="tw-w-full"
            onClick={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoadingCountries}
          >
            Proceed
          </Button>
        </div>
      }
    >
      <div className="tw-space-y-6 tw-font-manrope">
        <div className="tw-space-y-6 tw-text-center">
          <WarningIconWithShadow
            width="54"
            height="54"
            className="tw-mx-auto"
          />
          <Heading level={5} className="tw-font-bold">
            Please provide your bank account details to receive payments for
            your collaborations and affiliate earnings.
          </Heading>
        </div>

        <Form layout="vertical">
          <Form.Item
            label="Email"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message || ""}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <UBUInput
                  {...field}
                  placeholder="Enter your email"
                  status={errors.email ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Country"
            validateStatus={errors.country ? "error" : ""}
            help={errors.country?.message || ""}
          >
            {isLoadingCountries ? (
              <Skeleton.Input
                active
                size="large"
                style={{ width: "100%" }}
                block
              />
            ) : (
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <UBUSelect
                    {...field}
                    placeholder="Select country"
                    status={errors.country ? "error" : ""}
                    options={countries}
                    disabled
                  />
                )}
              />
            )}
          </Form.Item>
        </Form>
      </div>
    </CustomModal>
  );
};

AccountCreationModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default AccountCreationModal;
