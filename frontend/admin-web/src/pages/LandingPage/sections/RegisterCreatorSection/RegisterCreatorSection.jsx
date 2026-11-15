import { Flex, Typography } from "antd";
import Five1 from "@src/assets/five1.png";
import Five2 from "@src/assets/five2.png";
import Five3 from "@src/assets/five3.png";
import Five4 from "@src/assets/five4.png";

import "./RegisterCreatorSection.less";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "@src/components";
import ReactImage from "@src/components/Common/ReactImage/ReactImage";

function RegisterCreatorSection() {
  const { Text } = Typography;
  const navigate = useNavigate();

  return (
    <>
      <div className="p-div-five tw-flex tw-gap-3 tw-justify-evenly tw-min-h-[600px]">
        <Flex className="f" align="end">
          <Flex vertical className="f-1" align="end" justify="end">
            <Flex className="f-11">
              <Flex vertical justify="end" className="f-img-1">
                <ReactImage
                  src={Five1}
                  blurHash="LGGi7qw||LNt}roLFYR+E3S2xYr["
                  containerClassName="tw-w-full tw-h-full"
                  className="tw-rounded-t-full tw-aspect-[3/4] tw-w-full tw-h-full"
                />
              </Flex>
              <Flex justify="start" className="f-img-2">
                <img src={Five2} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex className="f-2" vertical align="center" gap="large">
          <Flex>
            <Text className="f2-text-1">Register as a UBU Creator</Text>
          </Flex>
          <Flex>
            <Text className="f2-text-2 ff-manrope">
              Collaborate with brands you love, grow your community and get
              access to a personalized shop on the UBU app.
            </Text>
          </Flex>
          <Flex>
            <CustomButton
              variant={"black lg"}
              onClick={() => navigate("/registration")}
            >
              Learn More
            </CustomButton>
          </Flex>
        </Flex>
        <Flex className="f-3 tw-relative" align="start" justify="end">
          <Flex className="f3-img-1 ">
            <ReactImage
              src={Five3}
              blurHash="LMMtU7x^yEnN01nNVDW=~pi^L}OF"
              containerClassName="tw-w-full"
              // rootClassName="!tw-h-[528px]"
              className="tw-rounded-t-full tw-aspect-[3/4] tw-w-full !tw-h-full"
            />
            <Flex className="f3-img-2 tw-absolute tw-translate-y-1/2">
              <img src={Five4} className="f3-img2" />
            </Flex>
          </Flex>
        </Flex>
      </div>
    </>
  );
}

export default RegisterCreatorSection;
