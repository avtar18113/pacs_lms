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
        iframe.src = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`;
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        
        // Security enhancements
        iframe.style.pointerEvents = "auto";
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        
        videoContainerRef.current.innerHTML = '';
        videoContainerRef.current.appendChild(iframe);
        
        // Additional security for iframe
        secureVideoPlayer(iframe);
    };

    return (
        <div className="protected-video-container">
            <div 
                ref={videoContainerRef}
                className="video-wrapper"
                style={{
                    position: 'relative',
                    overflow: 'hidden'
                }}
            />
        </div>
    );
};

export default ProtectedVideoPlayer;