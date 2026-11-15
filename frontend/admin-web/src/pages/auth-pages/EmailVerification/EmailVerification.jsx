import {useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import EmailLogo from "../../../assets/emaillogo.png";
import { Spin, Result, Typography } from 'antd';
import resetSchema from "../../../schemas/resetSchema";

import "./EmailVerification.less";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LandingPageLayout from "@src/pages/layouts/LandingPageLayout";
import { AuthLayoutV2 } from "@src/layouts";
import { Text } from "@src/components";
import axiosInstance from "@src/application-wide/axios/axios-instance";
import { Alert } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const EmailVerification = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const [status, setStatus] = useState('loading'); // 'success' or 'error'
  const [message, setMessage] = useState('');

  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams?.get("token");
  };


  useEffect(() => {
    const token = getQueryParams();
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing.');
      return;
    }else{
      verifyEmail(token);
    }

    
  }, []);

  const verifyEmail = async (token) => {

    try {
      const response = await axiosInstance.get(
        `/email/verify?token=${encodeURIComponent(token)}`
      );
      const message = response.data;
      switch (message) {
        case 'Email successfully verified!':
          setStatus('success');
          setMessage(message);
          setTimeout(() => {
            navigate('/login'); // Replace with your desired route
          }, 5000);
          break;
        case 'Email Already verified. Please continue to Login.':
          setStatus('alreadyVerified');
          setMessage(message);
          setTimeout(() => {
            navigate('/login'); // Replace with your desired route
          }, 5000);
          break;
        default:
          setStatus('error');
          setMessage('An unexpected error occurred.');
      }
    } catch (error) {
      setStatus('error');
      const message = error.response?.data?.message
      switch (message) {
        case 'User of given email not found. Please try to signup again.':
          setStatus('notFound');
          setMessage("User of given email not found. Please try to resend verification link.");
          break;
        case 'Invalid or expired verification link':
          setStatus('error');
          setMessage(message);
          break;
        default:
          setStatus('error');
          setMessage('An unexpected error occurred.');
      }
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Spin size="large" style={{ marginBottom: '20px' }}/>
            <div style={{ marginTop: 16 }}>
              <Text style={{ fontSize: '18px', fontWeight: 500, color: 'rgb(101 103 105)' }}>
                Verifying your email, please wait...
              </Text>
            </div>
          </div>
        );
      
      
      case 'success':
        return <Result status="success" title="Email Verified" subTitle={message} />;
      case 'alreadyVerified':
        return <Result status="info" title="Already Verified" subTitle={message} />;
      case 'notFound':
        return <Result status="404" title="User Not Found" subTitle={message} />;
      case 'error':
        return <Result status="error" title="Verification Failed" subTitle={message} />;
      default:
        return <Result status="error" title="Unknown Error" subTitle="Something went wrong." />;
    }
  };


  return (
    <LandingPageLayout>
      {/* <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f0f2f5',
          flexDirection: 'column',
        }}
      >
        {loading ? (
          <>
            <Spin size="large" style={{ marginBottom: '20px' }} />
            <Typography.Text style={{ fontSize: '18px', color: '#555' }}>
              Verifying your email...
            </Typography.Text>
          </>
        ) : status === 'success' ? (
          <Result
            status="success"
            title={<Typography.Title level={2} style={{ color: '#3f8600' }}>{message}</Typography.Title>}
          />
        ) : (
          <Result
            status="error"
            title={<Typography.Title level={2} style={{ color: '#cf1322' }}>Verification Failed</Typography.Title>}
            subTitle={message}
          />
        )}
      </div> */}
      <div className="email-verification"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f0f2f5',
        }}
      >
        {renderContent()}
      </div>
    </LandingPageLayout>
  );
};

export default EmailVerification;
