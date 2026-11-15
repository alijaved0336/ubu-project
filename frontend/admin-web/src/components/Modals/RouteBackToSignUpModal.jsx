import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
const RouteBackToSignUpModal = ({ isOpen }) => {
    const [open, setOpen] = useState(isOpen);
    const navigate = useNavigate();
    const handleNavigate = () =>{
        navigate('/registration')
    }
    return (
        <>
            <Modal
                centered
                open={isOpen}
                footer={
                    <>
                        <Button type="primary" onClick={handleNavigate} style={{
                            width: '30%',
                            height: '50px',
                            padding: '8px',
                            borderRadius: '12px',
                            background: '#000000',
                            fontFamily: 'sans-serif',
                            fontSize: '16px',
                            fontWeight: '700',
                            lineHeight: '22.4px',
                            letterSpacing: '0.20000000298023224px',
                            textAlign: 'center',
                            color: 'white'
                        }}>
                            Back To SignUp
                        </Button>
                    </>
                }
                width={1000}
                style={{ zIndex: 1000 }}
                onCancel={handleNavigate}

            >
                <p style={{ fontFamily: 'sans-serif', fontSize: '30px' }}>Please fill out Sign Up form first</p>
            </Modal>
        </>
    );
};
export default RouteBackToSignUpModal;