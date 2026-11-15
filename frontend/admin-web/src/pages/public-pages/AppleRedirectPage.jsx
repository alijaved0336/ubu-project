import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AppleStoreRedirect = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    useEffect(() => {
        const timer = setTimeout(() => {

            window.location.href = 'https://apps.apple.com/';

        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>

            <h2>Redirecting to the Apple Store...</h2>
            <p>Please wait while we take you there.</p>

        </div>
    );
};

export default AppleStoreRedirect;
