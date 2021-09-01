import Button from "react-bootstrap/Button"
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useHistory } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { IconContext } from "react-icons";

export default function NavBar({ user }){
    const history = useHistory();

    const handleClick = () => {
        history.push("/login");
    }

    const logout = () => {
        sessionStorage.clear();
        window.location.href = '/';
    }

    if (user.token) {
        return (
            <Navbar bg="light" variant="light" expand="lg" className="navbar-wrapper">
                <Navbar.Brand href="/">Forum</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link href="/create">Create a new thread</Nav.Link>
                    </Nav>
                    <Nav className="pr-2">
                        <Navbar.Text>
                            Signed in as: <a href="/dashboard">{user.username}</a>
                        </Navbar.Text>
                    </Nav>
                    <Button variant="outline-success" onClick={logout}>Log Out</Button>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    return (
        <Navbar bg="light" variant="light" expand="lg" className="navbar-wrapper">
            <Navbar.Brand href="/">Forum</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                </Nav>
                <Button variant="outline-success" onClick={handleClick}>Login</Button>
            </Navbar.Collapse>
        </Navbar>
    );
}