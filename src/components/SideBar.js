import { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import { useHistory, useLocation, useRouteMatch } from 'react-router';

export default function SideBar({ user }) {
    const { url } = useRouteMatch();
    const history = useHistory();
    let location = useLocation();
    const [key, setKey] = useState(`${location.pathname}`);

    console.log(location.pathname);

    const handleSelect = (selectedKey) => {
        setKey(selectedKey);
        history.push(selectedKey);
    }

    return (
        <div className="sidebar">
            <Nav 
                variant="pills" 
                defaultActiveKey={`${url}`}
                activeKey={key}
                onSelect={(selectedKey) => {handleSelect(selectedKey)}}
                className="flex-sm-column"
            >
                <Nav.Link eventKey={`${url}`}>Home</Nav.Link>
                <Nav.Link eventKey={`${url}/threads`}>My Threads</Nav.Link>
                <Nav.Link eventKey={`${url}/posts`}>My Posts</Nav.Link>
                <Nav.Link eventKey={`${url}/liked`}>
                    Liked Threads
                </Nav.Link>
            </Nav>
        </div>
    );
}