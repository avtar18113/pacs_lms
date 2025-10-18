const API_BASE_URL = 'http://localhost/learning-platform/api';

export const apiService = {
    // Authentication
    async login(credentials) {
        const response = await fetch(`${API_BASE_URL}/auth.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'login',
                ...credentials
            })
        });
        return await response.json();
    },

    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/auth.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'register',
                ...userData
            })
        });
        return await response.json();
    },

    // Courses
    async getCourses() {
        const response = await fetch(`${API_BASE_URL}/courses.php`);
        return await response.json();
    },

    async createCourse(courseData) {
        const response = await fetch(`${API_BASE_URL}/courses.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(courseData)
        });
        return await response.json();
    },

    // File upload for documents
    async uploadDocument(formData) {
        const response = await fetch(`${API_BASE_URL}/upload.php`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        return await response.json();
    }
};