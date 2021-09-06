import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import { instance } from "../services";
import CustomPagination from "./CustomPagination";

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

let PageSize = 10;

export default function ThreadList() {

    const [threads, setThreads] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        instance.get(`/threads?page=${currentPage - 1}&size=${PageSize}&sort=new`)
            .then((response) => {
                setThreads(response.data.threads);
                setTotalCount(response.data.totalCount);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentPage]);

    if (!threads) {
        return null;
    }

    return (
        <Container fluid className="thread-container">
            {threads.map((currentThread) => (
                <Thread thread={currentThread} key={currentThread.id}/>
            ))}
            <CustomPagination
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={PageSize}
                onPageChange={page => setCurrentPage(page)} 
            />
        </Container>
    );
}