import React from "react";
import { Modal, Button, Typography, Flex } from "antd";
import { useTranslation } from "react-i18next";
import exclamation from "../../assets/exclamation.png";
import Xicon from "../../assets/xicon.png";
import "./EmailCaptureModal.less";

const { Text } = Typography;

const NavigateToIOSModal = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();


  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Modal
        title={
          <Flex
            className="w-modal-parent"
            justify="space-between"
            align="center"
          >
            <Flex
              className="w-modal-header-1"
              justify="center"
              align="center"
              gap={24}
            >
              <img
                className="w-modal-header-img"
                src={exclamation}
                alt="exclamation"
              />
              <Text>Important Notice!</Text>
            </Flex>
            <Flex className="w-modal-header-2">
              <Button
                className="modal-btn"
                icon={<img src={Xicon} alt="close" />}
                onClick={handleCloseModal}
              />
            </Flex>
          </Flex>
        }
        open={isOpen}
        footer={null}
        centered
        width="100%"
        zIndex={400}
        closable={false}
        className="EmailCaptureModal"
        // onCancel={handleCloseModal}
      >
        <Flex vertical gap={"1.5rem"}>
          <Text className="main-text">
            Our iOS app is not available yet, but we're working on it! Stay tuned for the launch, and you'll be able to download it from the App Store soon.
          </Text>

        </Flex>
      </Modal>
    </div>
  );
};

export default NavigateToIOSModal;
