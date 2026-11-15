import WarningIconWithShadow from "@src/assets/icons/WarningIconWithShadow";
import { Heading } from "@src/components/Common/Typography";
import { Button } from "@src/components/Common/Widgets";
import CustomModal from "@src/components/Modals/CustomModal";
import {
  useGetCountriesQuery,
  useUpdateConnectedAccountMutation,
  useGetConnectedAccountDetailsQuery,
} from "@src/store/api/campaignPaymentApi";
import { useConnectedAccount } from "@src/components/Providers/ConnectedAccountProvider";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { Form, message, Skeleton } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { UBUInput, UBUSelect } from "@src/components";
import { useSelector } from "react-redux";
import { FALLBACK_ERROR_MESSAGE } from "@src/utils/constant";
import { useEffect, useState } from "react";
import axios from "axios";

const validationSchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  addressLine1: z.string().min(1, "Address is required"),
  phone: z
    .string()
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Phone number must be in a valid format (e.g., +14155552671)"
    ),
  postal_code: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^[a-zA-Z0-9\s-]{3,10}$/, "Postal code format is not valid"),
  state: z.string().min(1, "State is required"),
  ssn: z
    .string()
    .regex(/^\d{4}|\d{9}$/, "SSN must be the last 4 or all 9 digits"),
  bankRoutingNumber: z
    .string()
    .min(9, "Bank routing number must be 9 digits")
    .max(9, "Bank routing number must be 9 digits")
    .regex(/^\d{9}$/, "Bank routing number must be 9 digits"),
  bankAccountNumber: z
    .string()
    .min(5, "Bank account number is too short")
    .max(17, "Bank account number is too long")
    .regex(/^\d{5,17}$/, "Bank account number must contain only digits"),
});

const AccountDetailsModal = ({ isOpen, onCancel, onConfirm }) => {
  const { user } = useSelector((state) => state.auth || {});
  const [ipAddress, setIpAddress] = useState("");
  useEffect(() => {
    if (isOpen) {
      axios
        .get("https://api.ipify.org?format=json")
        .then((res) => setIpAddress(res.data.ip))
        .catch(() => setIpAddress("unknown"));
    }
  }, [isOpen]);

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

  const [updateConnectedAccount, { isLoading }] =
    useUpdateConnectedAccountMutation();
  const { onRefetch } = useConnectedAccount();
  const getPublicIP = async () => {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      return response.data.ip;
    } catch (error) {
      console.error("Failed to fetch IP:", error);
      return null;
    }
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
    defaultValues: {
      city: "",
      country: "",
      addressLine1: "",
      phone: "",
      postal_code: "",
      state: "",
      ssn: "",
      bankRoutingNumber: "",
      bankAccountNumber: "",
    },
    values: {
      country: defaultCountry?.value || "",
    },
  });

  const onSubmit = async (data) => {
    const ip = await getPublicIP();
    const payload = {
      city: data.city,
      country: data.country,
      addressLine1: data.addressLine1,
      phone: data.phone,
      postal_code: data.postal_code,
      state: data.state,
      ssn: data.ssn,
      bankRoutingNumber: data.bankRoutingNumber,
      bankAccountNumber: data.bankAccountNumber,
      ipAddress: ip,
    };
    try {
      const response = await updateConnectedAccount(payload).unwrap();
      const connectedAccountData = response?.data;
      if (
        connectedAccountData.message ==
        "Connected account updated successfully."
      ) {
        message.success(
          "Verification from stripe is in progress, your account status will be updated soon."
        );
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
            label="City"
            validateStatus={errors.city ? "error" : ""}
            help={errors.city?.message || ""}
          >
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <UBUInput
                  {...field}
                  placeholder="San Francisco"
                  status={errors.city ? "error" : ""}
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
                    placeholder="country"
                    status={errors.country ? "error" : ""}
                    options={countries}
                    disabled
                  />
                )}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Address Line 1"
            validateStatus={errors.addressLine1 ? "error" : ""}
            help={errors.addressLine1?.message || ""}
          >
            <Controller
              name="addressLine1"
              control={control}
              render={({ field }) => (
                <UBUInput
                  {...field}
                  placeholder="1234 Main Street"
                  status={errors.addressLine1 ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Phone"
            validateStatus={errors.phone ? "error" : ""}
            help={errors.phone?.message || ""}
          >
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <UBUInput
                  {...field}
                  placeholder="+14155552671"
                  status={errors.phone ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Postal Code"
            validateStatus={errors.postal_code ? "error" : ""}
            help={errors.postal_code?.message || ""}
          >
            <Controller
              name="postal_code"
              control={control}
              render={({ field }) => (
                <UBUInput
                  {...field}
                  placeholder="10001"
                  status={errors.postal_code ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="State"
            validateStatus={errors.state ? "error" : ""}
            help={errors.state?.message || ""}
          >
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <UBUInput
                  {...field}
                  placeholder="CA"
                  status={errors.state ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="SSN"
            validateStatus={errors.ssn ? "error" : ""}
            help={errors.ssn?.message || ""}
          >
            <Controller
              name="ssn"
              control={control}
              render={({ field }) => (
                <UBUInput
                  {...field}
                  placeholder="000000000"
                  status={errors.ssn ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Bank Routing Number"
            validateStatus={errors.bankRoutingNumber ? "error" : ""}
            help={errors.bankRoutingNumber?.message || ""}
          >
            <Controller
              name="bankRoutingNumber"
              control={control}
              render={({ field }) => (
                <UBUInput
                  {...field}
                  placeholder="110000000"
                  status={errors.bankRoutingNumber ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Bank Account Number"
            validateStatus={errors.bankAccountNumber ? "error" : ""}
            help={errors.bankAccountNumber?.message || ""}
          >
            <Controller
              name="bankAccountNumber"
              control={control}
              render={({ field }) => (
                <UBUInput
                  {...field}
                  placeholder="000123456789"
                  status={errors.bankAccountNumber ? "error" : ""}
                />
              )}
            />
          </Form.Item>
        </Form>
      </div>
    </CustomModal>
  );
};

AccountDetailsModal.propTypes = {
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default AccountDetailsModal;
