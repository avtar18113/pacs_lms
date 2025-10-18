import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProtectedVideoPlayer from '../common/ProtectedVideoPlayer';
import { useSecurity } from '../../utils/Security';

const CourseView = ({ user }) => {
  const { id } = useParams();
  useSecurity();
  
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCourse = {
        id: parseInt(id),
        title: 'React Fundamentals',
        description: 'Learn React from scratch with this comprehensive course covering all fundamental concepts.',
        mentor_name: 'Jane Smith',
        total_lectures: 5
      };

      const mockLectures = [
        {
          id: 1,
          title: 'Introduction to React',
          description: 'Get started with React and understand its core concepts',
          youtube_url: 'https://www.youtube.com/watch?v=IRmfqK1AmBc',
          duration: '08:25',
          documents: [
            { id: 1, name: 'Lecture Slides.pdf', type: 'pdf' },
            { id: 2, name: 'Code Examples.zip', type: 'zip' }
          ]
        },
        {
          id: 2,
          title: 'Components and Props',
          description: 'Learn how to create and use components with props',
          youtube_url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
          duration: '22:15',
          documents: [
            { id: 3, name: 'Component Guide.pdf', type: 'pdf' }
          ]
        },
        {
          id: 3,
          title: 'State and Lifecycle',
          description: 'Understanding state management and component lifecycle',
          youtube_url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
          duration: '18:45',
          documents: []
        }
      ];

      setCourse(mockCourse);
      setLectures(mockLectures);
      setCurrentLecture(mockLectures[0]);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Course not found or you don't have access to this course.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Video Player Section */}
        <div className="col-lg-8 col-md-7 mb-4">
          <div className="card">
            <div className="card-header bg-dark text-white">
              <h4 className="card-title mb-0 fw-bold">
                <i className="bi bi-play-circle me-2"></i>
                {currentLecture?.title || 'Select a lecture to begin'}
              </h4>
            </div>
            <div className="card-body p-0">
              {currentLecture ? (
                <ProtectedVideoPlayer youtubeUrl={currentLecture.youtube_url} />
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-play-circle text-muted fs-1 mb-3"></i>
                  <h5 className="text-muted">Select a lecture to start learning</h5>
                </div>
              )}
            </div>
            {currentLecture && (
              <div className="card-footer">
                <h6 className="fw-bold">About this lecture</h6>
                <p className="text-muted mb-0">
                  {currentLecture.description}
                </p>
              </div>
            )}
          </div>

          {/* Documents Section */}
          {currentLecture && currentLecture.documents && currentLecture.documents.length > 0 && (
            <div className="card mt-4">
              <div className="card-header">
                <h5 className="card-title mb-0 fw-bold">
                  <i className="bi bi-file-earmark me-2"></i>
                  Lecture Materials
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  {currentLecture.documents.map(doc => (
                    <div key={doc.id} className="col-md-6 col-lg-4 mb-3">
                      <div className="card border">
                        <div className="card-body text-center">
                          <i className={`bi bi-filetype-${doc.type} fs-1 text-primary mb-2`}></i>
                          <h6 className="card-title fw-bold">{doc.name}</h6>
                          <button className="btn btn-outline-primary btn-sm">
                            <i className="bi bi-download me-1"></i>
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Course Content Sidebar */}
        <div className="col-lg-4 col-md-5">
          <div className="card sticky-top" style={{ top: '100px' }}>
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0 fw-bold">
                <i className="bi bi-list-ol me-2"></i>
                Course Content
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {lectures.map((lecture, index) => (
                  <button
                    key={lecture.id}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                      currentLecture?.id === lecture.id ? 'active' : ''
                    }`}
                    onClick={() => setCurrentLecture(lecture)}
                  >
                    <div className="d-flex align-items-center">
                      <span className="badge bg-secondary me-3">{index + 1}</span>
                      <div className="text-start">
                        <h6 className={`mb-1 ${currentLecture?.id === lecture.id ? 'text-white' : 'text-dark'}`}>
                          {lecture.title}
                        </h6>
                        <small className={currentLecture?.id === lecture.id ? 'text-white-50' : 'text-muted'}>
                          {lecture.duration}
                        </small>
                      </div>
                    </div>
                    {lecture.documents && lecture.documents.length > 0 && (
                      <i className={`bi bi-paperclip ${currentLecture?.id === lecture.id ? 'text-white' : 'text-muted'}`}></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="card-footer">
              <div className="progress">
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: '25%' }}
                >
                  25% Complete
                </div>
              </div>
              <small className="text-muted mt-2 d-block">
                Completed 1 of {lectures.length} lectures
              </small>
            </div>
          </div>

          {/* Course Info Card */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="card-title mb-0 fw-bold">
                <i className="bi bi-info-circle me-2"></i>
                Course Information
              </h5>
            </div>
            <div className="card-body">
              <h6 className="fw-bold">{course.title}</h6>
              <p className="text-muted small">{course.description}</p>
              <div className="row text-center">
                <div className="col-6">
                  <div className="border-end">
                    <h6 className="fw-bold text-primary">{course.total_lectures}</h6>
                    <small className="text-muted">Lectures</small>
                  </div>
                </div>
                <div className="col-6">
                  <h6 className="fw-bold text-success">{lectures.length}</h6>
                  <small className="text-muted">Available</small>
                </div>
              </div>
              <hr />
              <div className="d-flex align-items-center">
                <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-person-check text-white"></i>
                </div>
                <div>
                  <h6 className="mb-1 fw-bold">Mentor</h6>
                  <small className="text-muted">{course.mentor_name}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;