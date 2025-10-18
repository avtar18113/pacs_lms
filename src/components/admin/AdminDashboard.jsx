import React, { useState } from 'react';
import { Card, Container, Row, Col, Badge, Button } from 'react-bootstrap';
import CourseAccessManager from './CourseAccessManager';

const AdminDashboard = ({ user }) => {
    const [activeSection, setActiveSection] = useState('overview');

    const renderSection = () => {
        switch(activeSection) {
            case 'access':
                return <CourseAccessManager user={user} />;
            case 'overview':
            default:
                return (
                    <Row>
                        <Col md={4}>
                            <Card className="text-center h-100 border-0 shadow-sm">
                                <Card.Body>
                                    <i className="bi bi-people text-primary fs-1"></i>
                                    <Card.Title className="mt-2">User Management</Card.Title>
                                    <Card.Text className="text-muted">Manage all users</Card.Text>
                                    <Badge bg="primary">156 Users</Badge>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="text-center h-100 border-0 shadow-sm">
                                <Card.Body>
                                    <i className="bi bi-collection-play text-success fs-1"></i>
                                    <Card.Title className="mt-2">Course Management</Card.Title>
                                    <Card.Text className="text-muted">Manage all courses</Card.Text>
                                    <Badge bg="success">24 Courses</Badge>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="text-center h-100 border-0 shadow-sm">
                                <Card.Body>
                                    <i className="bi bi-shield-check text-warning fs-1"></i>
                                    <Card.Title className="mt-2">Access Control</Card.Title>
                                    <Card.Text className="text-muted">Manage course access</Card.Text>
                                    <Button 
                                        variant="warning" 
                                        onClick={() => setActiveSection('access')}
                                    >
                                        Manage Access
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                );
        }
    };

    return (
        <Container className="mt-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-danger text-white">
                    <h2 className="mb-0">👑 Admin Dashboard</h2>
                </Card.Header>
                <Card.Body className="p-4">
                    <h3>Welcome, {user?.full_name || 'Admin'}!</h3>
                    <p className="lead">Manage users, courses, and platform settings.</p>
                    
                    {renderSection()}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminDashboard;