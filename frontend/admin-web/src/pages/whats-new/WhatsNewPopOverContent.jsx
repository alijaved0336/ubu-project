import PropTypes from "prop-types";
import "./WhatsNewPopOverContent.less";

import { useState } from "react";
import { Text } from "@src/components";
import { CloseIcon } from "@src/assets/icons";
import { Button, Card, Tag, Typography, Flex, Empty } from "antd";

const { Title, Paragraph } = Typography;

const WhatsNewPopOverContent = ({ whatsNew, onClose }) => {
  const [isAllVisible, setIsAllVisible] = useState(true);
  const [selectedWn, setSelectedWn] = useState(null);

  return (
    <Flex vertical className="tw-overflow-hidden whats-new-dropdown tw-mt-2">
      <Flex
        className="whats-new-dropdown-header"
        justify="space-between"
        align="center"
      >
        <Text
          className={`whats-new-dropdown-header-text ${
            isAllVisible
              ? "tw-animate-slide-in-right"
              : "tw-animate-slide-in-left"
          }`}
        >
          {!isAllVisible && (
            <span
              onClick={() => {
                setIsAllVisible(true);
                setSelectedWn(null);
              }}
              className="tw-cursor-pointer tw-text-xl"
            >
              {" "}
              &lt;{" "}
            </span>
          )}
          {selectedWn?.title || "What's New?"}
        </Text>
        <Button onClick={onClose} type="text" icon={<CloseIcon />} />
      </Flex>

      <Flex
        vertical
        className="tw-max-h-96 tw-overflow-auto scrollbar-hidden tw-mb-4 tw-px-4 whats-new-content"
      >
        {whatsNew && whatsNew.length > 0 ? (
          isAllVisible ? (
            whatsNew.map((wN, index) => (
              <Card
                className="tw-cursor-pointer tw-animate-slide-in-right"
                onClick={() => {
                  setIsAllVisible(false);
                  setSelectedWn(wN);
                }}
                key={index}
                style={{
                  borderRadius: "12px",
                  marginBottom: "12px",
                }}
              >
                <Flex vertical gap="8px">
                  <Flex align="center" justify="start" gap="8px">
                    <Tag
                      style={{
                        backgroundColor: wN.tags[0]?.tagColor,
                        color: "#fff",
                        borderRadius: "20px",
                        fontSize: "14px",
                        padding: "4px 12px",
                        fontWeight: "500",
                      }}
                    >
                      {wN.tags[0]?.tagName}
                    </Tag>
                    <Title level={5} style={{ margin: 0, color: "#333" }}>
                      {wN.title}
                    </Title>
                  </Flex>
                  <Paragraph
                    className="tw-line-clamp-2"
                    style={{ color: "#666", margin: 0 }}
                  >
                    {wN.description}
                  </Paragraph>
                </Flex>
              </Card>
            ))
          ) : (
            <Card
              className="tw-animate-slide-in-left"
              style={{
                borderRadius: "12px",
                marginBottom: "12px",
              }}
            >
              <Paragraph style={{ color: "#666", margin: 0 }}>
                {selectedWn?.description}
              </Paragraph>
            </Card>
          )
        ) : (
          <Flex
            justify="center"
            align="center"
            style={{
              height: "100%",
              padding: "20px",
              color: "#666",
              fontSize: "18px",
            }}
          >
            <Empty/>
          </Flex>
        )}
      </Flex>

      {/* Footer Section */}
      {/* <div className="view-all">
        <Button type="link">View full changelog</Button>
      </div> */}
    </Flex>
  );
};

WhatsNewPopOverContent.propTypes = {
  whatsNew: PropTypes.array,
  onClose: PropTypes.func,
};

export default WhatsNewPopOverContent;
