import { useEffect, useState } from "react";
import { instance } from "../services";
import { Link, useLocation, useParams } from "react-router-dom";
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

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function SearchList() {
    let query = useQuery();
    const [parameters, setParameters] = useState(query.get("tagged"));
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        setParameters(query.get("tagged"));
        console.log(parameters);
    }, [query, parameters]);

    useEffect(() => {
        instance.get(`/threads?tagged=${parameters}`)
            .then(res => {
                console.log(res.data);
                setThreads(res.data);
            })
            .catch(err => {
                console.log(err);
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