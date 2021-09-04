import axios from "axios";
import { useReducer } from "react";
import { InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FormControl from "react-bootstrap/FormControl";
import './Login.css';
import Tags from "./Tags";
import { useState } from "react";
import { instance } from "../services";

const formReducer = (state, event) => {

    return {
        ...state,
        [event.name]: event.value
    };
}

export default function CreateThread({ user }) {
    const [formData, setFormData] = useReducer(formReducer, {});
    const [tags, setTags] = useState([]);

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const newThread = {
            subject: formData.subject,
            content: formData.content,
            tags: tags
        };

        console.log(newThread);
        
        instance.post(`/users/${user.username}/threads`, newThread)
            .then(response => console.log(response.data))
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
        <Container fluid>
            <div className="thread-wrapper">
                <h3>Create New Thread</h3>
                <InputGroup className="mb-3">
                    <FormControl
                        name="subject"
                        placeholder="Subject"
                        aria-label="Subject"
                        aria-describedby="basic-addon1"
                        onChange={handleChange}
                        value={formData.subject || ''}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <FormControl
                        as="textarea"
                        name="content"
                        placeholder="Content"
                        aria-label="Content"
                        aria-describedby="basic-addon1"
                        onChange={handleChange}
                        value={formData.content || ''}
                    />
                </InputGroup>
                <Tags tags={tags} setTags={setTags} />
                <Button variant="primary" type="submit" onClick={handleSubmit}>Submit</Button>
            </div>
        </Container>
    );
}