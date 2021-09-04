import { useEffect, useState } from "react";
import { instance } from "../services";
import { Link, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";

function Thread({ thread }) {
    return (
        <div className="thread-wrapper">
            <Link to={"/thread/" + thread.id}>
                {thread.subject}
            </Link>
            <p>by {thread.author} at {thread.createdAt}</p>
        </div>
    );
}

export default function SearchList() {

    const [threads, setThreads] = useState(null);
    const { parameters } = useParams();

    useEffect(() => {
        instance.get(`/threads/search/${ parameters }`)
            .then(res => {
                setThreads(res.data);
            })
            .catch(err => {
                console.log(err);
                setThreads(null);
            });
    }, [parameters]);

    return (
        <Container fluid className="thread-container">
            {!threads ? <p>No threads found!</p> : threads.map(currentThread => (
                <Thread thread={currentThread} key={currentThread.id} />
            ))}
        </Container>
    );
}