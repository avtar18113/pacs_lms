import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Mock users data
    setUsers([
      { id: 1, full_name: 'John Doe', email: 'john@example.com', user_type: 'user', status: 'active', created_at: '2024-01-15' },
      { id: 2, full_name: 'Jane Smith', email: 'jane@example.com', user_type: 'mentor', status: 'active', created_at: '2024-01-10' },
      { id: 3, full_name: 'Mike Johnson', email: 'mike@example.com', user_type: 'user', status: 'inactive', created_at: '2024-01-05' },
    ]);

    // Mock courses data
    setCourses([
      { id: 1, title: 'React Fundamentals', mentor_name: 'Jane Smith', status: 'active', students: 25, created_at: '2024-01-12' },
      { id: 2, title: 'PHP Backend Development', mentor_name: 'Jane Smith', status: 'active', students: 18, created_at: '2024-01-08' },
    ]);
  }, []);

  const stats = {
    totalUsers: users.length,
    totalMentors: users.filter(u => u.user_type === 'mentor').length,
    totalCourses: courses.length,
    pendingRequests: 3
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card bg-dark text-white">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h1 className="h2 fw-bold mb-2">Admin Dashboard 👑</h1>
                  <p className="mb-0 opacity-75">
                    Manage users, mentors, and courses across the platform
                  </p>
                </div>
                <div className="col-md-4 text-md-end">
                  <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-shield-check fs-1"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-primary shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="card-title text-primary">{stats.totalUsers}</h3>
                  <p className="card-text text-muted">Total Users</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-people text-primary fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-success shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="card-title text-success">{stats.totalMentors}</h3>
                  <p className="card-text text-muted">Mentors</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-person-badge text-success fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-warning shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="card-title text-warning">{stats.totalCourses}</h3>
                  <p className="card-text text-muted">Courses</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-collection-play text-warning fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-danger shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h3 className="card-title text-danger">{stats.pendingRequests}</h3>
                  <p className="card-text text-muted">Pending Requests</p>
                </div>
                <div className="align-self-center">
                  <i className="bi bi-clock text-danger fs-3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-speedometer2 me-2"></i>
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <i className="bi bi-people me-2"></i>
                Manage Users
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                <i className="bi bi-collection-play me-2"></i>
                Manage Courses
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'access' ? 'active' : ''}`}
                onClick={() => setActiveTab('access')}
              >
                <i className="bi bi-key me-2"></i>
                Access Control
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="row">
        <div className="col-12">
          {activeTab === 'overview' && (
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0 fw-bold">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Platform Overview
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Recent Users</h6>
                    {users.slice(0, 3).map(user => (
                      <div key={user.id} className="d-flex align-items-center mb-3 p-2 border rounded">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style={{ width: '40px', height: '40px' }}>
                          <span className="text-white fw-bold small">
                            {user.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">{user.full_name}</h6>
                          <small className="text-muted">{user.email}</small>
                        </div>
                        <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                          {user.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Recent Courses</h6>
                    {courses.slice(0, 3).map(course => (
                      <div key={course.id} className="d-flex align-items-center mb-3 p-2 border rounded">
                        <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style={{ width: '40px', height: '40px' }}>
                          <i className="bi bi-play-circle text-white"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">{course.title}</h6>
                          <small className="text-muted">By {course.mentor_name}</small>
                        </div>
                        <span className="badge bg-primary">{course.students} students</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0 fw-bold">
                  <i className="bi bi-people me-2"></i>
                  User Management
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                                   style={{ width: '36px', height: '36px' }}>
                                <span className="text-white fw-bold small">
                                  {user.full_name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="fw-bold">{user.full_name}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${
                              user.user_type === 'admin' ? 'bg-danger' : 
                              user.user_type === 'mentor' ? 'bg-warning' : 'bg-info'
                            }`}>
                              {user.user_type}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>{user.created_at}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-primary">
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button className="btn btn-outline-success">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-outline-danger">
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0 fw-bold">
                  <i className="bi bi-collection-play me-2"></i>
                  Course Management
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Course Title</th>
                        <th>Mentor</th>
                        <th>Students</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => (
                        <tr key={course.id}>
                          <td>
                            <h6 className="mb-1 fw-bold">{course.title}</h6>
                          </td>
                          <td>{course.mentor_name}</td>
                          <td>
                            <span className="badge bg-primary">{course.students}</span>
                          </td>
                          <td>
                            <span className={`badge ${course.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                              {course.status}
                            </span>
                          </td>
                          <td>{course.created_at}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-primary">
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button className="btn btn-outline-info">
                                <i className="bi bi-gear"></i>
                              </button>
                              <button className="btn btn-outline-danger">
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'access' && (
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0 fw-bold">
                  <i className="bi bi-key me-2"></i>
                  Access Control
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Grant Course Access</h6>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Select User</label>
                      <select className="form-select">
                        <option>Select a user...</option>
                        {users.filter(u => u.user_type === 'user').map(user => (
                            
                          <option key={user.id} value={user.id}>
                            {user.full_name} ({user.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Select Course</label>
                      <select className="form-select">
                        <option>Select a course...</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button className="btn btn-primary">
                      <i className="bi bi-check-circle me-2"></i>
                      Grant Access
                    </button>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold mb-3">Current Access Permissions</h6>
                    <div className="border rounded p-3">
                      <p className="text-muted mb-0">
                        Access control features will be displayed here. This section will show which users have access to which courses and allow admins to manage permissions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;