import Button from "react-bootstrap/Button"
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function NavBar({ user }){
    const history = useHistory();
    const [loggedIn, setLoggedIn] = useState(user.token ? true : false);

    const handleClick = () => {
        history.push("/login");
    }

    const logout = () => {
        sessionStorage.clear();
        history.push("/");
        setLoggedIn(false);
    }

    useEffect(() => {
        setLoggedIn(user.token ? true : false);
    }, [user.token]);

    if (loggedIn) {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">Forum</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                    </Nav>
                    <Navbar.Text>
                        Signed in as: <a href="/dashboard">{user.username}</a>
                    </Navbar.Text>
                    <Button variant="outline-success" onClick={logout}>Log Out</Button>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    return (
        <Navbar bg="light" expand="lg">
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