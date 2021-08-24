import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import CreatePostModal from "./CreatePost";

const baseURL = 'http://localhost:8080/api/v1';

function Post({ post }) {
    return (
        <div className="post-wrapper">
            <p>{ post.content }</p>
            <small>{ post.author }</small>
            <small className="text-muted"> at { post.createdAt }</small>
        </div>
    );
}

export default function Thread({ user }) {
    const [thread, setThread] = useState(null);
    const [posts, setPosts] = useState(null);

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
        axios.get(baseURL + `/threads/${ id }/posts`)
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

    if (!posts) {
        return (
            <div className="threads-container">
                <h1>{thread.subject}</h1>
                <div className="posts-container">
                    <h2>No posts yet...</h2>
                </div> 
            </div>
        );
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
                {posts.map((currentPost) => (
                <Post post={currentPost} key={currentPost.id} />
            ))}
            </div>
        </Container>
    );
}