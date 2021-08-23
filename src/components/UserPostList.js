import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Post({ post, deletePost }) {
    return (
        <div className="threadWrapper">
            <Link to={"/post/" + post.id}>
                {post.content}
            </Link>
            <p><small class="text-muted">{ post.createdAt }</small></p>
            <Link to={"/edit/" + post.id}>Edit</Link>
            <button type="button" onClick={() => deletePost(post.id)}>Delete</button>
        </div>
    );
};

const baseURL = "http://localhost:8080/api/v1/users"; 

export default function UserPostList({ user }) {
    const [posts, setPosts] = useState(null);

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

    function deletePost(id) {
        axios.delete(baseURL + `/${user.username}/posts/${id}`, {
            headers: headersDelete
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })

        const remainingPosts = posts.filter(post => id !== post.id);
        setPosts(remainingPosts);
    }

    return (
        <div className="threads-container">
            {posts.length === 0 ? <p>No posts submitted yet.</p> : 
            (posts.map((currentPost) => (
                <Post post={currentPost} deletePost={deletePost} key={currentPost.id}/>
            )))}
        </div>
    )
}