import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import CreatePostModal from "./CreatePost";
import { BsPencil, BsX } from "react-icons/bs";
import { IconContext } from "react-icons/lib";
import EditPostModal from "./EditModal";

const baseURL = 'http://localhost:8080/api/v1';

function Post({ post, displayEditModal }) {
    return (
        <div className="post-wrapper">
            <p>{ post.content }</p>
            <small>{ post.author }</small>
            <small className="text-muted"> at { post.createdAt }</small>
            <IconContext.Provider value={{ color: 'slate', size: '20px' }}>
                <BsPencil onClick={() => displayEditModal(post.id, post.content)} />
            </IconContext.Provider>
            <IconContext.Provider value={{ color: 'slate', size: '20px' }}>
                <BsX/>
            </IconContext.Provider>
        </div>
    );
}

export default function Thread({ user }) {
    const [thread, setThread] = useState(null);
    const [posts, setPosts] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [content, setContent] = useState(null);
    const [postId, setPostId] = useState(null);

    const { id } = useParams();

    useEffect(() => {
        axios.get(baseURL + `/threads/${ id }`)
            .then((response) => {
                setThread(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [id]);

    useEffect(() => { 
        let isMounted = true;
        axios.get(baseURL + `/threads/${ id }/posts`) // requested twice
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
            <div className="threads-container">
                <h1>Thread Not Found!</h1>
            </div>
        );
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
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
        
        const editedPost = {
            content: content
        };

        axios.put(baseURL + `/users/${user.username}/posts/${id}`, editedPost, {
            headers: headers
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
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
                <CreatePostModal user={user} thread={thread} />
            </div>
            <div className="thread-wrapper">
                {!posts ? <p>No posts yet...</p> :
                posts.map((currentPost) => (
                <Post post={currentPost} displayEditModal={displayEditModal} key={currentPost.id} />
            ))}
            </div>
            <EditPostModal
                show={showEditModal}
                handleClose={hideEditModal}
                setContent={setContent}
                handleEdit={editPost}
                id={postId}
                content={content} />
        </Container>
    );
}