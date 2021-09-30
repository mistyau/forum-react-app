import { useReducer } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import './Login.css';
import Tags from "./Tags";
import { useState } from "react";
import { instance } from "../services";
import { useHistory } from "react-router";
import { Row, Col } from "react-bootstrap";

const formReducer = (state, event) => {

    return {
        ...state,
        [event.name]: event.value
    };
}

export default function CreateThread({ user }) {
    const [formData, setFormData] = useReducer(formReducer, {});
    const [tags, setTags] = useState([]);
    const history = useHistory();
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);
        event.preventDefault();

        const newThread = {
            subject: formData.subject,
            content: formData.content,
            tags: tags
        };

        instance.post(`/users/${user.username}/threads`, newThread)
            .then(response => {
                console.log(response.data);
                history.push(`/thread/${response.data.id}`);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleChange = (e) => {
        e.preventDefault();

        setFormData({
            name: e.target.name,
            value: e.target.value
        });
    }

    return (
        <Container>
            <Row className="justify-content-center">
                <Col lg={6}>
                    <div className="round-box">
                    <h3>Create New Thread</h3>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Control
                                required
                                name="subject"
                                placeholder="Subject"
                                aria-label="Subject"
                                aria-describedby="basic-addon1"
                                onChange={handleChange}
                                value={formData.subject || ''}
                            />
                            <Form.Control.Feedback type="invalid">
                                Subject cannot be blank.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows="4"
                                name="content"
                                placeholder="Content"
                                aria-label="Content"
                                aria-describedby="basic-addon1"
                                onChange={handleChange}
                                value={formData.content || ''}
                            />
                        </Form.Group>
                        <Tags tags={tags} setTags={setTags} />
                        <Button variant="primary" type="button" onClick={handleSubmit}>Submit</Button>
                    </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}