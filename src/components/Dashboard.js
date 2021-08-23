import CreateThread from "./CreateThreadForm";
import PostThreadList from './UserPostList';
import UserThreadList from "./UserThreadList";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

export default function Dashboard({user}) {

  return(
    <Container fluid>
      <Container fluid className="thread-wrapper">
        <Tabs defaultActiveKey="threads" id="uncontrolled-tab-example" className="mb-3">
          <Tab eventKey="home" title="Activity">
            <CreateThread user={user} />
          </Tab>
          <Tab eventKey="threads" title="Threads">
            <UserThreadList user={user} />
          </Tab>
          <Tab eventKey="posts" title="Posts">
            <PostThreadList user={user} />
          </Tab>
        </Tabs>
        {/*<CreateThread user={user}/>
        <UserThreadList user={user}/>*/}
      </Container>
    </Container>
  );
}