import { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

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
    return fetch('http://localhost:8080/api/v1/auth/login', {
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
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async e => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        }

        setValidated(true);

        e.preventDefault();
        const token = await loginUser({
            username,
            password
        });

        token === null ? setError('Username/password is invalid') : setToken(token);         
    }

    useEffect(() => {
        // clean up function
        return () => {
            setValidated(false);
        };
    }, []); // empty dependency array means I want to run an effect and clean it up once
            // ..(on mount and unmount)
            // ..https://reactjs.org/docs/hooks-reference.html#useeffect

    return (
        <Container>
            <Row className="justify-content-center">
                <Col lg={4}>
                    <div className="round-box">
                        <Panic error={error} />
                        <h1>Log In</h1>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter username"
                                    onChange={e => setUserName(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a username.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required
                                    type="password"
                                    placeholder="Password"
                                    onChange={e => setPassword(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Please enter a password.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="primary" type="submit" block>Submit</Button>
                            <Form.Text id="loginHelpInline" muted>
                                Don't have an account? <a href="/signup">Sign up here.</a>
                            </Form.Text>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}