import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DeleteModal from "./DeleteConfirmation";

function Thread({ thread, deleteThread, user }) {
    return (
        <div>
            <Row>
                <Col>
                    <Link to={"/thread/" + thread.id}>
                        {thread.subject}
                    </Link>
                    <p><small className="text-muted">{thread.createdAt}</small></p>
                </Col>
                <Col className="d-flex align-items-baseline justify-content-end">
                    <Link to={"/edit/" + thread.id}>Edit</Link>
                    <DeleteModal thread={thread} user={user} />
                </Col>
            </Row>
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
            {!threads.length === 0 ? <p>No threads submitted yet.</p> :
            (threads.map((currentThread) => (
                <Thread thread={currentThread} user={user} key={currentThread.id}/>
            )))}
        </div>
    )
}