import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import DeleteModal from "./DeleteModal";

function Post({ post, displayDeleteModal }) {
    return (
        <div className="threadWrapper">
            <Row>
                <Col>
                    <Link to={"/post/" + post.id}>
                        {post.content}
                    </Link>
                    <p><small className="text-muted">{post.createdAt}</small></p>
                </Col>
                <Col className="d-flex align-items-baseline justify-content-end">
                    <Link to={"/edit-post/" + post.id}>Edit</Link>
                    <Button variant="outline-danger" onClick={() => displayDeleteModal(post.id)}>Delete</Button>
                </Col>
            </Row>
        </div>
    );
};

const baseURL = "http://localhost:8080/api/v1/users"; 

export default function UserPostList({ user }) {
    const [posts, setPosts] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
    };

    const headersDelete = {
        'Authorization': `Bearer ${user.token}`
    };

    useEffect(() => {
        let isMounted = true;

        axios.get(`http://localhost:8080/api/v1/users/${user.username}/posts`, {
            headers: headers
        }).then((response) => {
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
        setDeleteId(id);
        setShowDeleteConfirmation(true);
    }

    const hideDeleteModal = () => {
        setShowDeleteConfirmation(false);
    }

    function deletePost(id) {
        axios.delete(baseURL + `/${user.username}/posts/${id}`, {
            headers: headersDelete
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })

        setShowDeleteConfirmation(false);

        const remainingPosts = posts.filter(post => id !== post.id);
        setPosts(remainingPosts);
    }

    return (
        <div className="threads-container">
            {posts.length === 0 ? <p>No posts submitted yet.</p> : 
            (posts.map((currentPost) => (
                <Post post={currentPost} displayDeleteModal={displayDeleteModal} key={currentPost.id}/>
            )))}
            <DeleteModal show={showDeleteConfirmation} handleClose={hideDeleteModal} handleDelete={deletePost} id={deleteId} />
        </div>
    )
}