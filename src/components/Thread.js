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
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { getDateAgo } from "../util";
import CustomAlertDismissable from "./CustomAlert";

function Post({ user, post, displayEditModal, displayDeleteModal }) {
    return (
        <div className="post-wrapper">

            <b>{post.author}</b>
            <p>{post.content}</p>

            <small className="text-muted">{getDateAgo(post.createdAt)} ago</small>

            <span>
                <small className="text-muted">{post.updatedAt ? ' Edited ' + post.updatedAt : '' }</small>
            </span>
            
            {user.username === post.author ?
            <span>
                <span className="edit-span" onClick={() => displayEditModal(post.id, post.content)}>
                    <small> Edit </small>
                </span>
                <span className="delete-span" onClick={() => displayDeleteModal(post.id)}>
                    <small>Delete</small>
                </span>
            </span> : null}
            
        </div>
    );
}

function Tag({ tag, findByTag }) {
    return (
        <li className="tag" onClick={() => findByTag(tag)}>
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
    const [isLiked, setIsLiked] = useState(false);
    const [error, setError] = useState(false);
    const [showError, setShowError] = useState(false);

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

        if (user.token) {
            instance.get(`/users/${user.username}/threads/${id}/likes`)
                .then(res => {
                    if (res.status === 404) {
                        setIsLiked(false);
                    } else {
                        setIsLiked(true);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
        
        instance.get(`/threads/${id}/posts`)
            .then(res => {
                setPosts(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, [id, user.username, user.token]);

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
                        return {...post, content: content, updatedAt: 'just now'};
                    } else {
                        return post;
                    }
                }));
            }).catch((error) => {
                console.log(error);
                setError(error.response.data);
                setShowError(true);
            })

        setShowEditModal(false);
    }

    function createPost() {
        const newPost = {
            content: content,
            threadId: id
        };
        
        instance.post(`/users/${user.username}/posts`, newPost)
            .then((response) => {
                console.log(response.data);
                setPosts([...posts, response.data]);
            }).catch((error) => {
                console.log(error);
                setError(error.response.data);
                setShowError(true);
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
                setError(err.response.data);
                setShowError(true);
            })

        setShowDeleteModal(false);
    }

    function toggleLike(isLiked) {
        if (!user.token) {
            history.push("/login");
        } else if (isLiked) {
            instance.delete(`/users/${user.username}/liked/${id}`)
                .then(res => {
                    console.log(res.data);
                    setIsLiked(false);
                    setThread({
                        ...thread,
                        likes: thread.likes - 1
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            instance.post(`/users/${user.username}/liked/${id}`)
                .then(res => {
                    console.log(res.data);
                    setIsLiked(true);
                    setThread({
                        ...thread,
                        likes: thread.likes + 1
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    function findByTag(tag) {
        history.push(`/search?tagged=${tag}`);
    }

    return (
        <Container fluid>
            <div className="thread-wrapper">
                <p><b>{thread.author}</b></p>
                <h3 className="mb-3">{thread.subject}</h3>
                <p>{thread.content}</p>
                <p className="text-muted">
                    <IconContext.Provider value={{ className: isLiked ? 'heart-icon-liked' : 'heart-icon' }}>
                        <AiFillHeart onClick={() => toggleLike(isLiked)} />
                    </IconContext.Provider> {thread.likes} likes &bull; { }
                    {getDateAgo(thread.createdAt)} ago
                </p>
                <ul id="tags">
                    {!thread.tags ? null : thread.tags.map((tag, index) => (
                        <Tag tag={tag} findByTag={findByTag} key={index} />
                    ))}
                </ul>
            </div>
            <div className="thread-bar">
                <Button variant="primary" onClick={() => displayCreateModal()}>Reply</Button>
            </div>
            <CustomAlertDismissable 
                show={showError}
                setShow={setShowError}
                variant={"danger"}
                heading={"Error"}
                message={error} />
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