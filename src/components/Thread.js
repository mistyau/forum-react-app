import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const baseURL = 'http://localhost:8080/api/v1';

function Post({ post }) {
    return (
        <div className="post-wrapper">
            <h4>{ post.content }</h4>
            <h5>{ post.author } at { post.createdAt }</h5>
        </div>
    );
}

export default function Thread() {
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
        axios.get(baseURL + `/threads/${ id }/posts`)
            .then((response) => {
                setPosts(response.data);
            })
        .catch((error) => {
            console.log(error);
        });
    }, [id]);

    if (!thread) {
        return null;
    }

    if (!posts) {
        return null;
    }

    return (
        <div className="thread-wrapper">
            <h1>{thread.subject}</h1>
            {posts.map((currentPost) => (
                <Post post={currentPost} key={currentPost.id} />
            ))}
        </div>
    );
}