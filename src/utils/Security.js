import { useEffect } from 'react';

export const useSecurity = () => {
    useEffect(() => {
        // Disable right click
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };
        
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        const handleKeyDown = (e) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.ctrlKey && e.key === 'U') ||
                (e.ctrlKey && e.key === 'S') ||
                (e.ctrlKey && e.key === 'p')
            ) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        // Disable text selection in video areas
        const handleSelectStart = (e) => {
            if (e.target.closest('.protected-video-container')) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('selectstart', handleSelectStart);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('selectstart', handleSelectStart);
        };
    }, []);
};

export const secureVideoPlayer = (videoElement) => {
    if (!videoElement) return;

    const disableRightClick = (e) => {
        e.preventDefault();
        return false;
    };

    videoElement.addEventListener('contextmenu', disableRightClick);
    
    // Prevent video download
    videoElement.addEventListener('loadstart', () => {
        videoElement.setAttribute('controlsList', 'nodownload');
    });

    return () => {
        videoElement.removeEventListener('contextmenu', disableRightClick);
    };
};