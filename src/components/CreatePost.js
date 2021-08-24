import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';

export default function CreatePostModal({ user, thread }) {
    const [show, setShow] = useState(false);
    const [content, setContent] = useState(null);
    const history = useHistory();

    const handleClose = () => setShow(false);
    const handleShow = () => {
        if (user.token) {
            setShow(true);
        } else {
            setShow(false);
            history.push('/login');
        }
    };

    const handleSubmit = () => {
        const newPost = {
            content: content
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        };

        axios.post(`http://localhost:8080/api/v1/users/${user.username}/threads/${thread.id}/posts`, newPost, {
            headers: headers
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })

        setShow(false);
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Reply
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <FormControl 
                            as="textarea" 
                            aria-label="textarea" placeholder="Share your thoughts here..."
                            onChange={e => setContent(e.target.value)} />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}