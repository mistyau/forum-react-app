import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Thread({ thread, deleteThread }) {
    return (
        <div className="threadWrapper">
            <Link to={"/thread/" + thread.id}>
                {thread.subject}
            </Link>
            <p>by {thread.author} at { thread.createdAt }</p>
            <Link to={"/edit/" + thread.id}>Edit</Link>
            <button type="button" onClick={() => deleteThread(thread.id)}>Delete</button>
        </div>
    );
};

const baseURL = "http://localhost:8080/api/v1/users"; 

export default function UserThreadList({ user }) {
    const [threads, setThreads] = useState(null);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
    };

    const headersDelete = {
        'Authorization': `Bearer ${user.token}`
    };

    useEffect(() => {
        let isMounted = true;

        axios.get(`http://localhost:8080/api/v1/users/${user.username}/threads`, {
            headers: headers
        }).then((response) => {
            if (isMounted) {
                setThreads(response.data);
            }
        }).catch(error => {
            console.log(error);
        })

        // cleanup function
        return () => {
            isMounted = false;
        };
    });

    if (!threads) {
        return null;
    }

    function deleteThread(id) {
        axios.delete(baseURL + `/${user.username}/threads/${id}`, {
            headers: headersDelete
        }).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })

        const remainingThreads = threads.filter(thread => id !== thread.id);
        setThreads(remainingThreads);
    }

    return (
        <div className="threads-container">
            {threads.map((currentThread) => (
                <Thread thread={currentThread} deleteThread={deleteThread} key={currentThread.id}/>
            ))}
        </div>
    )
}