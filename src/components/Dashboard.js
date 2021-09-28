import UserThreadList from "./UserThreadList";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import SideBar from "./SideBar";
import ThreadList from "./ThreadList";
import { useHistory, Route, Switch, useRouteMatch } from "react-router";
import UserPostList from "./UserPostList";
import LikedList from "./LikedList";
import PrivateRoute from "../PrivateRoute";
import TopTagsList from "./TopTagsList";

export default function Dashboard({user}) {
  let { path } = useRouteMatch();
  const history = useHistory();

  const handleClick = () => {
    history.push('/create');
  }

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
            <PrivateRoute user={user} path={`${path}/liked`}>
              <LikedList user={user} />
            </PrivateRoute>
          </Switch>
        </Col>
        <Col>
          <div className="right-button">
            <Button onClick={() => handleClick()}>Create new thread</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}