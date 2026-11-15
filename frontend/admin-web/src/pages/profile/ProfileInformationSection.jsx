import React from "react";
import styles from "./ProfilePage.module.css";

import { Col, Form, Grid, Input, Row, Skeleton } from "antd";
import { useProfile } from "@src/components/Providers/ProfileProvider/ProfileProvider";

const FormItemWrapper = ({ children, label, error, loading }) => (
  <Form.Item label={label} colon={!!label}>
    {loading ? <Skeleton.Button block active size="small" /> : children}
    {!loading && error && (
      <span className="tw-text-red-500">{error.message}</span>
    )}
  </Form.Item>
);

const FormInput = ({
  label,
  addonBefore,
  addonAfter,
  type = "text",
  name,
  register,
  watch,
  setValue,
  error,
  loading,
  disabled = false,
}) => (
  <FormItemWrapper label={label} error={error} loading={loading}>
    <Input
      addonBefore={addonBefore}
      addonAfter={addonAfter}
      type={type}
      disabled={disabled}
      {...register(name)}
      value={type === "number" ? Number(watch(name)) : watch(name)}
      onChange={(e) =>
        setValue(
          name,
          type === "number" ? Number(e.target.value) : e.target.value
        )
      }
    />
  </FormItemWrapper>
);

const ProfileInformationSection = () => {
  const {
    handleSubmit,
    onSubmit,
    loading,
    register,
    watch,
    setValue,
    errors,
    user,
    isInfluencerProfileLoading,
    influencerProfile,
  } = useProfile();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  return (
    <Form
      onSubmitCapture={handleSubmit(onSubmit)}
      layout="vertical"
      className={styles.form}
    >
      <Row gutter={12}>
        {[
          { name: "first_name", label: "First Name" },
          { name: "last_name", label: "Last Name" },
          user?.is_influencer && { name: "address", label: "Address" },
          user?.is_influencer && {
            name: "phone_number",
            label: "Phone Number",
            type: "text",
          },
          user?.is_influencer && {
            name: "weight",
            label: "Weight",
            type: "number",
            addonBefore: "lbs",
          },
          user?.is_influencer && {
            name: "waist_girth",
            label: "Waist",
            type: "number",
            addonBefore: "cm",
          },
          user?.is_influencer && { name: "age", label: "Age", type: "number" },
        ]
          .filter(Boolean)
          .map((field) => (
            <Col key={field.name} span={screens.xs ? 24 : 12}>
              <FormInput
                {...field}
                register={register}
                watch={watch}
                setValue={setValue}
                error={errors[field.name]}
                loading={loading || isInfluencerProfileLoading}
              />
            </Col>
          ))}

        {/* Height Fields: ft & in */}
        {user?.is_influencer && (
          <Col span={screens.xs ? 24 : 12}>
            <Row gutter={12}>
              <Col span={12}>
                <FormInput
                  name="height_ft"
                  label="Height"
                  type="number"
                  addonBefore="ft"
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  error={errors.height_ft}
                  loading={loading || isInfluencerProfileLoading}
                />
              </Col>
              <Col span={12}>
                <FormInput
                  name="height_in"
                  label="Height"
                  type="number"
                  addonBefore="in"
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  error={errors.height_in}
                  loading={loading || isInfluencerProfileLoading}
                />
              </Col>
            </Row>
          </Col>
        )}

        {/* Email, Type, Gender (Read-only) */}
        <Col span={screens.xs ? 24 : 12}>
          <FormInput
            label="Email"
            name="email"
            register={register}
            watch={() => user?.email}
            setValue={() => {}}
            error={errors.email}
            loading={loading || isInfluencerProfileLoading}
            disabled
          />
        </Col>
        <Col span={screens.xs ? 24 : 12}>
          <FormInput
            label="Type"
            name="type"
            register={register}
            watch={() => (user?.is_brand ? "Brand" : "Influencer")}
            setValue={() => {}}
            loading={loading || isInfluencerProfileLoading}
            disabled
          />
        </Col>
        {user?.is_influencer && (
          <Col span={screens.xs ? 24 : 12}>
            <FormInput
              label="Gender"
              name="gender"
              register={register}
              watch={() => influencerProfile?.gender || ""}
              setValue={() => {}}
              error={errors.gender}
              loading={loading || isInfluencerProfileLoading}
              disabled
            />
          </Col>
        )}
      </Row>

      {/* Brand Name (Only for Brand Users) */}
      {user?.is_brand && (
        <Row gutter={12}>
          <Col span={24}>
            <FormInput
              name="brand_name"
              label="Brand Name"
              register={register}
              watch={watch}
              setValue={setValue}
              error={errors.brand_name}
              loading={loading || isInfluencerProfileLoading}
            />
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default ProfileInformationSection;
