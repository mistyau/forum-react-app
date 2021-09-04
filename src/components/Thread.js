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
import DeleteModal from "./DeleteModal";

function Post({ user, post, displayEditModal, displayDeleteModal }) {
    return (
        <div className="post-wrapper">
            <p>{ post.content }</p>
            <small>{ post.author }</small>
            <small className="text-muted"> at { post.createdAt }</small>

            {user.username === post.author ?
            <span>
                <IconContext.Provider value={{ className: "react-icons" }}>
                    <BsPencil onClick={() => displayEditModal(post.id, post.content)} />
                </IconContext.Provider>
                <IconContext.Provider value={{ className: "react-icons" }}>
                    <BsX onClick={() => displayDeleteModal(post.id)} />
                </IconContext.Provider>
            </span> : null}
            
        </div>
    );
}

function Tag({ tag}) {
    return (
        <li className="tag">
            <span className="tag-title">{tag}</span>
        </li>
    );  
}

export default function Thread({ user }) {
    const [thread, setThread] = useState(null);
    const [posts, setPosts] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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

        instance.get(`/threads/${id}/posts`)
            .then(res => {
                setPosts(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [id]);

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

    const displayDeleteModal = (id) => {
        setPostId(id);
        setShowDeleteModal(true);
    }

    const hideEditModal = () => {
        setShowEditModal(false);
    }

    const hideCreateModal = () => {
        setShowCreateModal(false);
    }

    const hideDeleteModal = () => {
        setShowDeleteModal(false);
    }

    function editPost(id) {   
        const editedPost = {
            content: content
        };

        instance.put(`/users/${user.username}/posts/${id}`, editedPost)
            .then((response) => {
                console.log(response.data);
                setPosts(posts.map(post => {
                    if (post.id === id) {
                        return {...post, content: content};
                    } else {
                        return post;
                    }
                }));
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
                setPosts([...posts, response.data]);
            }).catch((error) => {
                console.log(error);
            })

        setShowCreateModal(false);
    }

    function deletePost(id) {
        instance.delete(`/users/${user.username}/posts/${id}`)
            .then(res => {
                console.log(res.data);
                setPosts([...posts.filter(el => el.id !== id)]);
            })
            .catch(err => {
                console.log(err);
            })

        setShowDeleteModal(false);
    }

    return (
        <Container fluid className="thread-container">
            <div className="thread-wrapper">
                <h1>{thread.subject}</h1>
                <p>{thread.content}</p>
                <small>{thread.author}</small>
                <small className="text-muted"> at {thread.createdAt}</small>
                <ul id="tags">
                    {!thread.tags ? null : thread.tags.map((tag, index) => (
                        <Tag tag={tag} key={index} />
                    ))}
                </ul>
            </div>
            <div className="thread-bar">
                <Button variant="primary" onClick={() => displayCreateModal()}>Reply</Button>
            </div>
            <div className="thread-wrapper">
                {posts.length === 0 ? <p>No posts yet...</p> :
                posts.map((currentPost) => (
                <Post 
                    post={currentPost} 
                    displayEditModal={displayEditModal}
                    displayDeleteModal={displayDeleteModal} 
                    user={user} 
                    key={currentPost.id} />
            ))}
            </div>
            <EditPostModal
                show={showEditModal}
                handleClose={hideEditModal}
                setContent={setContent}
                handleEdit={editPost}
                id={postId}
                content={content} />
            <DeleteModal
                show={showDeleteModal}
                handleClose={hideDeleteModal}
                handleDelete={deletePost}
                message={"Are you sure you want to delete this post? This action is permanent and cannot be undone."}
                id={postId} />
            <CreatePostModal 
                show={showCreateModal}
                handleClose={hideCreateModal}
                setContent={setContent}
                handleSubmit={createPost} />
        </Container>
    );
}