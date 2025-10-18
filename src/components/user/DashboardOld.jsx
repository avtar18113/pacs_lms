import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/api';

const Dashboard = ({ user }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
        fetchEnrolledCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const result = await apiService.getCourses();
            if (result.success) {
                setCourses(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnrolledCourses = async () => {
        // Mock enrolled courses - replace with actual API call
        setEnrolledCourses([1, 2]); // Example enrolled course IDs
    };

    const isEnrolled = (courseId) => {
        return enrolledCourses.includes(courseId);
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="text-muted">Loading your courses...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Welcome Section */}
            <div className="row mb-5">
                <div className="col-12">
                    <div className="card bg-primary text-white border-0 shadow-lg">
                        <div className="card-body p-4 p-md-5">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <h1 className="h2 fw-bold mb-3">
                                        Welcome back, {user?.full_name || 'Student'}! 🎓
                                    </h1>
                                    <p className="mb-0 opacity-75 fs-5">
                                        Continue your learning adventure with our curated courses
                                    </p>
                                </div>
                                <div className="col-md-4 text-md-end mt-4 mt-md-0">
                                    <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center" 
                                         style={{ width: '100px', height: '100px' }}>
                                        <i className="bi bi-mortarboard-fill fs-2"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Courses Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold text-dark mb-0">
                            <i className="bi bi-collection-play me-3"></i>
                            My Courses
                        </h2>
                        <span className="badge bg-primary fs-6">
                            {courses.filter(course => isEnrolled(course.id)).length} Enrolled
                        </span>
                    </div>
                </div>
            </div>

            {courses.filter(course => isEnrolled(course.id)).length === 0 ? (
                <div className="row">
                    <div className="col-12">
                        <div className="card text-center py-5 border-dashed">
                            <div className="card-body py-5">
                                <i className="bi bi-book text-muted fs-1 mb-4"></i>
                                <h4 className="text-muted mb-3">No Courses Enrolled Yet</h4>
                                <p className="text-muted mb-4 fs-5">
                                    Browse available courses and start your learning journey today!
                                </p>
                                <button className="btn btn-primary btn-lg">
                                    <i className="bi bi-compass me-2"></i>
                                    Browse Courses
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {courses
                        .filter(course => isEnrolled(course.id))
                        .map(course => (
                            <div key={course.id} className="col-xxl-3 col-lg-4 col-md-6">
                                <div className="card h-100 course-card border-0 shadow-sm hover-shadow">
                                    <div className="card-img-top bg-gradient-primary d-flex align-items-center justify-content-center position-relative" 
                                         style={{ height: '160px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                        <i className="bi bi-play-circle text-white fs-1"></i>
                                        <div className="position-absolute top-0 end-0 m-3">
                                            <span className="badge bg-success">
                                                <i className="bi bi-check-circle me-1"></i>
                                                Enrolled
                                            </span>
                                        </div>
                                    </div>
                                    <div className="card-body d-flex flex-column p-4">
                                        <h5 className="card-title fw-bold text-dark mb-3">{course.title}</h5>
                                        <p className="card-text text-muted flex-grow-1 mb-4">
                                            {course.description || 'No description available.'}
                                        </p>
                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <span className="badge bg-light text-dark">
                                                    <i className="bi bi-play-circle me-1"></i>
                                                    {course.lecture_count || 0} Lectures
                                                </span>
                                                <small className="text-muted">
                                                    By {course.mentor_name || 'Unknown Mentor'}
                                                </small>
                                            </div>
                                            <Link 
                                                to={`/course/${course.id}`} 
                                                className="btn btn-primary w-100 py-2 fw-semibold"
                                            >
                                                <i className="bi bi-play-fill me-2"></i>
                                                Continue Learning
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {/* Available Courses Section */}
            <div className="row mt-5 pt-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold text-dark mb-0">
                            <i className="bi bi-compass me-3"></i>
                            Available Courses
                        </h2>
                        <span className="badge bg-secondary fs-6">
                            {courses.filter(course => !isEnrolled(course.id)).length} Available
                        </span>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {courses
                    .filter(course => !isEnrolled(course.id))
                    .map(course => (
                        <div key={course.id} className="col-xxl-2 col-lg-3 col-md-4 col-sm-6">
                            <div className="card h-100 course-card border-0 shadow-sm">
                                <div className="card-img-top bg-light d-flex align-items-center justify-content-center" 
                                     style={{ height: '120px' }}>
                                    <i className="bi bi-play-circle text-primary fs-3"></i>
                                </div>
                                <div className="card-body d-flex flex-column p-3">
                                    <h6 className="card-title fw-bold text-dark mb-2">{course.title}</h6>
                                    <p className="card-text text-muted small flex-grow-1 mb-3">
                                        {course.description ? 
                                            (course.description.length > 80 ? 
                                                course.description.substring(0, 80) + '...' : 
                                                course.description
                                            ) : 
                                            'No description available.'
                                        }
                                    </p>
                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="badge bg-secondary small">
                                                {course.lecture_count || 0} Lectures
                                            </span>
                                            <small className="text-muted">
                                                {course.mentor_name || 'Unknown'}
                                            </small>
                                        </div>
                                        <button 
                                            className="btn btn-outline-primary w-100 btn-sm"
                                            disabled
                                            title="Contact admin for access"
                                        >
                                            Request Access
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {courses.filter(course => !isEnrolled(course.id)).length === 0 && courses.length > 0 && (
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card text-center py-4 border-success">
                            <div className="card-body py-4">
                                <i className="bi bi-check-circle text-success fs-1 mb-3"></i>
                                <h5 className="text-success mb-3">You're enrolled in all available courses!</h5>
                                <p className="text-muted fs-5">
                                    Check back later for new course offerings.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;