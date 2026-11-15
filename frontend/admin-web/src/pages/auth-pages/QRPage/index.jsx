import { useEffect } from "react";
import LandingPageLayout from "../../layouts/LandingPageLayout";
import { Flex, notification, QRCode, Space, Typography } from "antd";
import "./qrpage.less";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";
import QRImage from "../../../assets/qricon.png";
import useGetQRUrl from "../../../application-wide/api-gateway-hooks/use-get-qr";
import { showNotification } from "@src/utils/showNotification";
import { AuthLayoutV2 } from "@src/layouts";
import { useDispatch, useSelector } from "react-redux";
import { setIsScanned } from "@src/store/features/authSlice";
import useQrEvents from "@src/application-wide/api-gateway-hooks/use-qr-events";

const QRPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || {});
  const { loading, value } = useGetQRUrl(true);

  useQrEvents({
    onScan: (isScanned) => {
      if (isScanned) {
        dispatch(setIsScanned(true));
        showNotification({
          notificationType: "success",
          message: "",
          description: "The bodygram scan is successful",
        });
        navigate("/dashboard/posts");
      }
    },
    onScanFailed: (error) => {
      notification.error({message:"Error", description:error, duration:3})
    },
  });

  useEffect(() => {
    if (user?.isScanned) {
      navigate("/dashboard/posts");
    }
  }, [navigate, user]);

  const { Text } = Typography;

  return (
    <LandingPageLayout>
      {loading ? (
        <Loader />
      ) : (
        <AuthLayoutV2>
          <Flex className="QRWrapper">
            <Flex
              className="qr-main"
              vertical
              align="center"
              justify="center"
              gap={24}
            >
              <img src={QRImage} className="qr-img" />
              <Text className="qr-heading">
                Get your body estimates with our UBU APP
              </Text>
              <Text className="qr-desc">
                Scan the barcode to get the app. Download our UBU app and get
                personalized body estimates with ease. Simply scan the QR code
                to access the app, where you can create your profile and explore
                product recommendations tailored just for you.
              </Text>
              <Space>
                <QRCode
                  type="svg"
                  value={value?.data?.url}
                  size={200}
                  className="qr-code"
                />
              </Space>
              <Text className="barcode-text">
                Scan the barcode to get the app
              </Text>
            </Flex>
          </Flex>
        </AuthLayoutV2>
      )}
    </LandingPageLayout>
  );
};

export default QRPage;
