import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { instance } from "../services";
import CustomPagination from "./CustomPagination";
import { AiOutlineHeart } from "react-icons/ai";
import { IconContext } from "react-icons";
import Nav from "react-bootstrap/Nav";

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
    const [sort, setSort] = useState("new");

    useEffect(() => {
        instance.get(`/threads?page=${currentPage - 1}&size=${PageSize}&sort=${sort}`)
            .then((response) => {
                setThreads(response.data.threads);
                setTotalCount(response.data.totalCount);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentPage, sort]);

    if (!threads) {
        return null;
    }

    return (
        <Container fluid className="thread-container">
            <Nav className="mt-2"
                activeKey={`${sort}`}
                onSelect={(selectedKey) => setSort(selectedKey)}>
                <Nav.Item>
                    <Nav.Link eventKey="new">New</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="popular">Popular</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="old">Old</Nav.Link>
                </Nav.Item>
            </Nav>
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