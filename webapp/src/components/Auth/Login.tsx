import { useContext, useState } from 'react';
import { AuthContext, AuthStatusCode } from './AuthProvider';
import { Alert, Button, Card, Container, Form, } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const {login} = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [failed, setFailed] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const onClick = async () => {
    const status = await login(username, password);

    if (status == AuthStatusCode.SUCCESS) navigate('/');
    if (status == AuthStatusCode.FAILURE) {
      setFailed(true);
      setInvalid(false);
    }
    if (status == AuthStatusCode.INVALID) {
      setInvalid(true);
      setFailed(false);
    }
  }

  return (
    <Container className='mt-5'>
      <Card>
        <Card.Header as="h4">Login</Card.Header>
        <Card.Body>
          {failed && <Alert variant={'danger'}>
            Incorrected password
          </Alert>}
          {invalid && <Alert variant={'warning'}>
            This user does not exist  
          </Alert>}
          <Form>
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
              Login
            </Button>
            <Button type="button" variant="link" onClick={() => navigate("/register")}>
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};