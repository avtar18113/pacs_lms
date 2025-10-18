import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Container, 
    Row, 
    Col, 
    Badge, 
    Alert, 
    Spinner,
    Button 
} from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link
import { apiService } from '../../services/api';

const Dashboard = ({ user }) => {
    const [accessibleCourses, setAccessibleCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAccessibleCourses();
    }, [user]);

    const fetchAccessibleCourses = async () => {
        try {
            setLoading(true);
            const result = await apiService.getCourseAccess(user.id);
            if (result.success) {
                setAccessibleCourses(result.data || []);
            } else {
                setError('Failed to load your courses');
            }
        } catch (error) {
            console.error('Error fetching accessible courses:', error);
            setError('Error loading your courses');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Container className="mt-4 d-flex justify-content-center align-items-center min-vh-50">
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Loading your courses...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white">
                    <h2 className="mb-0">👤 Student Dashboard</h2>
                </Card.Header>
                <Card.Body className="p-4">
                    <Row>
                        <Col md={8}>
                            <h3>Welcome back, {user?.full_name || 'Student'}!</h3>
                            <p className="lead">Access your enrolled courses and continue learning.</p>
                            
                            {error && (
                                <Alert variant="warning">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {error}
                                </Alert>
                            )}

                            <h4 className="mt-4">My Courses ({accessibleCourses.length})</h4>
                            
                            {accessibleCourses.length === 0 ? (
                                <Alert variant="info">
                                    <i className="bi bi-info-circle me-2"></i>
                                    You don't have access to any courses yet. Please contact an administrator.
                                </Alert>
                            ) : (
                                <Row className="mt-3">
                                    {accessibleCourses.map(course => (
                                        <Col key={course.id} lg={6} md={12} className="mb-4">
                                            <Card className="h-100 border-0 shadow-sm course-card">
                                                <Card.Body className="d-flex flex-column">
                                                    <div className="course-thumbnail bg-light rounded d-flex align-items-center justify-content-center mb-3" 
                                                         style={{ height: '120px' }}>
                                                        <i className="bi bi-play-circle text-primary fs-1"></i>
                                                    </div>
                                                    <h5 className="card-title">{course.title}</h5>
                                                    <p className="card-text text-muted small flex-grow-1">
                                                        {course.description ? 
                                                            (course.description.length > 100 ? 
                                                                `${course.description.substring(0, 100)}...` : 
                                                                course.description
                                                            ) : 
                                                            'No description available.'
                                                        }
                                                    </p>
                                                    <div className="mt-auto">
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <Badge bg="primary">
                                                                {course.lecture_count || 0} Lectures
                                                            </Badge>
                                                            <small className="text-muted">
                                                                By {course.mentor_name || 'Unknown Mentor'}
                                                            </small>
                                                        </div>
                                                        
                                                        {/* FIXED: Using Link instead of href */}
                                                        <Button 
                                                            as={Link} // Use as prop to render as Link
                                                            to={`/course/${course.id}`} // Use to prop for the route
                                                            variant="primary" 
                                                            size="sm" 
                                                            className="w-100"
                                                        >
                                                            <i className="bi bi-play-fill me-2"></i>
                                                            Start Learning
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Col>
                        <Col md={4}>
                            <Card className="border-0 shadow-sm">
                                <Card.Header>
                                    <h5 className="mb-0">
                                        <i className="bi bi-graph-up me-2"></i>
                                        Your Progress
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <div className="text-center mb-4">
                                        <div className="position-relative d-inline-block">
                                            <div 
                                                className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                                                style={{ width: '100px', height: '100px' }}
                                            >
                                                <span className="h4 mb-0 text-primary">25%</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Enrolled Courses:</span>
                                            <strong>{accessibleCourses.length}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Completed Courses:</span>
                                            <strong>0</strong>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3">
                                            <span>In Progress:</span>
                                            <strong>{accessibleCourses.length}</strong>
                                        </div>
                                    </div>
                                    
                                    <div className="progress mb-2" style={{ height: '8px' }}>
                                        <div 
                                            className="progress-bar" 
                                            style={{ width: '25%' }}
                                        ></div>
                                    </div>
                                    <small className="text-muted d-block text-center">
                                        Overall learning progress
                                    </small>
                                </Card.Body>
                            </Card>

                            {/* Quick Stats Card */}
                            <Card className="border-0 shadow-sm mt-4">
                                <Card.Header>
                                    <h6 className="mb-0">
                                        <i className="bi bi-award me-2"></i>
                                        Achievements
                                    </h6>
                                </Card.Header>
                                <Card.Body>
                                    <div className="text-center">
                                        <i className="bi bi-trophy text-warning fs-1 mb-2 d-block"></i>
                                        <p className="text-muted mb-0">No achievements yet</p>
                                        <small className="text-muted">
                                            Complete courses to earn achievements
                                        </small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Dashboard;