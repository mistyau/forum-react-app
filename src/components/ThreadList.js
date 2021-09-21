import { Link } from "react-router-dom";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import Container from 'react-bootstrap/Container';
import { instance } from "../services";
import CustomPagination from "./CustomPagination";
import { AiFillHeart } from "react-icons/ai";
import { IconContext } from "react-icons";
import Nav from "react-bootstrap/Nav";
import { useHistory } from "react-router";
import { getDateAgo } from "../util";
import axios from "axios";

function Tag({ tag, findTag }) {
    return (
        <li className="tag" onClick={() => findTag(tag)}>
            <span className="tag-title">{tag}</span>
        </li>
    );  
}

const Thread = forwardRef(({ thread, toggleLike }, ref) => {

    useEffect(() => {
        if (!ref)
            return;
        return () => ref(null);
    }, [ref]);

    return (
        <div className="thread-wrapper" ref={ref} >
            <div className="d-flex flex-row">
                <div className="d-flex flex-column">
                    <p><b>{thread.author}</b></p>
                    <h5><Link to={"/thread/" + thread.id}>
                        {thread.subject}
                    </Link></h5>
                    <p>{thread.content}</p>
                    
                    <p className="text-muted">
                        <IconContext.Provider value={{ className: thread.userLiked ? 'heart-icon-liked' : 'heart-icon' }}>
                            <AiFillHeart onClick={() => toggleLike(thread.userLiked, thread.id)} />
                        </IconContext.Provider> {thread.likes} likes &bull; { }
                        {getDateAgo(thread.createdAt)} ago
                    </p>
                    <ul id="tags">
                        {!thread.tags ? null : thread.tags.map((tag, index) => (
                            <Tag tag={tag} key={index} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
});

/*
function Thread({ thread }) {
    const history = useHistory();

    const findTag = (tag) => {
        history.push(`/search/${tag}`);
    }

    return (
        <div className="thread-wrapper">
            <div className="d-flex flex-row">
                <div className="d-flex flex-column">
                    <p><b>{thread.author}</b></p>
                    <h5><Link to={"/thread/" + thread.id}>
                        {thread.subject}
                    </Link></h5>
                    <p>{thread.content}</p>
                    
                    <p className="text-muted">
                        <IconContext.Provider value={{ className: 'heart-icon' }}>
                            <AiFillHeart />
                        </IconContext.Provider> {thread.likes} likes &bull; { }
                        {getDateAgo(thread.createdAt)} ago
                    </p>
                    <ul id="tags">
                        {!thread.tags ? null : thread.tags.map((tag, index) => (
                            <Tag tag={tag} findTag={findTag} key={index} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
*/

let PageSize = 5;

export default function ThreadList({ user }) {

    const [threads, setThreads] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState("new");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const history = useHistory();

    const observer = useRef();
    const lastThreadElementRef = useCallback(node => {
        if (loading)
            return;
        if (observer.current)
            observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                //console.log(currentPage);
                setCurrentPage(prevPageNumber => prevPageNumber + 1);
            }
        });
        if (node)
            observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        setLoading(true);
        setError(false);
        const source = axios.CancelToken.source();
        const cancelToken = source.token;
        instance.get(`/threads?page=${currentPage - 1}&size=${PageSize}&sort=${sort}`, {
            cancelToken
        })
            .then((response) => {
                setThreads(prevThreads => {
                    return [...prevThreads, ...response.data.threads];
                });
                
                setHasMore(response.data.pageCount > 0);
                setLoading(false);
            })
            .catch((error) => {
                if (axios.isCancel(error)) {
                    console.log('Request cancelled ' + error.message);
                    return;
                }
                console.log(error);
                setError(true);
            });

            return (() => {
                source.cancel('cancel pweease');
            });
    }, [currentPage, sort]);

    const handleSelect = (selectedKey) => {
        if (selectedKey !== sort) {
            setThreads([]);
        }
        setCurrentPage(1);
        setSort(selectedKey);
        setLoading(true);
        setError(false);
    }

    function toggleLike(userLiked, id) {
        if (!user.token) {
            history.push("/login");
        } else if (userLiked) {
            instance.delete(`/users/${user.username}/liked/${id}`)
                .then(res => {
                    console.log(res.data);
                    setThreads(threads.map((currentThread) => {
                        if (currentThread.id === id) {
                            return {...currentThread, likes: currentThread.likes - 1, userLiked: false};
                        } else {
                            return currentThread;
                        }
                    }));
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            instance.post(`/users/${user.username}/threads/${id}/likes`)
                .then(res => {
                    console.log(res.data);
                    setThreads(threads.map((currentThread) => {
                        if (currentThread.id === id) {
                            return {...currentThread, likes: currentThread.likes + 1, userLiked: true};
                        } else {
                            return currentThread;
                        }
                    }));
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }

    const threadList = threads.map((currentThread, index) => {
        if (index + 1 === threads.length) {
            return <Thread thread={currentThread} key={currentThread.id} toggleLike={toggleLike} ref={lastThreadElementRef} />;
        } else {
            return <Thread thread={currentThread} key={currentThread.id} toggleLike={toggleLike} />;
        }
    });
    
    return (
        <Container fluid className="thread-container">
            
            <Nav variant="pills" className="justify-content-center mt-2"
                activeKey={`${sort}`}
                onSelect={(selectedKey) => handleSelect(selectedKey)}>
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

            {threadList}
            <div>{loading && 'Loading...'}</div>
            <div>{error && 'Error'}</div>

            {/*
            <CustomPagination
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={PageSize}
                onPageChange={page => setCurrentPage(page)}
            />
            */}
        </Container>
    );
}