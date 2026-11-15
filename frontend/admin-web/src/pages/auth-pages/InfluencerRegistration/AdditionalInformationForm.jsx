import React from "react";
import { Input, Select, Typography, Flex } from "antd";
import { Controller } from "react-hook-form";
import {
  africanCountries,
  antarcticaTerritories,
  asianCountries,
  europeanCountries,
  oceaniaCountries,
  southAmericanCountries,
  usStates,
} from "../../../utils/constant"; // Assuming this is an array of state values
import "./InfluencerForm.less";
const { Text } = Typography;

const AdditionalInformationForm = ({ data, control, errors }) => {
  return (
    <Flex vertical className="influencer-registration-flex" gap="large">
      <Flex gap="middle" vertical className="influencer-f">
        <Flex
          gap="large"
          justify="end"
          align="center"
          className="influencer-f-f1"
        >
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Flex vertical className="input-flex">
                <Input {...field} placeholder="Address*" className="input" />
                {errors.address && (
                  <Text type="danger">{errors.address.message}</Text>
                )}
              </Flex>
            )}
          />

          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <Flex vertical className="input-flex">
                <Input {...field} placeholder="City*" className="input" />
                {errors.city && (
                  <Text type="danger">{errors.city.message}</Text>
                )}
              </Flex>
            )}
          />
        </Flex>
        <Flex
          gap="large"
          justify="end"
          align="center"
          className="influencer-f-f1"
        >
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <Flex vertical className="input-flex">
                {["northAmerica", ""].includes(data.audienceRegion) && (
                  <Select
                    {...field}
                    placeholder="Select a State*"
                    className="input"
                  >
                    {usStates.map((state) => (
                      <Select.Option key={state} value={state}>
                        {state}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                {data.audienceRegion === "asia" && (
                  <Select
                    {...field}
                    placeholder="Select a Country*"
                    className="input"
                  >
                    {asianCountries.map((country) => (
                      <Select.Option key={country} value={country}>
                        {country}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                {data.audienceRegion === "europe" && (
                  <Select
                    {...field}
                    placeholder="Select a Country*"
                    className="input"
                  >
                    {europeanCountries.map((country) => (
                      <Select.Option key={country} value={country}>
                        {country}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                {data.audienceRegion === "africa" && (
                  <Select
                    {...field}
                    placeholder="Select a Country*"
                    className="input"
                  >
                    {africanCountries.map((country) => (
                      <Select.Option key={country} value={country}>
                        {country}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                {data.audienceRegion === "antarctica" && (
                  <Select
                    {...field}
                    placeholder="Select a Country*"
                    className="input"
                  >
                    {antarcticaTerritories.map((country) => (
                      <Select.Option key={country} value={country}>
                        {country}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                {data.audienceRegion === "australia" && (
                  <Select
                    {...field}
                    placeholder="Select a Country*"
                    className="input"
                  >
                    {oceaniaCountries.map((country) => (
                      <Select.Option key={country} value={country}>
                        {country}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                {data.audienceRegion === "southAmerica" && (
                  <Select
                    {...field}
                    placeholder="Select a Country*"
                    className="input"
                  >
                    {southAmericanCountries.map((country) => (
                      <Select.Option key={country} value={country}>
                        {country}
                      </Select.Option>
                    ))}
                  </Select>
                )}

                {errors.state && (
                  <Text type="danger">{errors.state.message}</Text>
                )}
              </Flex>
            )}
          />

          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <Flex vertical className="input-flex">
                <Input {...field} placeholder="Zip Code*" className="input" />
                {errors.zipCode && (
                  <Text type="danger">{errors.zipCode.message}</Text>
                )}
              </Flex>
            )}
          />
        </Flex>
        <Text className="inf-note-text1">
          <span className="inf-note-text-bold">Note:</span> This information
          will be used when working together with brands.
        </Text>
      </Flex>
    </Flex>
  );
};

export default AdditionalInformationForm;
