import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function DeleteModal({ show, handleClose, handleDelete, id, message }) {
  
    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body> <Alert variant="danger"><p>{message}</p></Alert> </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="danger" onClick={() => handleDelete(id)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}