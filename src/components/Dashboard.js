import CreateThread from "./CreateThreadForm";
import UserThreadList from "./UserThreadList";
import Container from 'react-bootstrap/Container';
import { useState } from "react";
import { Nav } from "react-bootstrap";
import { Route, Switch, useRouteMatch } from "react-router";
import UserPostList from "./UserPostList";

export default function Dashboard({user}) {
  let { path, url } = useRouteMatch();

  return (
    <Container fluid>
      <Container fluid className="thread-wrapper">
        <Nav className="mb-3">
          <Nav.Item>
            <Nav.Link href={`${url}`}>Activity</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href={`${url}/threads`}>Threads</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href={`${url}/posts`}>Posts</Nav.Link>
          </Nav.Item>
        </Nav>

        <Switch>
          <Route exact path={path}>
            Under Construction
          </Route>
          <Route path={`${path}/threads`}>
            <UserThreadList user={user} />
          </Route>
          <Route path={`${path}/posts`}>
            <UserPostList user={user} />
          </Route>
        </Switch>        
      </Container>
    </Container>
  );
}