import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  ListGroup, 
  Badge, 
  Spinner, 
  Alert,
  ProgressBar
} from 'react-bootstrap';
// import ProtectedVideoPlayer from '../common/ProtectedVideoPlayer';
import EnhancedVideoPlayer from '../video/EnhancedVideoPlayer';
import { useSecurity } from '../../utils/Security';
import { apiService } from '../../services/api';

const CourseView = ({ user }) => {
  const { id } = useParams();
  useSecurity();
  
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseData();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch course details
      const courseResult = await apiService.getCourse(id);
      if (!courseResult.success) {
        throw new Error(courseResult.message || 'Failed to load course');
      }
      setCourse(courseResult.data);

      // Fetch lectures for this course
      const lecturesResult = await apiService.getLecturesByCourse(id);
      if (lecturesResult.success) {
        const lecturesData = lecturesResult.data || [];
        setLectures(lecturesData);
        
        // Set first lecture as current if available
        if (lecturesData.length > 0) {
          setCurrentLecture(lecturesData[0]);
          // Fetch videos for the first lecture
          fetchVideosForLecture(lecturesData[0].id);
        }
      }

    } catch (error) {
      console.error('Error fetching course data:', error);
      setError(error.message || 'Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const fetchVideosForLecture = async (lectureId) => {
    try {
      const videosResult = await apiService.getVideosByLecture(lectureId);
      if (videosResult.success) {
        const videosData = videosResult.data || [];
        setVideos(prev => ({
          ...prev,
          [lectureId]: videosData
        }));
        
        // Set first video as current if available
        if (videosData.length > 0) {
          setCurrentVideo(videosData[0]);
        } else {
          setCurrentVideo(null);
        }
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      // Don't set error state here to avoid blocking the UI
    }
  };

  const handleLectureSelect = async (lecture) => {
    setCurrentLecture(lecture);
    
    // Check if we already have videos for this lecture
    if (!videos[lecture.id]) {
      await fetchVideosForLecture(lecture.id);
    } else {
      // Set first video of the lecture as current
      const lectureVideos = videos[lecture.id];
      if (lectureVideos.length > 0) {
        setCurrentVideo(lectureVideos[0]);
      } else {
        setCurrentVideo(null);
      }
    }
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
  };

  const getFileIcon = (fileType) => {
    const iconMap = {
      pdf: 'file-earmark-pdf',
      doc: 'file-earmark-word',
      docx: 'file-earmark-word',
      ppt: 'file-earmark-ppt',
      pptx: 'file-earmark-ppt',
      xls: 'file-earmark-excel',
      xlsx: 'file-earmark-excel',
      zip: 'file-earmark-zip',
      txt: 'file-earmark-text'
    };
    
    return iconMap[fileType] || 'file-earmark';
  };

  const calculateProgress = () => {
    if (lectures.length === 0) return 0;
    // This would typically come from user progress tracking in the database
    // For now, we'll use a simple calculation
    const completedLectures = 1; // This should come from user progress API
    return Math.round((completedLectures / lectures.length) * 100);
  };

  if (loading) {
    return (
      <Container className="mt-4 d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading course content...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <i className="bi bi-info-circle me-2"></i>
          Course not found or you don't have access to this course.
        </Alert>
      </Container>
    );
  }

  const currentLectureVideos = currentLecture ? videos[currentLecture.id] || [] : [];
  const progress = calculateProgress();

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* Video Player Section */}
        <Col lg={8} md={7} className="mb-4">
          {/* Video Player Card */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-dark text-white">
              <h4 className="mb-0 fw-bold">
                <i className="bi bi-play-circle me-2"></i>
                {currentVideo?.title || currentLecture?.title || 'Select a lecture to begin'}
              </h4>
            </Card.Header>
            <Card.Body className="p-0">
              {currentVideo ? (
                <EnhancedVideoPlayer video={currentVideo} />
              ) : currentLecture ? (
                <div className="text-center py-5">
                  <i className="bi bi-camera-video text-muted fs-1 mb-3"></i>
                  <h5 className="text-muted">No video content available</h5>
                  <p className="text-muted">This lecture doesn't have any video content yet.</p>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-play-circle text-muted fs-1 mb-3"></i>
                  <h5 className="text-muted">Select a lecture to start learning</h5>
                </div>
              )}
            </Card.Body>
            {(currentVideo || currentLecture) && (
              <Card.Footer>
                <h6 className="fw-bold">About this {currentVideo ? 'video' : 'lecture'}</h6>
                <p className="text-muted mb-0">
                  {currentVideo?.description || currentLecture?.description || 'No description available.'}
                </p>
              </Card.Footer>
            )}
          </Card>

          {/* Video Selection (if multiple videos in lecture) */}
          {currentLectureVideos.length > 1 && (
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header>
                <h6 className="mb-0 fw-bold">
                  <i className="bi bi-list-ul me-2"></i>
                  Videos in this Lecture
                </h6>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {currentLectureVideos.map((video, index) => (
                    <ListGroup.Item
                      key={video.id}
                      action
                      active={currentVideo?.id === video.id}
                      onClick={() => handleVideoSelect(video)}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        <i className="bi bi-play-circle me-3 text-primary"></i>
                        <div>
                          <h6 className="mb-1">{video.title}</h6>
                          <small className="text-muted">
                            {video.duration || 'Duration not available'}
                          </small>
                        </div>
                      </div>
                      <Badge bg={currentVideo?.id === video.id ? 'light' : 'secondary'} text={currentVideo?.id === video.id ? 'dark' : 'white'}>
                        Video {index + 1}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}

          {/* Documents Section */}
          {currentLecture && currentLecture.documents && currentLecture.documents.length > 0 && (
            <Card className="shadow-sm border-0">
              <Card.Header>
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-file-earmark me-2"></i>
                  Lecture Materials
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {currentLecture.documents.map(doc => (
                    <Col key={doc.id} md={6} lg={4} className="mb-3">
                      <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="text-center d-flex flex-column">
                          <i className={`bi bi-${getFileIcon(doc.type)} text-primary fs-1 mb-3`}></i>
                          <h6 className="card-title fw-bold flex-grow-1">{doc.name}</h6>
                          <Button variant="outline-primary" size="sm" className="mt-auto">
                            <i className="bi bi-download me-1"></i>
                            Download
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Course Content Sidebar */}
        <Col lg={4} md={5}>
          {/* Course Content Card */}
          <Card className="shadow-sm border-0 sticky-top" style={{ top: '100px' }}>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-list-ol me-2"></i>
                Course Content
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {lectures.map((lecture, index) => (
                  <ListGroup.Item
                    key={lecture.id}
                    action
                    active={currentLecture?.id === lecture.id}
                    onClick={() => handleLectureSelect(lecture)}
                    className="d-flex justify-content-between align-items-start py-3"
                  >
                    <div className="d-flex align-items-center flex-grow-1">
                      <Badge bg={currentLecture?.id === lecture.id ? 'light' : 'secondary'} 
                             text={currentLecture?.id === lecture.id ? 'dark' : 'white'}
                             className="me-3">
                        {index + 1}
                      </Badge>
                      <div className="flex-grow-1">
                        <h6 className={`mb-1 ${currentLecture?.id === lecture.id ? 'text-white' : 'text-dark'}`}>
                          {lecture.title}
                        </h6>
                        <small className={currentLecture?.id === lecture.id ? 'text-white-50' : 'text-muted'}>
                          {lecture.duration || 'No duration set'}
                        </small>
                      </div>
                    </div>
                    {videos[lecture.id] && videos[lecture.id].length > 0 && (
                      <i className={`bi bi-camera-video ${currentLecture?.id === lecture.id ? 'text-white' : 'text-muted'}`}></i>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
            <Card.Footer>
              <div className="mb-2">
                <div className="d-flex justify-content-between mb-1">
                  <small className="text-muted">Progress</small>
                  <small className="text-muted">{progress}%</small>
                </div>
                <ProgressBar now={progress} variant="success" />
              </div>
              <small className="text-muted d-block">
                {Math.round((progress / 100) * lectures.length)} of {lectures.length} lectures completed
              </small>
            </Card.Footer>
          </Card>

          {/* Course Info Card */}
          <Card className="shadow-sm border-0 mt-4">
            <Card.Header>
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-info-circle me-2"></i>
                Course Information
              </h5>
            </Card.Header>
            <Card.Body>
              <h6 className="fw-bold text-primary">{course.title}</h6>
              <p className="text-muted small mb-3">{course.description}</p>
              
              <Row className="text-center mb-3">
                <Col xs={6}>
                  <div className="border-end">
                    <h6 className="fw-bold text-primary">{lectures.length}</h6>
                    <small className="text-muted">Lectures</small>
                  </div>
                </Col>
                <Col xs={6}>
                  <h6 className="fw-bold text-success">
                    {lectures.filter(lecture => videos[lecture.id]?.length > 0).length}
                  </h6>
                  <small className="text-muted">With Videos</small>
                </Col>
              </Row>
              
              <hr />
              
              <div className="d-flex align-items-center">
                <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-person-check text-white"></i>
                </div>
                <div>
                  <h6 className="mb-1 fw-bold">Mentor</h6>
                  <small className="text-muted">{course.mentor_name || 'Unknown Mentor'}</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseView;