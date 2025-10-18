import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Container, 
  Row, 
  Col, 
  Badge, 
  Button, 
  Table,
  Modal,
  Form,
  Spinner,
  Alert
} from 'react-bootstrap';
import { apiService } from '../../services/api';
import VideoUploader from '../video/VideoUploader';

const MentorDashboard = ({ user }) => {
  // State management
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVideoUploader, setShowVideoUploader] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    mentor_id: user?.id || '' // Include mentor_id from logged-in user
  });

  // Statistics calculation
  const stats = {
    totalCourses: courses.length,
    totalLectures: courses.reduce((total, course) => total + (course.lecture_count || 0), 0),
    activeStudents: 0,
    pendingRequests: 0
  };

  // Fetch courses on component mount
  useEffect(() => {
    if (user?.id) {
      fetchCourses();
      // Set mentor_id when user data is available
      setNewCourse(prev => ({ ...prev, mentor_id: user.id }));
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const result = await apiService.getCourses();
      if (result.success) {
        // Filter courses to show only those created by the current mentor
        const mentorCourses = result.data.filter(course => 
          course.mentor_id === user?.id || course.mentor_id == user?.id
        );
        setCourses(mentorCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');

    try {
      // Validate form data
      if (!newCourse.title.trim() || !newCourse.description.trim()) {
        throw new Error('Title and description are required');
      }

      if (!newCourse.mentor_id) {
        throw new Error('Mentor ID is missing. Please ensure you are logged in.');
      }

      const courseData = {
        title: newCourse.title.trim(),
        description: newCourse.description.trim(),
        mentor_id: newCourse.mentor_id
      };

      console.log('Creating course with data:', courseData);

      const result = await apiService.createCourse(courseData);
      
      if (result.success) {
        setShowCreateModal(false);
        setNewCourse({ 
          title: '', 
          description: '', 
          mentor_id: user?.id || '' 
        });
        await fetchCourses(); // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      setCreateError(error.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleVideoAdded = (videoId) => {
    console.log('Video added successfully:', videoId);
    // Refresh videos list or show success message
  };

  const handleOpenVideoUploader = (courseId) => {
    setSelectedCourseId(courseId);
    setShowVideoUploader(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setNewCourse({ 
      title: '', 
      description: '', 
      mentor_id: user?.id || '' 
    });
    setCreateError('');
  };

  // Loading state
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
    <>
      {/* Video Uploader Modal */}
      <VideoUploader 
        show={showVideoUploader}
        onHide={() => {
          setShowVideoUploader(false);
          setSelectedCourseId(null);
        }}
        courseId={selectedCourseId}
        onVideoAdded={handleVideoAdded}
      />

      {/* Create Course Modal */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-plus-circle me-2"></i>
            Create New Course
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateCourse}>
          <Modal.Body>
            {createError && (
              <Alert variant="danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {createError}
              </Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Course Title *</Form.Label>
              <Form.Control
                type="text"
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                placeholder="Enter course title"
                required
                disabled={createLoading}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                placeholder="Describe what students will learn in this course"
                required
                disabled={createLoading}
              />
            </Form.Group>
            
            {/* Hidden mentor_id field for debugging */}
            <Form.Group className="mb-3">
              <Form.Text className="text-muted">
                Mentor ID: {user?.id || 'Not available'}
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={handleCloseCreateModal}
              disabled={createLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={createLoading}
            >
              {createLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Creating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Create Course
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Container className="mt-4">
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-warning text-dark">
                <Row className="align-items-center">
                  <Col>
                    <h2 className="mb-1">👨‍🏫 Mentor Dashboard</h2>
                    <p className="mb-0">
                      Welcome back, <strong>{user?.full_name || 'Mentor'}</strong>
                      {user?.id && (
                        <Badge bg="primary" className="ms-2">ID: {user.id}</Badge>
                      )}
                    </p>
                  </Col>
                  <Col xs="auto">
                    <Button 
                      variant="primary" 
                      onClick={() => setShowCreateModal(true)}
                      size="lg"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Course
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
            </Card>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col xl={3} md={6} className="mb-4">
            <Card className="border-primary border-2 shadow-sm h-100">
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <h3 className="text-primary fw-bold">{stats.totalCourses}</h3>
                    <p className="text-muted mb-0">My Courses</p>
                  </Col>
                  <Col xs="auto">
                    <i className="bi bi-collection-play text-primary fs-1"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} md={6} className="mb-4">
            <Card className="border-success border-2 shadow-sm h-100">
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <h3 className="text-success fw-bold">{stats.totalLectures}</h3>
                    <p className="text-muted mb-0">Total Lectures</p>
                  </Col>
                  <Col xs="auto">
                    <i className="bi bi-play-btn text-success fs-1"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} md={6} className="mb-4">
            <Card className="border-info border-2 shadow-sm h-100">
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <h3 className="text-info fw-bold">{stats.activeStudents}</h3>
                    <p className="text-muted mb-0">Active Students</p>
                  </Col>
                  <Col xs="auto">
                    <i className="bi bi-people text-info fs-1"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} md={6} className="mb-4">
            <Card className="border-warning border-2 shadow-sm h-100">
              <Card.Body>
                <Row className="align-items-center">
                  <Col>
                    <h3 className="text-warning fw-bold">{stats.pendingRequests}</h3>
                    <p className="text-muted mb-0">Pending Requests</p>
                  </Col>
                  <Col xs="auto">
                    <i className="bi bi-clock text-warning fs-1"></i>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Courses List Section */}
        <Row>
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 fw-bold">
                    <i className="bi bi-list-check me-2"></i>
                    My Courses ({courses.length})
                  </h4>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => setShowCreateModal(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    New Course
                  </Button>
                </div>
              </Card.Header>
              
              <Card.Body>
                {courses.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-journal-plus text-muted fs-1 mb-3"></i>
                    <h5 className="text-muted">No Courses Created Yet</h5>
                    <p className="text-muted mb-4">
                      Start by creating your first course to share your knowledge with students.
                    </p>
                    <Button 
                      variant="primary"
                      onClick={() => setShowCreateModal(true)}
                      size="lg"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Your First Course
                    </Button>
                  </div>
                ) : (
                  <Table responsive hover className="align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Course Title</th>
                        <th className="text-center">Lectures</th>
                        <th className="text-center">Students</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => (
                        <tr key={course.id}>
                          <td>
                            <div>
                              <h6 className="mb-1 fw-bold text-primary">{course.title}</h6>
                              <p className="text-muted mb-0 small">
                                {course.description ? 
                                  (course.description.length > 80 ? 
                                    `${course.description.substring(0, 80)}...` : 
                                    course.description
                                  ) : 
                                  'No description available'
                                }
                              </p>
                            </div>
                          </td>
                          <td className="text-center">
                            <Badge bg="primary" className="fs-6">
                              {course.lecture_count || 0}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <Badge bg="secondary" className="fs-6">0</Badge>
                          </td>
                          <td className="text-center">
                            <Badge 
                              bg={course.status === 'active' ? 'success' : 'warning'} 
                              className="fs-6"
                            >
                              {course.status || 'active'}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => handleOpenVideoUploader(course.id)}
                                title="Add Video"
                              >
                                <i className="bi bi-camera-video"></i>
                              </Button>
                              <Button variant="outline-success" size="sm">
                                <i className="bi bi-eye"></i>
                              </Button>
                              <Button variant="outline-danger" size="sm">
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MentorDashboard;