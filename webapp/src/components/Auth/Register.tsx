import { useState } from 'react';
import { useRestApi } from '../../sharedHooks/useRestApi';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
  const navigate = useNavigate();
  const {getFormatedUrl} = useRestApi();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onClick = () => {
    fetch(getFormatedUrl('user/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // This line is important
      },
      body: JSON.stringify({
        firstName,
        lastName,
        username,
        password,
        type: "member",
      })
    })
    .then(response => {
      if (response.ok) {
        navigate('/login');
      }
      
      return response.json();
    })
    .then(data => {
      // TODO: Add some error correction like null values
      console.log(data);
    })
  }

  return (
    <Container className='mt-5'>
      <Card>
        <Card.Header as="h4">Register as Member</Card.Header>
        <Card.Body>
          <Form>
            <Row className="mb-4">
              <Form.Label>Enter first and last name</Form.Label>
                <Col sm={6}>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={value => setFirstName(value.target.value)}
                  />
                </Col>
                <Col sm={5}>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={value => setLastName(value.target.value)}
                  />
              </Col>
            </Row>
            <Form.Group className="mb-4">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter username" 
                value={username}
                onChange={value => setUsername(value.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Enter password" 
                value={password} 
                onChange={value => setPassword(value.target.value)}
              />
            </Form.Group>
            <Button type="button" variant="primary" onClick={onClick}>
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};