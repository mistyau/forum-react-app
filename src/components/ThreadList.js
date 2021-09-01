import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { instance } from "../services";

const baseURL = 'http://localhost:8080/api/v1';

function Thread({ thread }) {
    return (
        <div className="thread-wrapper">
            <Link to={"/thread/" + thread.id}>
                {thread.subject}
            </Link>
            <p>by {thread.author} at { thread.createdAt }</p>
        </div>
    );
};

export default function ThreadList() {

    const [threads, setThreads] = useState(null);

    useEffect(() => {
        instance.get('/threads')
            .then((response) => {
                setThreads(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    if (!threads) {
        return null;
    }

    return (
        <Container fluid className="thread-container">
            {threads.map((currentThread) => (
                <Thread thread={currentThread} key={currentThread.id}/>
            ))}
        </Container>
    )
}