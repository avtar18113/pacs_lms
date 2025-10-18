import React, { useEffect, useRef } from 'react';
import { useSecurity, secureVideoPlayer } from '../../utils/Security';

const ProtectedVideoPlayer = ({ youtubeUrl }) => {
    useSecurity();
    const videoContainerRef = useRef(null);

    useEffect(() => {
        if (youtubeUrl && videoContainerRef.current) {
            const videoId = extractYouTubeId(youtubeUrl);
            if (videoId) {
                loadYouTubeVideo(videoId);
            }
        }

        return () => {
            // Cleanup iframe when component unmounts
            if (videoContainerRef.current) {
                videoContainerRef.current.innerHTML = '';
            }
        };
    }, [youtubeUrl]);

    const extractYouTubeId = (url) => {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    };

    const loadYouTubeVideo = (videoId) => {
        const iframe = document.createElement('iframe');
        iframe.width = "100%";
        iframe.height = "400";
        // iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1`;
        iframe.src = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1`;
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;      
        
        // Enhanced security features
        iframe.style.pointerEvents = "auto";
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        iframe.setAttribute('referrerpolicy', 'no-referrer');
        iframe.setAttribute('loading', 'lazy');
        
        // Clear previous content and add new iframe
        if (videoContainerRef.current) {
            videoContainerRef.current.innerHTML = '';
            videoContainerRef.current.appendChild(iframe);
            
            // Apply additional security to iframe
            secureVideoPlayer(iframe);
        }
    };

    return (
        <div className="protected-video-container position-relative">
            <div 
                ref={videoContainerRef}
                className="video-wrapper w-100"
                style={{
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#000',
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {!youtubeUrl && (
                    <div className="text-center text-white">
                        <i className="bi bi-play-circle fs-1 mb-3 d-block"></i>
                        <p>No video URL provided</p>
                    </div>
                )}
            </div>
            
            {/* Security overlay to prevent right-click */}
            <div 
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ 
                    pointerEvents: 'none',
                    zIndex: 1 
                }}
                onContextMenu={(e) => e.preventDefault()}
            ></div>
        </div>
    );
};

export default ProtectedVideoPlayer;