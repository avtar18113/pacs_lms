import React from 'react';
import { Card, Alert } from 'react-bootstrap';
import ProtectedVideoPlayer from '../common/ProtectedVideoPlayer';

const EnhancedVideoPlayer = ({ video }) => {
    if (!video) {
        return (
            <Card className="text-center py-5">
                <Card.Body>
                    <i className="bi bi-play-circle text-muted fs-1"></i>
                    <h5 className="text-muted mt-3">No video selected</h5>
                </Card.Body>
            </Card>
        );
    }

    const renderVideoContent = () => {
        switch (video.video_type) {
            case 'youtube':
                return <ProtectedVideoPlayer youtubeUrl={video.video_url} />;
            
            case 'upload':
                return (
                    <video 
                        controls 
                        controlsList="nodownload" 
                        style={{ width: '100%', maxHeight: '400px' }}
                        poster={video.thumbnail_path ? `${API_BASE_URL}/uploads/thumbnails/${video.thumbnail_path}` : null}
                    >
                        <source 
                            src={`${API_BASE_URL}/uploads/videos/${video.video_path}`} 
                            type="video/mp4" 
                        />
                        Your browser does not support the video tag.
                    </video>
                );
            
            case 'external':
                return (
                    <video 
                        controls 
                        controlsList="nodownload" 
                        style={{ width: '100%', maxHeight: '400px' }}
                    >
                        <source src={video.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                );
            
            default:
                return (
                    <Alert variant="warning">
                        Unsupported video type: {video.video_type}
                    </Alert>
                );
        }
    };

    return (
        <Card className="mb-4">
            <Card.Header className="bg-dark text-white">
                <h4 className="mb-0">{video.title}</h4>
            </Card.Header>
            <Card.Body className="p-0">
                {renderVideoContent()}
            </Card.Body>
            {video.description && (
                <Card.Footer>
                    <p className="mb-0">{video.description}</p>
                </Card.Footer>
            )}
        </Card>
    );
};

export default EnhancedVideoPlayer;