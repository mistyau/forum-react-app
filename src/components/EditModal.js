import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";

export function EditThreadModal({ show, handleClose, setSubject, setContent, handleEdit, id, subject, content }) {

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-2">
                        <FormControl
                            aria-label="Thread Subject"
                            onChange={e => setSubject(e.target.value)}
                            value={subject || ''} />
                    </InputGroup>
                    <InputGroup>
                        <FormControl 
                            as="textarea" 
                            aria-label="With textarea"
                            onChange={e => setContent(e.target.value)}
                            value={content || ''} />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleEdit(id)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default function EditPostModal({ show, handleClose, setContent, handleEdit, id, content }) {

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <FormControl 
                            as="textarea" 
                            aria-label="With textarea"
                            onChange={e => setContent(e.target.value)}
                            value={content || ''} />
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleEdit(id)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}