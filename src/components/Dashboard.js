import UserThreadList from "./UserThreadList";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import SideBar from "./SideBar";
import ThreadList from "./ThreadList";
import { Route, Switch, useRouteMatch } from "react-router";
import UserPostList from "./UserPostList";
import PrivateRoute from "../PrivateRoute";

export default function Dashboard({user}) {
  let { path } = useRouteMatch();

  return (
    <Container fluid className="homepage">
      <Row>
        <Col>
          <SideBar user={user} />
        </Col>
        <Col xl={8}>
          <Switch>
            <Route exact path={path}>
              <ThreadList user={user} />
            </Route>
            <PrivateRoute user={user} path={`${path}/threads`}>
              <UserThreadList user={user} />
            </PrivateRoute>
            <PrivateRoute user={user} path={`${path}/posts`}>
              <UserPostList user={user} />
            </PrivateRoute>
          </Switch>
        </Col>
        <Col>
          <Button>Create new thread</Button>
        </Col>
      </Row>
    </Container>
  );
}