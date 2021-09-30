import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from 'react-bootstrap/Form';
import { useReducer, useState } from "react";
import { useHistory } from 'react-router-dom';
import './Login.css';
import { instance } from '../services';
import CustomAlertDismissable from './CustomAlert';

const formReducer = (state, event) => {
    if (event.reset) {
        return {
            username: '',
            password: ''
        };
    }

    return {
        ...state,
        [event.name]: event.value
    };
}

export default function SignUp() {
    const [formData, setFormData] = useReducer(formReducer, {});
    const history = useHistory();
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    const handleSubmit = event => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);

        event.preventDefault();

        const newUser = {
            username: formData.username,
            password: formData.password
        };

        instance.post("http://localhost:8080/api/v1/auth/signup", newUser)
            .then(response => {
                console.log(response.data);
                history.push("/login");
            })
            .catch((error) => {
                console.log(error.response);
                setError(error.response.data);
                setShowAlert(true);
                setFormData({reset: true});
            });
    }

    const handleChange = event => {
        setFormData({
            name: event.target.name,
            value: event.target.value
        });
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col lg={5}>
                    <CustomAlertDismissable 
                        show={showAlert} 
                        setShow={setShowAlert} 
                        variant={"danger"}
                        heading={"Error"}
                        message={error} />
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col lg={4}>
                    
                    <div className="round-box">
                        <h1>Sign Up</h1>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <Form.Group controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    required
                                    name="username"
                                    type="text"
                                    onChange={handleChange}
                                    value={formData.username || ''} />
                                <Form.Control.Feedback type="invalid">
                                    Username cannot be blank.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    required
                                    name="password"
                                    type="password"
                                    onChange={handleChange}
                                    value={formData.password || ''} />
                                <Form.Control.Feedback type="invalid">
                                    Password cannot be blank.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <div className="pb-3">
                                <Button variant="primary" type="submit" block>Submit</Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}