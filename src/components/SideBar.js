import Nav from 'react-bootstrap/Nav';
import { useHistory, useRouteMatch } from 'react-router';

export default function SideBar({ user }) {
    const { url } = useRouteMatch();
    const history = useHistory();

    const handleSelect = (selectedKey) => {
        history.push(selectedKey);
    }

    return (
        <div className="sidebar">
            <Nav 
                variant="pills" 
                defaultActiveKey={`${url}`}
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