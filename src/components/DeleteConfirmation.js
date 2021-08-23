import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

const baseURL = "http://localhost:8080/api/v1/users"; 

function DeleteModal({ thread, user }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    const headers = {
      'Authorization': `Bearer ${user.token}`
    };

    axios.delete(baseURL + `/${user.username}/threads/${thread.id}`, {
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
      <Button variant="outline-danger" onClick={handleShow}>
        Delete
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>Are you sure you want to delete <b>{ thread.subject}</b>?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
  
export default DeleteModal;