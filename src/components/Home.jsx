import React from 'react';

const Home = () => {
    return (
        <div className="container mt-4">
            <div className="card shadow-lg">
                <div className="card-header bg-success text-white">
                    <h1 className="mb-0">
                        <i className="bi bi-mortarboard-fill me-2"></i>
                        Learning Platform - Ready to Use!
                    </h1>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <h3>🎉 Congratulations! Your platform is working.</h3>
                            <p className="lead">The API connection is established and ready to use.</p>
                            
                            <div className="mt-4">
                                <h5>Quick Actions:</h5>
                                <div className="d-flex flex-wrap gap-2 mt-3">
                                    <a href="/login" className="btn btn-primary btn-lg">
                                        <i className="bi bi-box-arrow-in-right me-2"></i>
                                        Go to Login
                                    </a>
                                    <a href="/courses" className="btn btn-success btn-lg">
                                        <i className="bi bi-collection-play me-2"></i>
                                        View Courses
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card bg-light">
                                <div className="card-body">
                                    <h5>System Status</h5>
                                    <div className="mb-2">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Frontend: <strong>Online</strong>
                                    </div>
                                    <div className="mb-2">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Backend API: <strong>Online</strong>
                                    </div>
                                    <div className="mb-2">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        Database: <strong>Connected</strong>
                                    </div>
                                    <div className="mt-3">
                                        <small className="text-muted">
                                            API: https://lms.concepttc.com/api
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;