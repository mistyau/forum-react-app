import { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

function Panic({ error }) {
    if (error) {
        return (
            <Alert variant="danger">
                <Alert.Heading>AAAAAHHHHH</Alert.Heading>
                <p>Do not be scared. Error: {error}.</p>
            </Alert>
        );
    }
    return null;
}

async function loginUser(credentials) {
    return fetch('http://localhost:8080/api/v1/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(result => result.json())
        .catch((error) => {
            console.log(error);
            return null;
        })
        //.then(data => data.token)
}

export default function Login({ setToken }) {

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [validated, setValidated] = useState();
    const [error, setError] = useState(null);

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
          username,
          password
        });

        token === null ? setError('Username/password is invalid') : setToken(token);
      }
    

    return (
        <Container className="login-wrapper">
            <Panic error={error} />
            <h1>Log In</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" onChange={e => setUserName(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit" block>Submit</Button>
                <Form.Text id="loginHelpInline" muted>
                    Don't have an account? <a href="/signup">Sign in here.</a>
                </Form.Text>
            </Form>
        </Container>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}