import { Checkbox, Flex, Form, Input, Typography } from "antd";
import { FormItem } from "react-hook-form-antd";
import { Controller } from "react-hook-form";
import { PASSWORD_FIELD_TYPE } from "../../utils/constant";
import { Link as RouterLink } from "react-router-dom";
import "./AuthForm.less";
import { CustomButton, UBUDatePicker } from "..";
import { useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";

const { Text, Link } = Typography;

const AuthForm = ({
  useForm,
  inputFields,
  submitText,
  onSubmit,
  forgotPasswordText,
  backText,
  loading,
  chcekBoxValue = "SignInPage" | "Remember Me",
  signInText,
  Captcha,
  signupLabel,
  onValidateCaptcha,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm;

  const [passFlag, setFlag] = useState(false);
  const handlePasswordChange = (e) => {
    if (e.target.name === "password") {
      e.target.value.length >= 8 ? setFlag(false) : setFlag(true);
    }
  };

  const renderHelp = (errorMessage) => {
    return errorMessage ? <span>{errorMessage?.message}</span> : undefined;
  };

  const renderFieldByType = (field) => {
    const { type, prefix, suffix, placeholder, name } = field;

    if (type === "date") {
      return (
        <Controller
          name={name}
          control={control}
          rules={[
            { required: true, message: `${placeholder} is required` },
            {
              pattern: /\S+/,
              message: `${placeholder} cannot be empty or contain only spaces`,
            },
            ...(field.rules || []),
          ]}
          render={({ field: controllerField, fieldState: { error } }) => (
            <div>
              <UBUDatePicker
                {...controllerField}
                placeholder={placeholder}
                format="YYYY-MM-DD"
                style={{
                  width: "100%",
                  padding: "1.25em",
                  borderRadius: "12px",
                  fontFamily: "Manrope",
                }}
                disabledDate={(current) => {
                  return current && current > dayjs().endOf("day");
                }}
                showToday={false}
                suffixIcon={prefix}
                value={
                  controllerField.value ? dayjs(controllerField.value) : null
                }
                onChange={(date) => {
                  const stringValue = date ? date.format("YYYY-MM-DD") : "";
                  controllerField.onChange(stringValue);
                }}
                status={error ? "error" : ""}
              />
              {error && (
                <span style={{ color: "#ff4d4f", fontSize: "12px" }}>
                  {error.message}
                </span>
              )}
            </div>
          )}
        />
      );
    }

    return (
      <FormItem
        key={name}
        name={name}
        rules={[
          { required: true, message: `${placeholder} is required` },
          {
            pattern: /\S+/,
            message: `${placeholder} cannot be empty or contain only spaces`,
          },
          ...(field.rules || []),
        ]}
        control={control}
        help={renderHelp(errors[name])}
        className="form-input"
      >
        <Input
          {...(field.type === PASSWORD_FIELD_TYPE
            ? { type: PASSWORD_FIELD_TYPE, onChange: handlePasswordChange }
            : {})}
          prefix={prefix}
          suffix={suffix}
          placeholder={placeholder}
          className="input"
        />
      </FormItem>
    );
  };

  return (
    <Form
      name="form-container"
      className="form-container"
      onFinish={handleSubmit(onSubmit)}
    >
      <Flex vertical className="form-items-container" gap="small">
        {inputFields.map((field) => (
          <div key={field.name}>{renderFieldByType(field)}</div>
        ))}
      </Flex>

      {chcekBoxValue === "Remember Me" ? (
        <Flex className="chkf1" justify="space-between" align="center">
          <FormItem
            key="checkbox"
            name="checkbox"
            control={control}
            help={renderHelp(errors["checkbox"])}
            className="form-input"
          >
            <Checkbox className="chkbox auth-checkbox">
              <span className="ff-manrope">{chcekBoxValue}</span>
            </Checkbox>
          </FormItem>
          {forgotPasswordText && (
            <RouterLink to={`/reset`} className="forgot-password-link">
              {forgotPasswordText}
            </RouterLink>
          )}
        </Flex>
      ) : (
        <Flex vertical gap="small">
          {passFlag && (
            <Text className="signup-label ff-manrope">{signupLabel}</Text>
          )}
          <FormItem
            key="checkbox"
            name="checkbox"
            control={control}
            help={renderHelp(errors["checkbox"])}
            className="form-input"
          >
            <Checkbox className="signup-chkbox auth-checkbox">
              By creating an account means you agree to the{" "}
              <Link
                className="link-text"
                target="_blank"
                style={{ fontSize: "13px" }}
                href="/terms-and-service"
              >
                Terms & Conditions
              </Link>{" "}
              and our{" "}
              <Link
                className="link-text"
                target="_blank"
                style={{ fontSize: "13px" }}
                href="privacypolicy"
              >
                Privacy Policy
              </Link>
            </Checkbox>
          </FormItem>
        </Flex>
      )}

      <Form.Item className="submit-button-auth">
        {Captcha}
        <CustomButton
          variant={"black"}
          htmlType="submit"
          loading={loading}
          onClick={() => onValidateCaptcha && onValidateCaptcha()}
        >
          {submitText}
        </CustomButton>
      </Form.Item>

      {signInText && (
        <Link href={`/login`} className="forgot-password-link">
          {signInText}
        </Link>
      )}

      {backText && (
        <Link className="back-button" href="/sign-in">
          {backText}
        </Link>
      )}
    </Form>
  );
};

AuthForm.propTypes = {
  useForm: PropTypes.object.isRequired,
  inputFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      placeholder: PropTypes.string,
      type: PropTypes.string,
      prefix: PropTypes.node,
      suffix: PropTypes.node,
      rules: PropTypes.array,
    })
  ).isRequired,
  submitText: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onValiidateCaptcha: PropTypes.func,
  onValidateCaptcha: PropTypes.func,
  forgotPasswordText: PropTypes.string,
  backText: PropTypes.string,
  loading: PropTypes.bool,
  chcekBoxValue: PropTypes.string,
  signInText: PropTypes.string,
  cbValue: PropTypes.string,
  Captcha: PropTypes.node,
  signupLabel: PropTypes.string,
};

export default AuthForm;
