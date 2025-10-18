import React from 'react';

const Debug = () => {
    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-success text-white">
                    <h4>✅ Debug Page - Working!</h4>
                </div>
                <div className="card-body">
                    <h5>If you can see this, React routing is working!</h5>
                    <div className="mt-4">
                        <h6>Current Environment:</h6>
                        <ul>
                            <li>React Version: {React.version}</li>
                            <li>API Base URL: {process.env.REACT_APP_API_BASE_URL || 'Not set'}</li>
                            <li>Node Environment: {process.env.NODE_ENV}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Debug;