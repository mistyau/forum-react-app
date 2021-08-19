import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react"

const baseURL = 'http://localhost:8080/api/v1';

function Thread({ thread }) {
    return (
        <li>
            <Link to={"/thread/" + thread.id}>
                {thread.subject}
            </Link>
            <p>by {thread.author} at { thread.createdAt }</p>
        </li>
    );
};

export default function ThreadList() {

    const [threads, setThreads] = useState(null);

    useEffect(() => {
        axios.get(baseURL + '/threads')
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
        <div className="threads-container">
            {threads.map((currentThread) => (
                <Thread thread={currentThread} key={currentThread.id}/>
            ))}
        </div>
    )
}