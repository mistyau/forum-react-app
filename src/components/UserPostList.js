import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import DeleteModal from "./DeleteModal";
import EditPostModal from "./EditModal";
import { instance } from "../services";
import { getDateAgo } from '../util';

function Post({ post, displayEditModal, displayDeleteModal }) {
    return (
        <Container className="thread-wrapper">
            <Row>
                <Col>
                    <b><Link to={"/thread/" + post.threadId}>
                        {post.threadSubject}
                    </Link></b>
                    
                </Col>
                <Col xs={{ order: 1 }} lg={2} className="d-flex align-items-baseline justify-content-end">
                    <Button variant="outline-info" className="mr-1" onClick={() => displayEditModal(post.id, post.content)}>Edit</Button>
                    <Button variant="outline-danger" onClick={() => displayDeleteModal(post.id)}>Delete</Button>
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
    const [posts, setPosts] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [content, setContent] = useState(null);
    const [postId, setPostId] = useState(null);

    useEffect(() => {
        let isMounted = true;

        instance.get(`/users/${user.username}/posts`)
        .then((response) => {
            if (isMounted) {
                setPosts(response.data);
            }
        }).catch(error => {
            console.log(error);
        })

        // cleanup function
        return () => {
            isMounted = false;
        };
    });

    if (!posts) {
        return null;
    }

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
        }).catch((error) => {
            console.log(error);
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
        }).catch((error) => {
            console.log(error);
        });

        setShowEditModal(false);
    }

    return (
        <div className="threads-container">
            {posts.length === 0 ? <p>No posts submitted yet.</p> : 
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
        </div>
    )
}