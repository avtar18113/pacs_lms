import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, ProgressBar, Tab, Tabs, Row, Col } from 'react-bootstrap';
import { apiService } from '../../services/api';

const VideoUploader = ({ show, onHide, courseId, onVideoAdded }) => {
    const [activeTab, setActiveTab] = useState('youtube');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [lectures, setLectures] = useState([]);
    const [selectedLecture, setSelectedLecture] = useState('');

    // Fetch lectures when component mounts or courseId changes
    useEffect(() => {
        if (show && courseId) {
            fetchLectures();
        }
    }, [show, courseId]);

    const fetchLectures = async () => {
        try {
            const result = await apiService.getLecturesByCourse(courseId);
            if (result.success) {
                setLectures(result.data || []);
                if (result.data && result.data.length > 0) {
                    setSelectedLecture(result.data[0].id.toString());
                }
            } else {
                setError('Failed to load lectures: ' + result.message);
            }
        } catch (error) {
            console.error('Error fetching lectures:', error);
            setError('Error loading lectures: ' + error.message);
        }
    };

    // Form states
    const [youtubeData, setYoutubeData] = useState({
        title: '',
        description: '',
        youtubeUrl: ''
    });

    const [uploadData, setUploadData] = useState({
        title: '',
        description: '',
        videoFile: null,
        thumbnailFile: null
    });

    const [externalData, setExternalData] = useState({
        title: '',
        description: '',
        videoUrl: ''
    });

    const resetForms = () => {
        setYoutubeData({ title: '', description: '', youtubeUrl: '' });
        setUploadData({ title: '', description: '', videoFile: null, thumbnailFile: null });
        setExternalData({ title: '', description: '', videoUrl: '' });
        setError('');
        setProgress(0);
    };

    const handleClose = () => {
        resetForms();
        onHide();
    };

    // Extract YouTube ID from URL
    const extractYouTubeId = (url) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    };

    // Validate and submit video
    const submitVideo = async (videoData) => {
        console.log('Submitting video data:', videoData);
        
        if (!selectedLecture) {
            throw new Error('Please select a lecture first');
        }

        if (!courseId) {
            throw new Error('Course ID is missing');
        }

        const finalVideoData = {
            ...videoData,
            course_id: parseInt(courseId),
            lecture_id: parseInt(selectedLecture)
        };

        console.log('Final video data to send:', finalVideoData);

        const result = await apiService.createVideo(finalVideoData);
        
        if (result.success) {
            return result.video_id;
        } else {
            throw new Error(result.message || 'Failed to create video');
        }
    };

    // Handle YouTube URL submission
    const handleYouTubeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const youtubeId = extractYouTubeId(youtubeData.youtubeUrl);
            if (!youtubeId) {
                throw new Error('Invalid YouTube URL. Please provide a valid YouTube video URL.');
            }

            const videoData = {
                title: youtubeData.title,
                description: youtubeData.description,
                video_type: 'youtube',
                video_url: youtubeData.youtubeUrl
            };

            const videoId = await submitVideo(videoData);
            onVideoAdded(videoId);
            handleClose();
        } catch (err) {
            console.error('YouTube video submission error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle video file upload
    const handleVideoUpload = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setProgress(0);

        try {
            if (!uploadData.videoFile) {
                throw new Error('Please select a video file');
            }

            // First create video record
            const videoData = {
                title: uploadData.title,
                description: uploadData.description,
                video_type: 'upload',
                video_url: ''
            };

            const videoId = await submitVideo(videoData);

            // Upload the actual video file
            const formData = new FormData();
            formData.append('video', uploadData.videoFile);
            formData.append('video_id', videoId);
            
            if (uploadData.thumbnailFile) {
                formData.append('thumbnail', uploadData.thumbnailFile);
            }

            const uploadResult = await apiService.uploadVideoFile(formData, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
            });

            if (uploadResult.success) {
                onVideoAdded(videoId);
                handleClose();
            } else {
                throw new Error(uploadResult.message);
            }
        } catch (err) {
            console.error('Video upload error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    // Handle external URL submission
    const handleExternalSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate external URL
            if (!externalData.videoUrl) {
                throw new Error('Please enter a video URL');
            }

            if (!externalData.videoUrl.startsWith('http')) {
                throw new Error('Please enter a valid URL starting with http:// or https://');
            }

            const videoData = {
                title: externalData.title,
                description: externalData.description,
                video_type: 'external',
                video_url: externalData.videoUrl
            };

            const videoId = await submitVideo(videoData);
            onVideoAdded(videoId);
            handleClose();
        } catch (err) {
            console.error('External video submission error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-camera-video me-2"></i>
                    Add Video Content
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                {error && (
                    <Alert variant="danger" className="d-flex align-items-center">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <div>
                            <strong>Error:</strong> {error}
                        </div>
                    </Alert>
                )}
                
                {/* Course and Lecture Information */}
                <Row className="mb-4">
                    <Col>
                        <div className="bg-light p-3 rounded">
                            <small className="text-muted d-block">
                                <strong>Course ID:</strong> {courseId || 'Not selected'}
                            </small>
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    <i className="bi bi-journal-text me-2"></i>
                                    Select Lecture *
                                </Form.Label>
                                <Form.Select
                                    value={selectedLecture}
                                    onChange={(e) => setSelectedLecture(e.target.value)}
                                    required
                                    disabled={loading}
                                >
                                    <option value="">Choose a lecture...</option>
                                    {lectures.map(lecture => (
                                        <option key={lecture.id} value={lecture.id}>
                                            {lecture.title}
                                        </option>
                                    ))}
                                </Form.Select>
                                {lectures.length === 0 && (
                                    <Form.Text className="text-warning">
                                        No lectures found for this course. Please create a lecture first.
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </div>
                    </Col>
                </Row>
                
                <Tabs
                    activeKey={activeTab}
                    onSelect={(tab) => setActiveTab(tab)}
                    className="mb-3"
                >
                    {/* YouTube Tab */}
                    <Tab eventKey="youtube" title="YouTube URL">
                        <Form onSubmit={handleYouTubeSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Video Title *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={youtubeData.title}
                                    onChange={(e) => setYoutubeData({...youtubeData, title: e.target.value})}
                                    placeholder="Enter video title"
                                    required
                                    disabled={loading || !selectedLecture}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={youtubeData.description}
                                    onChange={(e) => setYoutubeData({...youtubeData, description: e.target.value})}
                                    placeholder="Enter video description"
                                    disabled={loading || !selectedLecture}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>YouTube URL *</Form.Label>
                                <Form.Control
                                    type="url"
                                    value={youtubeData.youtubeUrl}
                                    onChange={(e) => setYoutubeData({...youtubeData, youtubeUrl: e.target.value})}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    required
                                    disabled={loading || !selectedLecture}
                                />
                                <Form.Text className="text-muted">
                                    Paste the full YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
                                </Form.Text>
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading || !selectedLecture}
                                className="w-100 py-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Adding Video...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-youtube me-2"></i>
                                        Add YouTube Video
                                    </>
                                )}
                            </Button>
                        </Form>
                    </Tab>

                    {/* Upload Tab */}
                    <Tab eventKey="upload" title="Upload Video">
                        <Form onSubmit={handleVideoUpload}>
                            <Form.Group className="mb-3">
                                <Form.Label>Video Title *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={uploadData.title}
                                    onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                                    placeholder="Enter video title"
                                    required
                                    disabled={loading || !selectedLecture}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={uploadData.description}
                                    onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                                    placeholder="Enter video description"
                                    disabled={loading || !selectedLecture}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Video File * (Max: 1GB)</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setUploadData({...uploadData, videoFile: e.target.files[0]})}
                                    required
                                    disabled={loading || !selectedLecture}
                                />
                                {uploadData.videoFile && (
                                    <Form.Text className="text-muted">
                                        Selected: {uploadData.videoFile.name} ({formatFileSize(uploadData.videoFile.size)})
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Custom Thumbnail (Optional)</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setUploadData({...uploadData, thumbnailFile: e.target.files[0]})}
                                    disabled={loading || !selectedLecture}
                                />
                                <Form.Text className="text-muted">
                                    Upload a custom thumbnail image for your video (JPEG, PNG, GIF)
                                </Form.Text>
                            </Form.Group>

                            {progress > 0 && (
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-1">
                                        <small>Upload Progress</small>
                                        <small>{progress}%</small>
                                    </div>
                                    <ProgressBar now={progress} />
                                </div>
                            )}

                            <Button 
                                variant="success" 
                                type="submit" 
                                disabled={loading || !selectedLecture}
                                className="w-100 py-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-cloud-upload me-2"></i>
                                        Upload Video
                                    </>
                                )}
                            </Button>
                        </Form>
                    </Tab>

                    {/* External URL Tab */}
                    <Tab eventKey="external" title="External URL">
                        <Form onSubmit={handleExternalSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Video Title *</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={externalData.title}
                                    onChange={(e) => setExternalData({...externalData, title: e.target.value})}
                                    placeholder="Enter video title"
                                    required
                                    disabled={loading || !selectedLecture}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={externalData.description}
                                    onChange={(e) => setExternalData({...externalData, description: e.target.value})}
                                    placeholder="Enter video description"
                                    disabled={loading || !selectedLecture}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Video URL *</Form.Label>
                                <Form.Control
                                    type="url"
                                    value={externalData.videoUrl}
                                    onChange={(e) => setExternalData({...externalData, videoUrl: e.target.value})}
                                    placeholder="https://example.com/video.mp4"
                                    required
                                    disabled={loading || !selectedLecture}
                                />
                                <Form.Text className="text-muted">
                                    Paste direct URL to video file (MP4, MOV, AVI, WebM, etc.)
                                </Form.Text>
                            </Form.Group>

                            <Button 
                                variant="info" 
                                type="submit" 
                                disabled={loading || !selectedLecture}
                                className="w-100 py-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Adding Video...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-link-45deg me-2"></i>
                                        Add External Video
                                    </>
                                )}
                            </Button>
                        </Form>
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>
    );
};

export default VideoUploader;