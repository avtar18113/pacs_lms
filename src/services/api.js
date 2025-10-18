// Remove the environment variable and hardcode the URL
const API_BASE_URL = 'https://lms.concepttc.com/api';

// Helper function for API calls
const fetchAPI = async (endpoint, options = {}) => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        mode: 'cors',
    };

    try {
        console.log(`🔄 API Call: ${API_BASE_URL}${endpoint}`);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...defaultOptions,
            ...options,
        });

        console.log(`📊 Response Status: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ API Response:', data);
        return data;
    } catch (error) {
        console.error('❌ API Call Failed:', error);
        throw error;
    }
};

export const apiService = {
    // Test API connection
    async testConnection() {
        return await fetchAPI('/test.php');
    },

    // Setup database
    async setupDatabase() {
        return await fetchAPI('/setup_database.php');
    },

    // Authentication
    async login(credentials) {
        return await fetchAPI('/auth.php', {
            method: 'POST',
            body: JSON.stringify({
                action: 'login',
                ...credentials
            })
        });
    },

    async register(userData) {
        return await fetchAPI('/auth.php', {
            method: 'POST',
            body: JSON.stringify({
                action: 'register',
                ...userData
            })
        });
    },

    // Courses
    async getCourses() {
        return await fetchAPI('/courses.php');
    },

    async getCourse(id) {
        return await fetchAPI(`/courses.php?id=${id}`);
    },

    async createCourse(courseData) {
        return await fetchAPI('/courses.php', {
            method: 'POST',
            body: JSON.stringify(courseData)
        });
    },

    // Users
    async getUsers() {
        return await fetchAPI('/users.php');
    },

// Course Access Management
async getCourseAccess(userId = null, courseId = null) {
    let url = '/course_access.php';
    const params = [];
    
    if (userId) params.push(`user_id=${userId}`);
    if (courseId) params.push(`course_id=${courseId}`);
    
    if (params.length > 0) {
        url += '?' + params.join('&');
    }
    
    return await fetchAPI(url);
},

async manageCourseAccess(accessData) {
    return await fetchAPI('/course_access.php', {
        method: 'POST',
        body: JSON.stringify(accessData)
    });
},

// Video management
async createVideo(videoData) {
    // Ensure action parameter is included
    const dataWithAction = {
        action: 'create',
        ...videoData
    };
    
    console.log('Sending video data:', dataWithAction);
    return await fetchAPI('/videos.php', {
        method: 'POST',
        body: JSON.stringify(dataWithAction)
    });
},
async uploadVideoFile(formData, onProgress = null) {
    const token = localStorage.getItem('token');
    
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Progress tracking
        if (onProgress) {
            xhr.upload.addEventListener('progress', onProgress);
        }
        
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch (error) {
                    reject(new Error('Invalid response from server'));
                }
            } else {
                reject(new Error(`Upload failed: ${xhr.status}`));
            }
        });
        
        xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'));
        });
        
        xhr.open('POST', `${API_BASE_URL}/upload_video.php`);
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        xhr.send(formData);
    });
},

async getVideosByLecture(lectureId) {
    return await fetchAPI(`/videos.php?lecture_id=${lectureId}`);
},
// Lectures
async getLecturesByCourse(courseId) {
    return await fetchAPI(`/lectures.php?course_id=${courseId}`);
},
};