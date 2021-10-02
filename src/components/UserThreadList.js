import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/Container";
import { instance } from "../services";
import DeleteModal from "./DeleteModal";
import { EditThreadModal } from "./EditModal";
import { getDateAgo } from "../util";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

function Tag({ tag, findTag }) {
    return (
        <li className="tag" onClick={() => findTag(tag)}>
            <span className="tag-title">{tag}</span>
        </li>
    );  
}

function Thread({ thread, displayEditModal, displayDeleteModal }) {
    return (
        <Container className="thread-wrapper">
            <Row>
                <Col>
                    <h5><Link to={"/thread/" + thread.id}>
                        {thread.subject}
                    </Link></h5>
                </Col>
                <Col xs={{ order: 1 }} lg={1} className="d-flex align-items-baseline justify-content-end">
                    <FiEdit className="edit-icon" onClick={() => displayEditModal(thread.id, thread.subject, thread.content, thread.tags)} />
                    <AiOutlineDelete className="delete-icon" onClick={() => displayDeleteModal(thread.id)} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>{thread.content}</p>
                    <p className="text-muted">{thread.likes} likes &bull; { } {getDateAgo(thread.createdAt)} ago { } {thread.updatedAt ? ' • Edited at ' + thread.updatedAt : ''}</p>
                    <ul id="tags">
                        {!thread.tags ? null : thread.tags.map((tag, index) => (
                            <Tag tag={tag} key={index} />
                        ))}
                    </ul>
                </Col>
            </Row>
        </Container>
    );
};

export default function UserThreadList({ user }) {
    const [threads, setThreads] = useState(null);
    const [id, setId] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [subject, setSubject] = useState(null);
    const [content, setContent] = useState(null);
    const [tags, setTags] = useState([]);
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        instance.get(`/users/${user.username}/threads`)
            .then((response) => {
                if (isMounted) {
                    setThreads(response.data);
                }
            }).catch(error => {
                console.log(error);
            })

        // cleanup function
        return () => {
            isMounted = false;
        };
        
    });

    if (!threads) {
        return null;
    }

    const displayDeleteModal = (id) => {
        setId(id);
        setShowDeleteConfirmation(true);
    }

    const hideDeleteModal = () => {
        setShowDeleteConfirmation(false);
    }

    function deleteThread(id) {
        instance.delete(`/users/${user.username}/threads/${id}`)
            .then((response) => {
                console.log(response.data);
            }).catch((error) => {
                console.log(error);
                setError(error.response.data);
                setShowError(true);
            });

        setShowDeleteConfirmation(false);
    }

    const displayEditModal = (id, subject, content, tags) => {
        setId(id);
        setSubject(subject);
        setContent(content);
        setTags(!tags ? [] : tags);
        setShowEditModal(true);
    }

    const hideEditModal = () => {
        setShowEditModal(false);
    }

    function editThread(id) {
        const editedThread = {
            subject: subject,
            content: content,
            tags: tags
        };
        instance.put(`/users/${user.username}/threads/${id}`, editedThread)
        .then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
            setError(error.response.data);
            setShowError(true);
        });

        setShowEditModal(false);
    }

    return (
        <div className="threads-container">
            {threads.length === 0 ? <p>No threads submitted yet.</p> :
            (threads.map((currentThread) => (
                <Thread 
                    thread={currentThread} 
                    displayDeleteModal={displayDeleteModal}
                    displayEditModal={displayEditModal} 
                    key={currentThread.id}/>
            )))}
            <EditThreadModal 
                show={showEditModal}
                handleClose={hideEditModal}
                setSubject={setSubject}
                setContent={setContent}
                setTags={setTags}
                handleEdit={editThread}
                id={id}
                subject={subject}
                content={content}
                tags={tags} />
            <DeleteModal 
                show={showDeleteConfirmation}
                handleClose={hideDeleteModal}
                handleDelete={deleteThread}
                message={"Are you sure you want to delete this thread? This action is permanent and cannot be undone."}
                id={id} />
        </div>
    )
}