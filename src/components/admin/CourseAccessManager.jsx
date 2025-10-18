import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Container, 
    Row, 
    Col, 
    Button, 
    Form, 
    Table, 
    Badge,
    Modal,
    Alert,
    Spinner,
    Tab,
    Tabs
} from 'react-bootstrap';
import { apiService } from '../../services/api';

const CourseAccessManager = ({ user }) => {
    const [activeTab, setActiveTab] = useState('grant');
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [accessRecords, setAccessRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Grant access form state
    const [grantForm, setGrantForm] = useState({
        user_id: '',
        course_id: '',
        expires_at: ''
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // Fetch all users and courses
            const [usersResult, coursesResult, accessResult] = await Promise.all([
                apiService.getUsers(),
                apiService.getCourses(),
                apiService.getCourseAccess()
            ]);

            if (usersResult.success) setUsers(usersResult.data || []);
            if (coursesResult.success) setCourses(coursesResult.data || []);
            if (accessResult.success) setAccessRecords(accessResult.data || []);

        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleGrantAccess = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const accessData = {
                action: 'grant_access',
                user_id: parseInt(grantForm.user_id),
                course_id: parseInt(grantForm.course_id),
                granted_by: user.id,
                expires_at: grantForm.expires_at || null
            };

            const result = await apiService.manageCourseAccess(accessData);
            
            if (result.success) {
                setSuccess('Course access granted successfully!');
                setGrantForm({ user_id: '', course_id: '', expires_at: '' });
                fetchInitialData(); // Refresh data
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error granting access:', error);
            setError('Failed to grant course access');
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeAccess = async (userId, courseId) => {
        if (!window.confirm('Are you sure you want to revoke this user\'s access to the course?')) {
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const revokeData = {
                action: 'revoke_access',
                user_id: userId,
                course_id: courseId
            };

            const result = await apiService.manageCourseAccess(revokeData);
            
            if (result.success) {
                setSuccess('Course access revoked successfully!');
                fetchInitialData(); // Refresh data
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error('Error revoking access:', error);
            setError('Failed to revoke course access');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && accessRecords.length === 0) {
        return (
            <Container className="mt-4 d-flex justify-content-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white">
                    <h2 className="mb-0">
                        <i className="bi bi-shield-check me-2"></i>
                        Course Access Management
                    </h2>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Tabs
                        activeKey={activeTab}
                        onSelect={(tab) => setActiveTab(tab)}
                        className="mb-4"
                    >
                        {/* Grant Access Tab */}
                        <Tab eventKey="grant" title="Grant Access">
                            <Card>
                                <Card.Header>
                                    <h5 className="mb-0">
                                        <i className="bi bi-person-plus me-2"></i>
                                        Grant Course Access
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Form onSubmit={handleGrantAccess}>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Select User *</Form.Label>
                                                    <Form.Select
                                                        value={grantForm.user_id}
                                                        onChange={(e) => setGrantForm({
                                                            ...grantForm, 
                                                            user_id: e.target.value
                                                        })}
                                                        required
                                                        disabled={loading}
                                                    >
                                                        <option value="">Choose a user...</option>
                                                        {users
                                                            .filter(u => u.user_type === 'user')
                                                            .map(user => (
                                                                <option key={user.id} value={user.id}>
                                                                    {user.full_name} ({user.email})
                                                                </option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Select Course *</Form.Label>
                                                    <Form.Select
                                                        value={grantForm.course_id}
                                                        onChange={(e) => setGrantForm({
                                                            ...grantForm, 
                                                            course_id: e.target.value
                                                        })}
                                                        required
                                                        disabled={loading}
                                                    >
                                                        <option value="">Choose a course...</option>
                                                        {courses.map(course => (
                                                            <option key={course.id} value={course.id}>
                                                                {course.title} (by {course.mentor_name})
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        
                                        <Form.Group className="mb-3">
                                            <Form.Label>Access Expiry Date (Optional)</Form.Label>
                                            <Form.Control
                                                type="datetime-local"
                                                value={grantForm.expires_at}
                                                onChange={(e) => setGrantForm({
                                                    ...grantForm, 
                                                    expires_at: e.target.value
                                                })}
                                                disabled={loading}
                                            />
                                            <Form.Text className="text-muted">
                                                Leave empty for permanent access
                                            </Form.Text>
                                        </Form.Group>

                                        <Button 
                                            variant="primary" 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-100"
                                        >
                                            {loading ? (
                                                <>
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                    Granting Access...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-check-circle me-2"></i>
                                                    Grant Course Access
                                                </>
                                            )}
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Tab>

                        {/* Manage Access Tab */}
                        <Tab eventKey="manage" title="Manage Access">
                            <Card>
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        <i className="bi bi-list-check me-2"></i>
                                        Current Access Records
                                    </h5>
                                    <Badge bg="primary">
                                        {accessRecords.length} Records
                                    </Badge>
                                </Card.Header>
                                <Card.Body>
                                    {accessRecords.length === 0 ? (
                                        <div className="text-center py-4 text-muted">
                                            <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                                            No access records found
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            <Table striped hover>
                                                <thead>
                                                    <tr>
                                                        <th>User</th>
                                                        <th>Course</th>
                                                        <th>Granted By</th>
                                                        <th>Granted On</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {accessRecords.map(record => (
                                                        <tr key={record.id}>
                                                            <td>
                                                                <div>
                                                                    <strong>{record.user_name}</strong>
                                                                    <br />
                                                                    <small className="text-muted">{record.user_email}</small>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <strong>{record.course_title}</strong>
                                                            </td>
                                                            <td>{record.granted_by_name}</td>
                                                            <td>{formatDate(record.granted_at)}</td>
                                                            <td>
                                                                <Badge 
                                                                    bg={record.access_status === 'active' ? 'success' : 'secondary'}
                                                                >
                                                                    {record.access_status}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                {record.access_status === 'active' && (
                                                                    <Button
                                                                        variant="outline-danger"
                                                                        size="sm"
                                                                        onClick={() => handleRevokeAccess(record.user_id, record.course_id)}
                                                                        disabled={loading}
                                                                    >
                                                                        <i className="bi bi-x-circle me-1"></i>
                                                                        Revoke
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default CourseAccessManager;