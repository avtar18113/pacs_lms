import React, { useState } from 'react';
import { apiService } from '../../services/api';

const APITest = () => {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const addTestResult = (testName, success, message, data = null) => {
        setTestResults(prev => [...prev, {
            testName,
            success,
            message,
            data,
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    const runAllTests = async () => {
        setLoading(true);
        setTestResults([]);

        // Test 1: User Registration
        await testUserRegistration();

        // Test 2: User Login
        await testUserLogin();

        // Test 3: Get Courses
        await testGetCourses();

        // Test 4: Create Course
        await testCreateCourse();

        setLoading(false);
    };

    const testUserRegistration = async () => {
        try {
            const testUser = {
                full_name: "Test User",
                email: `test${Date.now()}@example.com`,
                password: "password123",
                user_type: "user"
            };

            const result = await apiService.register(testUser);
            
            if (result.success) {
                addTestResult(
                    "User Registration", 
                    true, 
                    "User registered successfully",
                    result.user
                );
            } else {
                addTestResult(
                    "User Registration", 
                    false, 
                    result.message || "Registration failed"
                );
            }
        } catch (error) {
            addTestResult(
                "User Registration", 
                false, 
                `Error: ${error.message}`
            );
        }
    };

    const testUserLogin = async () => {
        try {
            const credentials = {
                email: "test@example.com", // Use an existing test user
                password: "password123"
            };

            const result = await apiService.login(credentials);
            
            if (result.success) {
                addTestResult(
                    "User Login", 
                    true, 
                    "Login successful",
                    result.user
                );
            } else {
                addTestResult(
                    "User Login", 
                    false, 
                    result.message || "Login failed"
                );
            }
        } catch (error) {
            addTestResult(
                "User Login", 
                false, 
                `Error: ${error.message}`
            );
        }
    };

    const testGetCourses = async () => {
        try {
            const result = await apiService.getCourses();
            
            if (result.success) {
                addTestResult(
                    "Get Courses", 
                    true, 
                    `Retrieved ${result.data?.length || 0} courses`,
                    result.data
                );
            } else {
                addTestResult(
                    "Get Courses", 
                    false, 
                    result.message || "Failed to fetch courses"
                );
            }
        } catch (error) {
            addTestResult(
                "Get Courses", 
                false, 
                `Error: ${error.message}`
            );
        }
    };

    const testCreateCourse = async () => {
        try {
            const courseData = {
                title: "Test Course " + Date.now(),
                description: "This is a test course created via API",
                mentor_id: 1 // Use an existing mentor ID
            };

            const result = await apiService.createCourse(courseData);
            
            if (result.success) {
                addTestResult(
                    "Create Course", 
                    true, 
                    "Course created successfully",
                    courseData
                );
            } else {
                addTestResult(
                    "Create Course", 
                    false, 
                    result.message || "Failed to create course"
                );
            }
        } catch (error) {
            addTestResult(
                "Create Course", 
                false, 
                `Error: ${error.message}`
            );
        }
    };

    const clearResults = () => {
        setTestResults([]);
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">
                        <i className="bi bi-cloud-check me-2"></i>
                        API Testing Console
                    </h4>
                </div>
                <div className="card-body">
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <button 
                                className="btn btn-success me-2 mb-2"
                                onClick={runAllTests}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Running Tests...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-play-circle me-2"></i>
                                        Run All Tests
                                    </>
                                )}
                            </button>
                            <button 
                                className="btn btn-outline-secondary mb-2"
                                onClick={clearResults}
                            >
                                <i className="bi bi-trash me-2"></i>
                                Clear Results
                            </button>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <div className="d-inline-block p-2 bg-light rounded">
                                <small className="text-muted">
                                    API Base URL: {process.env.REACT_APP_API_BASE_URL || 'http://localhost/learning-platform/api'}
                                </small>
                            </div>
                        </div>
                    </div>

                    {/* Test Results */}
                    <div className="test-results">
                        <h5 className="mb-3">Test Results:</h5>
                        {testResults.length === 0 ? (
                            <div className="text-center py-4 text-muted">
                                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                                No test results yet. Run tests to see results.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Test Name</th>
                                            <th>Status</th>
                                            <th>Message</th>
                                            <th>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {testResults.map((test, index) => (
                                            <tr key={index}>
                                                <td className="fw-bold">{test.testName}</td>
                                                <td>
                                                    <span className={`badge ${test.success ? 'bg-success' : 'bg-danger'}`}>
                                                        {test.success ? 'PASS' : 'FAIL'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={test.success ? 'text-success' : 'text-danger'}>
                                                        {test.message}
                                                    </span>
                                                    {test.data && (
                                                        <button 
                                                            className="btn btn-sm btn-outline-info ms-2"
                                                            onClick={() => {
                                                                console.log('Test Data:', test.data);
                                                                alert('Check console for detailed data');
                                                            }}
                                                        >
                                                            View Data
                                                        </button>
                                                    )}
                                                </td>
                                                <td>
                                                    <small className="text-muted">{test.timestamp}</small>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Quick Test Buttons */}
                    <div className="mt-4 p-3 bg-light rounded">
                        <h6 className="mb-3">Quick Individual Tests:</h6>
                        <div className="btn-group">
                            <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={testGetCourses}
                                disabled={loading}
                            >
                                Test Get Courses
                            </button>
                            <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={testUserLogin}
                                disabled={loading}
                            >
                                Test Login
                            </button>
                            <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={testUserRegistration}
                                disabled={loading}
                            >
                                Test Registration
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* API Status Check */}
            <div className="card mt-4">
                <div className="card-header">
                    <h5 className="mb-0">API Connection Status</h5>
                </div>
                <div className="card-body">
                    <APIConnectionStatus />
                </div>
            </div>
        </div>
    );
};

// Component to check API connection status
const APIConnectionStatus = () => {
    const [status, setStatus] = useState('checking');
    const [responseTime, setResponseTime] = useState(null);

    const checkAPIStatus = async () => {
        setStatus('checking');
        const startTime = Date.now();
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost/learning-platform/api'}/courses.php`);
            const endTime = Date.now();
            setResponseTime(endTime - startTime);
            
            if (response.ok) {
                setStatus('online');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('offline');
            setResponseTime(null);
        }
    };

    React.useEffect(() => {
        checkAPIStatus();
    }, []);

    const getStatusBadge = () => {
        switch(status) {
            case 'online':
                return <span className="badge bg-success">Online</span>;
            case 'offline':
                return <span className="badge bg-danger">Offline</span>;
            case 'error':
                return <span className="badge bg-warning">Error</span>;
            default:
                return <span className="badge bg-secondary">Checking...</span>;
        }
    };

    return (
        <div className="d-flex justify-content-between align-items-center">
            <div>
                <strong>API Server Status:</strong> {getStatusBadge()}
                {responseTime && (
                    <span className="ms-2 text-muted">
                        Response time: {responseTime}ms
                    </span>
                )}
            </div>
            <button 
                className="btn btn-sm btn-outline-primary"
                onClick={checkAPIStatus}
            >
                <i className="bi bi-arrow-clockwise"></i> Refresh
            </button>
        </div>
    );
};

export default APITest;