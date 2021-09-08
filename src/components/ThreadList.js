import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { instance } from "../services";
import CustomPagination from "./CustomPagination";
import { AiOutlineHeart } from "react-icons/ai";
import { IconContext } from "react-icons";

function Thread({ thread }) {
    return (
        <div className="thread-wrapper">
            <div className="d-flex flex-row">
                <div className="align-self-center">
                    <IconContext.Provider value={{ className: 'heart-icon'}}>
                        <AiOutlineHeart />
                        <span className="likes-text">
                           { thread.likes } 
                        </span>    
                    </IconContext.Provider>
                </div>
                <div className="d-flex flex-column">
                    <Link to={"/thread/" + thread.id}>
                        {thread.subject}
                    </Link>
                    <p>by {thread.author} at {thread.createdAt}</p>
                </div>
            </div>
            
            
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
                <Thread thread={currentThread} key={currentThread.id} />
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