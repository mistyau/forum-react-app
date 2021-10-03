import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import DeleteModal from "./DeleteModal";
import EditPostModal from "./EditModal";
import { instance } from "../services";
import { getDateAgo } from '../util';
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import CustomAlertDismissable from "./CustomAlert";

function Post({ post, displayEditModal, displayDeleteModal }) {
    return (
        <Container className="thread-wrapper">
            <Row>
                <Col>
                    <b><Link to={"/thread/" + post.threadId}>
                        {post.threadSubject}
                    </Link></b>
                    
                </Col>
                <Col xs={{ order: 1 }} lg={1} className="d-flex align-items-baseline justify-content-end">
                    <FiEdit className="edit-icon" onClick={() => displayEditModal(post.id, post.content)} />
                    <AiOutlineDelete className="delete-icon" onClick={() => displayDeleteModal(post.id)} />
                </Col>
            </Row>
            <Row>
                <Col md="auto">
                    <p>{post.content}</p>
                    <p className="text-muted">{getDateAgo(post.createdAt)} ago {post.updatedAt ? '• Edited ' + post.updatedAt : ''}</p>
                </Col>
            </Row>
        </Container>
    );
};

export default function UserPostList({ user }) {
    const [posts, setPosts] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [content, setContent] = useState(null);
    const [postId, setPostId] = useState(null);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        instance.get(`/users/${user.username}/posts`)
        .then((response) => {
            setShowAlert(false);
            setPosts(response.data);
        }).catch(error => {
            console.log(error);
            if (!error.response) {
                setError('Server error. Could not retrieve posts.');
            } else {
                setError(error.response.data);
            }

            setShowAlert(true);
        });
    }, [user.username]);

    const displayDeleteModal = (id) => {
        setPostId(id);
        setShowDeleteConfirmation(true);
    }

    const hideDeleteModal = () => {
        setShowDeleteConfirmation(false);
    }

    function deletePost(id) {
        instance.delete(`/users/${user.username}/posts/${id}`)
        .then((response) => {
            console.log(response.data);
            setShowAlert(false);
            setPosts([...posts.filter(el => el.id !== id)]);
        }).catch((error) => {
            console.log(error);
            if (error.response) {
                setError('Server error');
            } else {
                setError(error.response.data);
            }

            setShowAlert(true);
        })

        setShowDeleteConfirmation(false);
    }

    const displayEditModal = (id, content) => {
        setPostId(id);
        setContent(content);
        setShowEditModal(true);
    }

    const hideEditModal = () => {
        setShowEditModal(false);
    }

    function editPost(id) {
        const editedPost = {
            content: content
        };

        instance.put(`/users/${user.username}/posts/${id}`, editedPost)
        .then((response) => {
            console.log(response);
            setShowAlert(false);
            setPosts(posts.map(post => {
                if (post.id === id) {
                    return {...post, content: content, updatedAt: 'just now'};
                } else {
                    return post;
                }
            }));
        }).catch((error) => {
            console.log(error);
            if (!error.response) {
                setError('Could not connect to server');
            } else {
                setError(error.response.data);
            }

            setShowAlert(true);
        });

        setShowEditModal(false);
    }

    return (
        <Container>
            <CustomAlertDismissable
                show={showAlert}
                setShow={setShowAlert}
                variant={"danger"}
                heading={"Error"}
                message={error} />
            {posts.length === 0 ? <p>No posts found.</p> : 
            (posts.map((currentPost) => (
                <Post 
                    post={currentPost} 
                    displayEditModal={displayEditModal}
                    displayDeleteModal={displayDeleteModal} 
                    key={currentPost.id}/>
            )))}
            <EditPostModal
                show={showEditModal}
                handleClose={hideEditModal}
                setContent={setContent}
                handleEdit={editPost}
                id={postId}
                content={content}
                 />
            <DeleteModal 
                show={showDeleteConfirmation} 
                handleClose={hideDeleteModal} 
                handleDelete={deletePost} 
                message={"Are you sure you want to delete this post? This action is permanent and cannot be undone."}
                id={postId} />
        </Container>
    )
}