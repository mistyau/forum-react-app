import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import CreatePostModal from "./CreatePost";
import { BsPencil, BsX } from "react-icons/bs";
import { IconContext } from "react-icons/lib";
import EditPostModal from "./EditModal";
import { instance } from "../services";

function Post({ user, post, displayEditModal }) {
    return (
        <div className="post-wrapper">
            <p>{ post.content }</p>
            <small>{ post.author }</small>
            <small className="text-muted"> at { post.createdAt }</small>

            {user.username === post.author ?
            <div>
                <IconContext.Provider value={{ color: 'slate', size: '20px' }}>
                    <BsPencil onClick={() => displayEditModal(post.id, post.content)} />
                </IconContext.Provider>
                <IconContext.Provider value={{ color: 'slate', size: '20px' }}>
                    <BsX />
                </IconContext.Provider>
            </div> : null}
            
        </div>
    );
}

export default function Thread({ user }) {
    const [thread, setThread] = useState(null);
    const [posts, setPosts] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [content, setContent] = useState(null);
    const [postId, setPostId] = useState(null);

    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        instance.get(`/threads/${ id }`)
            .then((response) => {
                setThread(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    useEffect(() => { 
        let isMounted = true;
        instance.get(`/threads/${id}/posts`) // requested twice
            .then((response) => {
                if (isMounted) {
                    setPosts(response.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });

        return () => {
            isMounted = false;
        };
    });

    if (!thread) {
        return (
            null
        );
    }

    const displayEditModal = (id, content) => {
        setPostId(id);
        setContent(content);
        setShowEditModal(true);
    }

    const displayCreateModal = () => {
        if (user.token) {
            setShowCreateModal(true);
        } else {
            history.push('/login');
        }
    }

    const hideEditModal = () => {
        setShowEditModal(false);
    }

    const hideCreateModal = () => {
        setShowCreateModal(false);
    }

    function editPost(id) {   
        const editedPost = {
            content: content
        };

        instance.put(`/users/${user.username}/posts/${id}`, editedPost)
            .then((response) => {
                console.log(response.data);
            }).catch((error) => {
                console.log(error);
            })

        setShowEditModal(false);
    }

    function createPost() {
        const newPost = {
            content: content
        };
        
        instance.post(`/users/${user.username}/threads/${id}/posts`, newPost)
            .then((response) => {
                console.log(response.data);
            }).catch((error) => {
                console.log(error);
            })

        setShowCreateModal(false);
    }

    return (
        <Container fluid className="thread-container">
            <div className="thread-wrapper">
                <h1>{thread.subject}</h1>
                <p>{thread.content}</p>
                <small>{thread.author}</small>
                <small className="text-muted"> at {thread.createdAt}</small>
            </div>
            <div className="thread-bar">
                <Button variant="primary" onClick={() => displayCreateModal()}>Reply</Button>
            </div>
            <div className="thread-wrapper">
                {!posts ? <p>No posts yet...</p> :
                posts.map((currentPost) => (
                <Post post={currentPost} displayEditModal={displayEditModal} user={user} key={currentPost.id} />
            ))}
            </div>
            <EditPostModal
                show={showEditModal}
                handleClose={hideEditModal}
                setContent={setContent}
                handleEdit={editPost}
                id={postId}
                content={content} />
            <CreatePostModal 
                show={showCreateModal}
                handleClose={hideCreateModal}
                setContent={setContent}
                handleSubmit={createPost} />
        </Container>
    );
}